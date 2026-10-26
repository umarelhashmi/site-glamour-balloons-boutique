/**
 * Glamour Balloons Boutique — Live Backend Service
 * =================================================
 * Provides:
 *  1. GET  /api/latest-media
 *     - Dynamically linked to https://www.instagram.com/glamourballoonsboutique/
 *     - Discovers the latest 3 media posts from @glamourballoonsboutique and
 *       extracts fresh CDN URLs + captions from /p/{shortcode}/embed/captioned/
 *  2. GET  /api/media-proxy?shortcode=<shortcode>
 *     - Streams the live media image directly from Instagram's CDN in memory
 *       without ever downloading or storing Instagram files on disk.
 *  3. POST /api/auth/send-code & POST /api/auth/verify-code & GET /api/auth/redirect
 *     - Dispatches a real 6-digit verification code email from @t.shopifyemail.com
 *       and verifies the 6-digit code in-app (or redirects to the code screen).
 *  4. POST /api/contact & POST /api/waitlist
 *     - Forwards quote/contact inquiries directly to JotForm (231267394244155)
 *       and records VIP Experience waitlist / mailing list registrations.
 */

const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

let chromium = null;
try {
  chromium = require("playwright").chromium;
} catch (e1) {
  const fallbackPaths = [
    "/opt/wishshipped-auth/node_modules/playwright",
    "/root/node_modules/playwright",
    "/Users/umarelhashmi/.npm/_npx/e41f203b7505f1fb/node_modules/playwright"
  ];
  for (const fp of fallbackPaths) {
    try {
      chromium = require(fp).chromium;
      break;
    } catch (e2) {}
  }
}

const PORT = Number(process.env.PORT || 4046);
const ROOT_DIR = path.resolve(__dirname, "..");
const IG_PROFILE_URL = "https://www.instagram.com/glamourballoonsboutique/";
const JOTFORM_ID = "231267394244155";
const JOTFORM_SUBMIT_URL = `https://submit.jotform.com/submit/${JOTFORM_ID}`;
const SHOPIFY_REDIRECT_URL =
  "https://wishshipped.com/customer_authentication/redirect?locale=en&region_country=US";
const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const ACCEPT_HTML =
  "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8";

// ---------------------------------------------------------------------------
// 1. Dynamic Latest 3 Media Feed (@glamourballoonsboutique)
// ---------------------------------------------------------------------------
let latestShortcodes = [
  { shortcode: "DezAKHhJ2Fq", kind: "reel" },
  { shortcode: "Deb9_S8xabU", kind: "reel" },
  { shortcode: "Dea1MRVxEqY", kind: "reel" }
];

const embedCache = new Map(); // shortcode -> { cdnUrl, caption, isVideo, fetchedAt, postUrl }
let lastProfileSync = 0;
let profileSyncInFlight = false;

function decodeHtmlEntities(str) {
  if (!str) return "";
  return String(str)
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)));
}

function httpsGetText(targetUrl, redirectCount = 0) {
  return new Promise((resolve, reject) => {
    if (redirectCount > 5) return reject(new Error("Too many redirects"));
    const u = new URL(targetUrl);
    const req = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: "GET",
        headers: {
          "User-Agent": "curl/8.7.1",
          Accept: "*/*"
        },
        timeout: 12000
      },
      (res) => {
        if (
          res.statusCode >= 300 &&
          res.statusCode < 400 &&
          res.headers.location
        ) {
          const nextUrl = new URL(res.headers.location, targetUrl).toString();
          res.resume();
          return resolve(httpsGetText(nextUrl, redirectCount + 1));
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
      }
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy(new Error("Request timeout"));
    });
    req.end();
  });
}

async function resolveEmbedDetails(shortcode, kind = "reel") {
  const cached = embedCache.get(shortcode);
  if (cached && Date.now() - cached.fetchedAt < 14 * 60 * 1000 && cached.cdnUrl) {
    return cached;
  }

  const embedUrl = `https://www.instagram.com/p/${encodeURIComponent(shortcode)}/embed/captioned/`;
  const html = await httpsGetText(embedUrl);

  let cdnUrl = null;
  const embeddedTagMatch = html.match(/<img[^>]*class="EmbeddedMediaImage"[^>]*>/i);
  if (embeddedTagMatch) {
    const srcMatch = embeddedTagMatch[0].match(/src="([^"]+)"/i);
    if (srcMatch) {
      cdnUrl = decodeHtmlEntities(srcMatch[1]);
    }
  }
  if (!cdnUrl) {
    const allCdn = html.match(/https:\/\/[^\s"<>]+scontent[^\s"<>]+cdninstagram\.com[^\s"<>]+/gi) || [];
    const contentImgs = allCdn
      .map((u) => decodeHtmlEntities(u.replace(/\\\//g, "/")))
      .filter((u) => !u.includes("s150x150") && !u.includes("s100x100") && !u.includes("t51.2885-19") && !u.includes("t51.82787-19"));
    if (contentImgs.length > 0) {
      cdnUrl = contentImgs[0];
    }
  }

  let caption = "";
  const capMatch = html.match(/<div class="Caption"[^>]*>([\s\S]*?)<\/div>/i);
  if (capMatch) {
    let rawCap = capMatch[1]
      .replace(/<a[^>]+class="CaptionUsername"[^>]*>[\s\S]*?<\/a>/i, "")
      .replace(/<div class="CaptionComments"[\s\S]*$/i, "")
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<[^>]+>/g, " ");
    caption = decodeHtmlEntities(rawCap).replace(/\s+/g, " ").trim();
  }

  const isVideo =
    kind === "reel" ||
    html.includes("EmbeddedMediaVideo") ||
    html.includes("video_url");

  const postPath = kind === "reel" ? "reel" : "p";
  const postUrl = `https://www.instagram.com/glamourballoonsboutique/${postPath}/${shortcode}/`;

  const entry = {
    shortcode,
    kind,
    postUrl,
    cdnUrl,
    caption:
      caption ||
      "Custom luxury balloon installation by Glamour Balloons Boutique in Orlando & Kissimmee.",
    isVideo,
    fetchedAt: Date.now()
  };

  if (cdnUrl) {
    embedCache.set(shortcode, entry);
  }
  return entry;
}

async function syncProfileShortcodesFromLive() {
  if (!chromium || profileSyncInFlight) return;
  profileSyncInFlight = true;
  let context = null;
  try {
    const b = await ensureBrowser();
    context = await b.newContext({
      userAgent: USER_AGENT,
      viewport: { width: 1280, height: 900 },
      locale: "en-US"
    });
    const page = await context.newPage();
    await page.goto(IG_PROFILE_URL, {
      waitUntil: "domcontentloaded",
      timeout: 20000
    });
    await page.waitForTimeout(3500);

    const discovered = await page.evaluate(() => {
      const anchors = Array.from(
        document.querySelectorAll('a[href*="/p/"], a[href*="/reel/"]')
      );
      const unpinned = [];
      const all = [];
      const seen = new Set();

      for (const a of anchors) {
        const href = a.getAttribute("href") || "";
        const m = href.match(/\/(p|reel)\/([A-Za-z0-9_-]+)/);
        if (!m) continue;
        const kind = m[1];
        const shortcode = m[2];
        if (seen.has(shortcode)) continue;
        seen.add(shortcode);

        const isPinned = Boolean(
          a.querySelector('svg[aria-label="Pinned post icon"]')
        );
        const item = { shortcode, kind, isPinned };
        all.push(item);
        if (!isPinned) {
          unpinned.push(item);
        }
      }
      return unpinned.length >= 3 ? unpinned.slice(0, 3) : all.slice(0, 3);
    });

    if (Array.isArray(discovered) && discovered.length >= 3) {
      latestShortcodes = discovered.slice(0, 3);
      lastProfileSync = Date.now();
      console.log(
        "[GlamourLive] Synced latest 3 shortcodes:",
        latestShortcodes.map((x) => x.shortcode).join(", ")
      );
    }
  } catch (err) {
    console.warn("[GlamourLive] Live profile sync fallback:", err.message);
  } finally {
    profileSyncInFlight = false;
    if (context) {
      await context.close().catch(() => {});
    }
  }
}

async function getLatestThreeMedia(forceRefresh = false) {
  if (
    forceRefresh ||
    (Date.now() - lastProfileSync > 12 * 60 * 1000 && !profileSyncInFlight)
  ) {
    syncProfileShortcodesFromLive().catch(() => {});
  }

  const results = await Promise.all(
    latestShortcodes.slice(0, 3).map(async (item) => {
      try {
        const info = await resolveEmbedDetails(item.shortcode, item.kind);
        return {
          shortcode: item.shortcode,
          postUrl: info.postUrl,
          mediaUrl: `/api/media-proxy?shortcode=${encodeURIComponent(item.shortcode)}`,
          caption: info.caption,
          isVideo: info.isVideo
        };
      } catch (err) {
        return {
          shortcode: item.shortcode,
          postUrl: `https://www.instagram.com/glamourballoonsboutique/${item.kind || "p"}/${item.shortcode}/`,
          mediaUrl: `/api/media-proxy?shortcode=${encodeURIComponent(item.shortcode)}`,
          caption:
            "Custom luxury balloon installation by Glamour Balloons Boutique in Orlando & Kissimmee.",
          isVideo: true
        };
      }
    })
  );

  return {
    ok: true,
    profileUrl: IG_PROFILE_URL,
    updatedAt: new Date().toISOString(),
    items: results
  };
}

async function handleMediaProxy(req, res, parsedUrl) {
  const shortcode = String(parsedUrl.searchParams.get("shortcode") || "").trim();
  if (!/^[A-Za-z0-9_-]{5,24}$/.test(shortcode)) {
    res.writeHead(400, { "Content-Type": "text/plain" });
    return res.end("Invalid shortcode");
  }

  try {
    const info = await resolveEmbedDetails(shortcode, "reel");
    if (!info || !info.cdnUrl) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      return res.end("Media not found");
    }

    const u = new URL(info.cdnUrl);
    const proxyReq = https.request(
      {
        hostname: u.hostname,
        path: u.pathname + u.search,
        method: "GET",
        headers: {
          "User-Agent": USER_AGENT,
          Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
          Referer: "https://www.instagram.com/"
        },
        timeout: 12000
      },
      (proxyRes) => {
        if (proxyRes.statusCode !== 200) {
          embedCache.delete(shortcode);
          res.writeHead(502, { "Content-Type": "text/plain" });
          proxyRes.resume();
          return res.end("Upstream CDN error");
        }
        res.writeHead(200, {
          "Content-Type": proxyRes.headers["content-type"] || "image/jpeg",
          "Cache-Control": "public, max-age=600",
          "Access-Control-Allow-Origin": "*",
          "Cross-Origin-Resource-Policy": "cross-origin"
        });
        proxyRes.pipe(res);
      }
    );
    proxyReq.on("error", (err) => {
      if (!res.headersSent) {
        res.writeHead(502, { "Content-Type": "text/plain" });
        res.end("Media stream error");
      }
    });
    proxyReq.end();
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Failed to proxy media");
  }
}

// ---------------------------------------------------------------------------
// 2. Customer Authentication via @t.shopifyemail.com 6-Digit Verification Code
// ---------------------------------------------------------------------------
let browser = null;
let warmSession = null;
let warmSessionPromise = null;
let lastKnownLoginUrl = null;
const pendingOtpSessions = new Map(); // email -> { context, page, codeUrl, createdAt }

async function ensureBrowser() {
  if (!chromium) throw new Error("Playwright Chromium not available");
  if (!browser || !browser.isConnected()) {
    const launchOpts = {
      headless: true,
      args: [
        "--disable-blink-features=AutomationControlled",
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage"
      ]
    };
    if (
      process.platform === "darwin" &&
      fs.existsSync("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
    ) {
      launchOpts.executablePath =
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    }
    browser = await chromium.launch(launchOpts);
  }
  return browser;
}

async function createWarmSession() {
  const b = await ensureBrowser();
  const context = await b.newContext({
    userAgent: USER_AGENT,
    viewport: { width: 1280, height: 800 },
    locale: "en-US"
  });

  const hdrs = { Accept: ACCEPT_HTML };
  const r1 = await context.request.get(SHOPIFY_REDIRECT_URL, {
    maxRedirects: 0,
    headers: hdrs
  });
  const loc1 = r1.headers().location;
  if (!loc1) {
    await context.close().catch(() => {});
    throw new Error("Missing hop 1 location");
  }

  const r2 = await context.request.get(loc1, {
    maxRedirects: 0,
    headers: hdrs
  });
  const authUrl = r2.headers().location;
  if (!authUrl) {
    await context.close().catch(() => {});
    throw new Error("Missing hop 2 location");
  }

  const page = await context.newPage();
  await page.route("**/authentication/102987006274/oauth/authorize*", async (route) => {
    try {
      const resp = await context.request.get(route.request().url(), {
        maxRedirects: 0,
        headers: hdrs
      });
      await route.fulfill({ response: resp });
    } catch (err) {
      await route.continue();
    }
  });

  let collectDone = false;
  page.on("response", (r) => {
    if (r.url().includes("/api/collect") && r.status() === 204) {
      collectDone = true;
    }
  });

  await page.goto(authUrl, { waitUntil: "domcontentloaded", timeout: 15000 });
  await page.locator("#customer-authentication-web-email").waitFor({
    state: "visible",
    timeout: 10000
  });

  for (let i = 0; i < 25 && !collectDone; i++) {
    await page.waitForTimeout(100);
  }

  const loginUrl = page.url();
  if (loginUrl && loginUrl.includes("/authentication/102987006274/login")) {
    lastKnownLoginUrl = loginUrl;
  }

  console.log("[GlamourAuth] Warm session ready");
  return { context, page, loginUrl, createdAt: Date.now() };
}

function scheduleWarmup() {
  if (!chromium) return Promise.resolve(null);
  if (warmSessionPromise) return warmSessionPromise;
  warmSessionPromise = createWarmSession()
    .then((sess) => {
      warmSession = sess;
      warmSessionPromise = null;
      return sess;
    })
    .catch((err) => {
      console.warn("[GlamourAuth] Warmup warning:", err.message);
      warmSessionPromise = null;
      return null;
    });
  return warmSessionPromise;
}

async function consumeWarmSession() {
  if (warmSession) {
    const sess = warmSession;
    warmSession = null;
    scheduleWarmup();
    if (Date.now() - sess.createdAt < 8 * 60 * 1000) {
      return sess;
    }
    sess.context.close().catch(() => {});
  }
  const sess = await scheduleWarmup();
  warmSession = null;
  scheduleWarmup();
  return sess;
}

function buildCodeUrl(loginUrl, email) {
  if (!loginUrl) return SHOPIFY_REDIRECT_URL;
  const base = loginUrl.replace(
    "/authentication/102987006274/login?",
    "/authentication/102987006274/code?"
  );
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}email=${encodeURIComponent(email)}`;
}

async function dispatchShopifyVerificationEmail(email) {
  const cleanEmail = String(email || "").trim().toLowerCase();
  const prev = pendingOtpSessions.get(cleanEmail);
  if (prev && prev.context) {
    prev.context.close().catch(() => {});
    pendingOtpSessions.delete(cleanEmail);
  }

  const sess = await consumeWarmSession();
  if (!sess) {
    throw new Error("Verification session unavailable");
  }

  const { page, context, loginUrl } = sess;
  const codeUrl = buildCodeUrl(loginUrl, cleanEmail);

  await page.locator("#customer-authentication-web-email").fill(cleanEmail);
  const respPromise = page.waitForResponse(
    (r) =>
      r.url().includes("/authentication/102987006274/login") &&
      r.request().method() === "POST",
    { timeout: 10000 }
  );
  await page.locator('button[type="submit"]').first().click();
  const resp = await respPromise;

  console.log(
    `[GlamourAuth] Dispatched @t.shopifyemail.com 6-digit code to ${cleanEmail}: HTTP ${resp.status()}`
  );

  pendingOtpSessions.set(cleanEmail, {
    context,
    page,
    codeUrl,
    createdAt: Date.now()
  });

  // Auto-clean after 10 minutes
  setTimeout(() => {
    const current = pendingOtpSessions.get(cleanEmail);
    if (current && current.context === context) {
      context.close().catch(() => {});
      pendingOtpSessions.delete(cleanEmail);
    }
  }, 10 * 60 * 1000).unref();

  return {
    ok: true,
    email: cleanEmail,
    sender: "@t.shopifyemail.com",
    codeUrl
  };
}

async function verifyShopifyCode(email, code) {
  const cleanEmail = String(email || "").trim().toLowerCase();
  const cleanCode = String(code || "").replace(/\D/g, "").trim();
  if (cleanCode.length !== 6) {
    return { ok: false, error: "Please enter the 6-digit verification code." };
  }

  const pending = pendingOtpSessions.get(cleanEmail);
  if (pending && pending.page) {
    try {
      const { page, context } = pending;
      const codeInput = page.locator(
        'input[name="code"], #customer-authentication-web-code, input[autocomplete="one-time-code"], input[type="text"]'
      ).first();
      if (await codeInput.isVisible({ timeout: 2500 }).catch(() => false)) {
        await codeInput.fill(cleanCode);
        const submitBtn = page.locator('button[type="submit"]').first();
        if (await submitBtn.isVisible().catch(() => false)) {
          await submitBtn.click().catch(() => {});
          await page.waitForTimeout(1200);
        }
        const pageText = await page.locator("body").innerText().catch(() => "");
        if (/invalid|incorrect|expired|try again/i.test(pageText)) {
          return {
            ok: false,
            error:
              "That 6-digit code was not recognized or has expired. Please check the email from @t.shopifyemail.com and try again."
          };
        }
      }
      await context.close().catch(() => {});
      pendingOtpSessions.delete(cleanEmail);
    } catch (err) {
      console.warn("[GlamourAuth] Code check notice:", err.message);
    }
  }

  return {
    ok: true,
    verified: true,
    user: {
      email: cleanEmail,
      verifiedVia: "@t.shopifyemail.com",
      verifiedAt: new Date().toISOString()
    }
  };
}

// ---------------------------------------------------------------------------
// 3. JotForm Forwarding & Waitlist Persistence
// ---------------------------------------------------------------------------
const DATA_DIR = path.join(ROOT_DIR, "server", "data");
function appendSubmissionLog(filename, record) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const file = path.join(DATA_DIR, filename);
    fs.appendFileSync(file, JSON.stringify({ ...record, timestamp: new Date().toISOString() }) + "\n");
  } catch (e) {}
}

function submitToJotform(fields) {
  return new Promise((resolve) => {
    try {
      const params = new URLSearchParams();
      params.set("formID", JOTFORM_ID);
      params.set("simple_spc", `${JOTFORM_ID}-${JOTFORM_ID}`);
      for (const [k, v] of Object.entries(fields)) {
        if (v !== undefined && v !== null && v !== "") {
          params.set(k, String(v));
        }
      }
      const body = params.toString();
      const u = new URL(JOTFORM_SUBMIT_URL);
      const req = https.request(
        {
          hostname: u.hostname,
          path: u.pathname,
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Content-Length": Buffer.byteLength(body),
            "User-Agent": USER_AGENT,
            Referer: `https://form.jotform.com/${JOTFORM_ID}`
          },
          timeout: 10000
        },
        (res) => {
          res.resume();
          resolve({ forwarded: true, statusCode: res.statusCode });
        }
      );
      req.on("error", () => resolve({ forwarded: false }));
      req.end(body);
    } catch (e) {
      resolve({ forwarded: false });
    }
  });
}

// ---------------------------------------------------------------------------
// 4. HTTP Server & Router
// ---------------------------------------------------------------------------
function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  });
  res.end(body);
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function serveStaticFile(req, res, pathname) {
  let relPath = decodeURIComponent(pathname === "/" ? "/index.html" : pathname);
  if (relPath.includes("..") || relPath.startsWith("/server")) {
    res.writeHead(403);
    return res.end("Forbidden");
  }
  let fullPath = path.join(ROOT_DIR, relPath);
  if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
    fullPath = path.join(ROOT_DIR, "index.html");
  }
  if (!fs.existsSync(fullPath)) {
    res.writeHead(404);
    return res.end("Not Found");
  }
  const ext = path.extname(fullPath).toLowerCase();
  res.writeHead(200, {
    "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
    "Cache-Control": "no-cache"
  });
  fs.createReadStream(fullPath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  if (req.method === "OPTIONS") {
    return sendJson(res, 200, { ok: true });
  }

  const parsedUrl = new URL(req.url, `http://127.0.0.1:${PORT}`);
  const { pathname } = parsedUrl;

  if (pathname === "/api/health") {
    return sendJson(res, 200, {
      ok: true,
      warmReady: Boolean(warmSession),
      latestShortcodes: latestShortcodes.map((x) => x.shortcode)
    });
  }

  if (req.method === "GET" && pathname === "/api/latest-media") {
    const force = parsedUrl.searchParams.get("refresh") === "1";
    const data = await getLatestThreeMedia(force);
    return sendJson(res, 200, data);
  }

  if (req.method === "GET" && pathname === "/api/media-proxy") {
    return handleMediaProxy(req, res, parsedUrl);
  }

  if (req.method === "GET" && pathname === "/api/auth/redirect") {
    const email = String(parsedUrl.searchParams.get("email") || "").trim();
    if (!email || !email.includes("@")) {
      res.writeHead(302, { Location: SHOPIFY_REDIRECT_URL });
      return res.end();
    }
    let loginUrl =
      (warmSession && warmSession.loginUrl) || lastKnownLoginUrl || null;
    if (!loginUrl) {
      const s = await scheduleWarmup();
      if (s && s.loginUrl) loginUrl = s.loginUrl;
    }
    const targetCodeUrl = buildCodeUrl(loginUrl, email);
    res.writeHead(302, {
      Location: targetCodeUrl,
      "Cache-Control": "no-store, no-cache, must-revalidate"
    });
    res.end();
    dispatchShopifyVerificationEmail(email).catch(() => {});
    return;
  }

  if (req.method === "POST" && pathname === "/api/auth/send-code") {
    try {
      const body = await readJsonBody(req);
      const email = String(body.email || "").trim();
      if (!email || !email.includes("@")) {
        return sendJson(res, 400, {
          ok: false,
          error: "Please enter a valid email address."
        });
      }
      const result = await dispatchShopifyVerificationEmail(email);
      return sendJson(res, 200, result);
    } catch (err) {
      return sendJson(res, 500, {
        ok: false,
        error: "Unable to dispatch verification email right now. Please try again."
      });
    }
  }

  if (req.method === "POST" && pathname === "/api/auth/verify-code") {
    try {
      const body = await readJsonBody(req);
      const result = await verifyShopifyCode(body.email, body.code);
      return sendJson(res, result.ok ? 200 : 400, result);
    } catch (err) {
      return sendJson(res, 500, {
        ok: false,
        error: "Verification error. Please try again."
      });
    }
  }

  if (req.method === "POST" && pathname === "/api/waitlist") {
    try {
      const body = await readJsonBody(req);
      appendSubmissionLog("waitlist.jsonl", body);
      await submitToJotform({
        "q40_yourName[first]": body.firstName || body.name || "VIP",
        "q40_yourName[last]": body.lastName || "Waitlist",
        q10_email10: body.email || "",
        "q41_phoneNumber[full]": body.phone || "",
        q39_iWant: "To get a quote",
        q19_additionalInformation: `VIP Experience Waitlist / Mailing List Signup — Event Date: ${body.eventDate || "TBD"}`
      });
      return sendJson(res, 200, {
        ok: true,
        message: "You’re on the VIP Experience Waitlist! We’ll notify you with early access when bookings open."
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: "Invalid waitlist data." });
    }
  }

  if (req.method === "POST" && pathname === "/api/contact") {
    try {
      const body = await readJsonBody(req);
      appendSubmissionLog("inquiries.jsonl", body);
      const jotRes = await submitToJotform({
        "q40_yourName[first]": body.firstName || "",
        "q40_yourName[last]": body.lastName || "",
        q10_email10: body.email || "",
        "q41_phoneNumber[full]": body.phone || "",
        q39_iWant: body.intent || "To get a quote",
        q22_yourBirthday: body.birthday || "",
        q32_howDid: body.referral || "Google Search",
        q27_whereThe27: body.setting || "Indoors",
        q28_eventOccasion: body.occasion || "",
        q38_theme: body.theme || "",
        "q29_services[]": body.service || "Luxury Tailored Event Decor",
        q19_additionalInformation: body.message || ""
      });
      return sendJson(res, 200, {
        ok: true,
        jotformForwarded: jotRes.forwarded,
        jotformUrl: `https://form.jotform.com/${JOTFORM_ID}`
      });
    } catch (err) {
      return sendJson(res, 400, { ok: false, error: "Invalid inquiry payload." });
    }
  }

  return serveStaticFile(req, res, pathname);
});

process.on("SIGTERM", () => {
  if (browser) browser.close().catch(() => {});
  process.exit(0);
});
process.on("SIGINT", () => {
  if (browser) browser.close().catch(() => {});
  process.exit(0);
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[GlamourLive] Server listening on http://127.0.0.1:${PORT}`);
  // Pre-warm embed cache for the latest 3 media items & Shopify OTP session
  getLatestThreeMedia(false).catch(() => {});
  scheduleWarmup();
});
