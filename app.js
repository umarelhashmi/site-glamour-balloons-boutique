/**
 * Glamour Balloons Boutique LLC — Bespoke Editorial Lookbook & Atelier Application
 * ================================================================================
 * Renders 100% verbatim visible text and official images from https://glamourballoonsboutique.com/
 * across all active pages, plus the native "LATEST from Glamour Balloons:" 3-media viewer.
 */

(function () {
  const D = window.GLAMOUR_DATA;
  if (!D) return;

  let currentPage = "home";

  function esc(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function mediaFrame(src, alt, extraClass = "", caption = "") {
    const label = caption || alt || "Glamour Balloons Boutique";
    return `
      <div class="photo-plate ${extraClass}" data-lightbox="${esc(src)}" data-caption="${esc(label)}" role="button" tabindex="0">
        <img src="${esc(src)}" alt="${esc(alt || label)}" decoding="async" />
      </div>
    `;
  }

  function socialLinksPair() {
    return `
      <div style="display:inline-flex;align-items:center;gap:0.75rem;font-size:0.84rem;font-weight:600;">
        <a href="https://www.facebook.com/GlamourBalloonsBoutique/" target="_blank" rel="noopener" class="btn-secondary" style="padding:0.4rem 0.85rem;">Facebook</a>
        <a href="https://www.instagram.com/glamourballoonsboutique/" target="_blank" rel="noopener" class="btn-secondary" style="padding:0.4rem 0.85rem;">Instagram</a>
      </div>
    `;
  }

  // =========================================================================
  // 1. HOME PAGE (https://glamourballoonsboutique.com/)
  // =========================================================================
  function renderHomePage() {
    const h = D.home;
    return `
      <section class="page-section active" id="page-home" data-page="home">
        <!-- Top invitation row -->
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;padding:1.5rem 0;border-bottom:1px solid var(--rule-hairline);">
          ${socialLinksPair()}
          <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">
            <span style="font-family:var(--font-display);font-size:1.35rem;font-weight:500;">${esc(h.topCtaHeading)}</span>
            <button type="button" class="btn-primary" data-nav="contact">${esc(h.topCtaButton)}</button>
          </div>
        </div>

        <!-- Hero Split (Baby in Bloom arch photo + verbatim intro) -->
        <div class="editorial-split">
          <div>
            ${mediaFrame("assets/images/official/2026_04_ChatGPT-Image-Apr-21-2026-06_52_33-PM.png", h.heroTitle, "", h.heroTitle)}
          </div>
          <div>
            <h1 class="hero-display-title" style="font-size:clamp(2.2rem,3.6vw,3.4rem);">${esc(h.heroTitle)}</h1>
            <div class="hero-story">
              ${h.heroParagraphs.map((p) => `<p>${esc(p)}</p>`).join("")}
            </div>
            <div class="hero-actions" style="flex-direction:column;align-items:flex-start;gap:0.45rem;">
              <button type="button" class="btn-primary" data-nav="contact">${esc(h.topCtaButton)}</button>
              <span style="font-size:0.8rem;font-weight:600;color:var(--rose-accent);">${esc(h.heroBadge)}</span>
            </div>
          </div>
        </div>

        <!-- NATIVE BUILT-IN VIEWER: "LATEST from Glamour Balloons:" -->
        <!-- Strictly NO word "Instagram" anywhere inside this section -->
        <div class="latest-velvet-band" id="latestFromGlamourSection">
          <div class="latest-velvet-inner">
            <div class="latest-velvet-header">
              <h2 class="latest-velvet-heading">LATEST from Glamour Balloons:</h2>
              <a href="https://www.instagram.com/glamourballoonsboutique/" target="_blank" rel="noopener" class="latest-view-more">
                view more -&gt;
              </a>
            </div>
            <div class="latest-filmstrip" id="latestMediaGrid"></div>
          </div>
        </div>

        <!-- Our Work (3-Column Triptych) -->
        <div class="editorial-section">
          <div class="editorial-heading-row">
            <h2 class="editorial-h2">${esc(h.ourWorkTitle)}</h2>
            <p class="editorial-lead">${esc(h.ourWorkSubtitle)}</p>
          </div>
          <div class="triptych-columns">
            <div class="triptych-col">
              ${mediaFrame("assets/images/official/2026_04_ChatGPT-Image-Apr-21-2026-06_52_33-PM.png", "BABY SHOWERS", "", "BABY SHOWERS")}
              <h3 class="triptych-title" style="text-align:center;">BABY SHOWERS</h3>
            </div>
            <div class="triptych-col">
              ${mediaFrame("assets/images/official/2026_04_ChatGPT-Image-Apr-21-2026-08_20_10-PM.png", "BIRTHDAYS", "", "BIRTHDAYS")}
              <h3 class="triptych-title" style="text-align:center;">BIRTHDAYS</h3>
            </div>
            <div class="triptych-col">
              ${mediaFrame("assets/images/official/2026_04_20251019_140250-1-scaled-1.jpg", "CHILDREN'S PARTIES", "", "CHILDREN'S PARTIES")}
              <h3 class="triptych-title" style="text-align:center;">CHILDREN'S PARTIES</h3>
            </div>
          </div>
        </div>

        <!-- Premium Services (3-Column Visual Grid matching orig_home.png) -->
        <div class="editorial-section">
          <div class="editorial-heading-row">
            <h2 class="editorial-h2">${esc(h.premiumServicesTitle)}</h2>
            <p class="editorial-lead">${esc(h.premiumServicesSubtitle)}</p>
          </div>
          <div class="mosaic-grid-3">
            ${h.premiumServices
              .map(
                (srv) => `
              <div style="display:flex;flex-direction:column;gap:0.65rem;">
                <h3 style="font-family:var(--font-display);font-size:1.4rem;font-weight:600;color:var(--rose-accent);">${esc(srv.title)}</h3>
                ${mediaFrame(srv.image, srv.title, "", srv.title)}
                <p style="font-size:0.9rem;color:var(--mulberry-body);">${esc(srv.description)}</p>
                <span style="font-size:0.86rem;font-weight:700;font-style:italic;color:var(--mulberry-ink);">${esc(srv.priceTag)}</span>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- Clients Who Trust Us -->
        <div class="editorial-section">
          <div class="editorial-heading-row">
            <h2 class="editorial-h2">Clients Who Trust Us</h2>
            <a href="https://g.page/r/CRMR3F90h88rEAE/review" target="_blank" rel="noopener" class="btn-secondary">Read More Reviews</a>
          </div>
          <div class="testimonial-columns">
            ${D.reviews.homeReviews
              .map(
                (r) => `
              <article class="testimonial-entry">
                <div class="testimonial-header">
                  <span class="testimonial-author">${esc(r.name)}</span>
                </div>
                <p class="testimonial-quote">${esc(r.text)}</p>
              </article>
            `
              )
              .join("")}
          </div>
          <div style="margin-top:1.5rem;">
            <a href="https://g.page/r/CRMR3F90h88rEAE/review" target="_blank" rel="noopener" class="btn-secondary">Read More Reviews</a>
          </div>
        </div>

        <!-- Bottom CTA Row -->
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;padding:2rem 0;">
          ${socialLinksPair()}
          <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">
            <span style="font-family:var(--font-display);font-size:1.45rem;font-weight:500;">Let’s Make Your Vision A Reality</span>
            <button type="button" class="btn-primary" data-nav="contact">Start Your Booking</button>
          </div>
        </div>
      </section>
    `;
  }

  // =========================================================================
  // 2. WHAT WE OFFER! (/luxury-balloon-decoration/)
  // =========================================================================
  function renderWhatWeOfferPage() {
    const w = D.whatWeOffer;
    return `
      <section class="page-section" id="page-what-we-offer" data-page="what-we-offer">
        <div class="editorial-section">
          <div style="margin-bottom:1rem;">${socialLinksPair()}</div>
          <h1 class="editorial-h1" style="margin-bottom:0.85rem;">${esc(w.heading)}</h1>
          <div style="margin-bottom:1rem;">
            <button type="button" class="btn-primary" data-nav="contact">Start Your Booking</button>
          </div>
          <p class="editorial-lead" style="margin-bottom:1.5rem;font-weight:600;color:var(--champagne-deep);">${esc(w.subheading)}</p>

          <div class="mosaic-grid-4" style="margin-bottom:1.5rem;">
            ${mediaFrame("assets/images/official/2026_07_file_00000000908c71f7aff989bcbd0c59cd.png", "car mcqueen balloon decor")}
            ${mediaFrame("assets/images/official/2026_10_Untitled-Design-37.png", "luxury draping decor")}
            ${mediaFrame("assets/images/official/2026_07_ChatGPT-Image-Jul-14-2026-10_42_06-PM.png", "baby shower teddy bear girl")}
            ${mediaFrame("assets/images/official/2026_04_ChatGPT-Image-Apr-22-2026-07_59_54-PM-e1784085638658.png", "luxury focal point")}
          </div>

          <p class="editorial-lead" style="margin-bottom:1rem;">${esc(w.introParagraph)}</p>
          <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Get An Estimate</a>
        </div>

        <!-- 14 Services in a 2-Column Visual Grid (matching orig_what_we_offer.png) -->
        <div class="editorial-section">
          <div class="mosaic-grid-2">
            ${w.services
              .map(
                (s) => `
              <div style="display:grid;grid-template-columns:180px 1fr;gap:1.25rem;align-items:center;padding:1rem;border:1px solid var(--rule-hairline);background:var(--porcelain-warm);">
                <div>
                  ${mediaFrame(s.image, s.title, "", s.title)}
                </div>
                <div>
                  <h3 style="font-family:var(--font-display);font-size:1.3rem;font-weight:600;color:var(--champagne-deep);margin-bottom:0.35rem;">${esc(s.title)}</h3>
                  <p style="font-size:0.88rem;color:var(--mulberry-body);margin-bottom:0.5rem;">${esc(s.description)}</p>
                  ${
                    s.title === "Party Rentals"
                      ? `<button type="button" class="btn-secondary" style="padding:0.35rem 0.75rem;font-size:0.74rem;" data-nav="grab-go">SEE OUR PACKAGES</button>`
                      : s.title === "Balloon Twisting"
                      ? `<span style="font-size:0.76rem;font-weight:700;color:var(--mulberry-muted);">COMING SOON</span>`
                      : ""
                  }
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- Book Your Balloon Decorations Today! & Celebrate with Style -->
        <div class="editorial-section" style="border-bottom:none;">
          <div style="margin-bottom:2rem;">
            <h2 class="editorial-h2" style="color:var(--rose-accent);margin-bottom:0.75rem;">Book Your Balloon Decorations Today!</h2>
            <div style="display:flex;align-items:center;gap:0.85rem;flex-wrap:wrap;">
              <a href="${esc(D.business.phoneHref)}" class="btn-secondary">${esc(D.business.phoneFullDisplay)}</a>
              <a href="${esc(D.business.whatsappDirectHref)}" target="_blank" rel="noopener" class="btn-secondary">Start A WhatsApp Chat</a>
              <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Get An Estimate</a>
            </div>
          </div>

          <div class="editorial-split" style="padding:0;border-bottom:none;">
            <div>
              ${mediaFrame(w.celebrateWithStyle.image, w.celebrateWithStyle.title, "contain-plate", w.celebrateWithStyle.title)}
            </div>
            <div>
              <h2 class="editorial-h2" style="margin-bottom:0.75rem;">${esc(w.celebrateWithStyle.title)}</h2>
              ${w.celebrateWithStyle.paragraphs
                .map((p) => `<p style="font-size:0.94rem;color:var(--mulberry-body);margin-bottom:0.65rem;">${esc(p)}</p>`)
                .join("")}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // =========================================================================
  // 3. LUXURY PACKAGES (/luxury-decorations/)
  // =========================================================================
  function renderLuxuryPackagesPage() {
    const lp = D.luxuryPackages;
    return `
      <section class="page-section" id="page-luxury-packages" data-page="luxury-packages">
        <div class="editorial-split">
          <div>
            <h1 class="editorial-h1">Celebrate With Glamour!</h1>
            <p class="editorial-lead" style="margin:0.5rem 0 1.25rem;">${esc(lp.subtitle)}</p>
            <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
              <button type="button" class="btn-primary" data-nav="contact">Start Your Booking</button>
              <button type="button" class="btn-secondary" data-nav="wedding-experience">Wedding Decor</button>
            </div>
          </div>
          <div>
            ${mediaFrame(lp.heroImage, "Celebrate With Glamour!", "contain-plate", "Celebrate With Glamour!")}
          </div>
        </div>

        <div class="editorial-section">
          <p style="font-size:0.78rem;color:var(--mulberry-muted);font-weight:600;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:0.35rem;">INSPIRATION IDEAS</p>
          <h2 class="editorial-h2" style="margin-bottom:1.25rem;">${esc(lp.inspirationHeading)}</h2>

          <div class="mosaic-grid-3" style="margin-bottom:1.25rem;">
            <div>
              ${mediaFrame(lp.galleryImages[1], "Luxury Inspiration 1", "contain-plate")}
            </div>
            <div>
              ${mediaFrame(lp.galleryImages[2], "Luxury Inspiration 2", "contain-plate")}
              <p style="font-size:0.86rem;color:var(--mulberry-muted);text-align:center;margin-top:0.5rem;">${esc(lp.inspirationText)}</p>
            </div>
            <div>
              ${mediaFrame(lp.galleryImages[3], "Luxury Inspiration 3", "contain-plate")}
            </div>
          </div>

          <div class="mosaic-grid-3">
            <div>
              ${mediaFrame(lp.galleryImages[4], "Luxury Inspiration 4", "contain-plate")}
            </div>
            <div>
              ${mediaFrame(lp.galleryImages[5], "Luxury Inspiration 5", "contain-plate")}
              <p style="font-size:0.86rem;color:var(--mulberry-muted);text-align:center;margin-top:0.5rem;">${esc(lp.milestoneText)}</p>
            </div>
            <div>
              ${mediaFrame(lp.galleryImages[6], "Luxury Inspiration 6", "contain-plate")}
            </div>
          </div>
        </div>

        <div class="editorial-section" style="border-bottom:none;">
          <h2 class="editorial-h2" style="margin-bottom:0.65rem;">${esc(lp.tailoredTitle)}</h2>
          ${lp.tailoredParagraphs.map((p) => `<p class="editorial-lead" style="margin-bottom:0.5rem;">${esc(p)}</p>`).join("")}

          <div class="editorial-split">
            <div>
              ${mediaFrame(lp.shimmerSection.image, lp.shimmerSection.title, "", lp.shimmerSection.title)}
            </div>
            <div>
              <h2 class="editorial-h2" style="font-size:1.75rem;margin-bottom:0.65rem;">${esc(lp.shimmerSection.title)}</h2>
              ${lp.shimmerSection.paragraphs.map((p) => `<p style="font-size:0.94rem;color:var(--mulberry-body);margin-bottom:0.65rem;">${esc(p)}</p>`).join("")}
              <p style="font-size:0.84rem;font-weight:700;color:var(--mulberry-ink);margin-bottom:0.4rem;">Available Sizes:</p>
              <ul class="package-inclusions">
                ${lp.shimmerSection.sizes.map((s) => `<li>${esc(s)}</li>`).join("")}
              </ul>
            </div>
          </div>

          <div class="editorial-split">
            <div>
              ${mediaFrame(lp.flowerWallSection.image, lp.flowerWallSection.title, "", lp.flowerWallSection.title)}
            </div>
            <div>
              <h2 class="editorial-h2" style="font-size:1.75rem;margin-bottom:0.65rem;">${esc(lp.flowerWallSection.title)}</h2>
              ${lp.flowerWallSection.paragraphs.map((p) => `<p style="font-size:0.94rem;color:var(--mulberry-body);margin-bottom:0.65rem;">${esc(p)}</p>`).join("")}
              <p style="font-size:0.84rem;font-weight:700;color:var(--mulberry-ink);margin-bottom:0.4rem;">Available Sizes:</p>
              <ul class="package-inclusions">
                ${lp.flowerWallSection.sizes.map((s) => `<li>${esc(s)}</li>`).join("")}
              </ul>
            </div>
          </div>

          <div style="text-align:center;padding:2rem 0;border-bottom:1px solid var(--rule-hairline);">
            <h3 class="editorial-h2" style="font-size:1.65rem;margin-bottom:0.75rem;">Visit Our Wedding Experience Page</h3>
            <button type="button" class="btn-primary" data-nav="wedding-experience">Wedding Decor</button>
          </div>

          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;padding-top:1.75rem;">
            ${socialLinksPair()}
            <button type="button" class="btn-primary" data-nav="contact">Start Your Booking</button>
          </div>
        </div>
      </section>
    `;
  }

  // =========================================================================
  // 4. THE WEDDING EXPERIENCE (/wedding_decor/)
  // =========================================================================
  function renderWeddingExperiencePage() {
    const w = D.weddingExperience;
    const pkg = w.packages[0]; // Only The Elevate Package is visible on the live site
    return `
      <section class="page-section" id="page-wedding-experience" data-page="wedding-experience">
        <div class="editorial-split">
          <div>
            ${mediaFrame(w.heroImage, w.title, "contain-plate", w.title)}
            <h1 class="editorial-h2" style="margin-top:1rem;">${esc(w.title)}</h1>
            <p style="font-size:0.94rem;color:var(--mulberry-body);margin:0.5rem 0 1rem;">${esc(w.intro)}</p>
            <button type="button" class="btn-primary" data-nav="contact">${esc(w.ctaButton)}</button>
          </div>
          <div class="mosaic-grid-2" style="align-content:center;">
            ${w.pillars
              .map(
                (p) => `
              <div style="padding:1rem;border:1px solid var(--rule-hairline);background:var(--porcelain-warm);">
                <h3 style="font-family:var(--font-display);font-size:1.15rem;font-weight:700;text-transform:uppercase;margin-bottom:0.35rem;">${esc(p.title)}</h3>
                <p style="font-size:0.86rem;color:var(--mulberry-body);">${esc(p.text)}</p>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <div class="editorial-section">
          <div style="text-align:center;margin-bottom:1.5rem;">
            <h2 class="editorial-h2">${esc(w.servicesHeading)}</h2>
            <p style="font-size:0.9rem;color:var(--mulberry-muted);">${esc(w.servicesSubheading)}</p>
          </div>
          <div class="mosaic-grid-3">
            ${w.services
              .map(
                (s) => `
              <div style="padding:1.25rem;border:1px solid var(--rule-hairline);background:var(--porcelain-warm);">
                <h3 style="font-family:var(--font-display);font-size:1.25rem;font-weight:600;margin-bottom:0.4rem;">${esc(s.title)}</h3>
                <p style="font-size:0.88rem;color:var(--mulberry-body);">${esc(s.text)}</p>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- Welcome Signs & Highlights Split -->
        <div class="editorial-split">
          <div>
            ${mediaFrame(w.welcomeSigns.image, w.welcomeSigns.optionsTitle, "contain-plate", w.welcomeSigns.optionsTitle)}
            <p style="font-size:0.92rem;color:var(--mulberry-body);margin:1rem 0 0.65rem;">${esc(w.welcomeSigns.description)}</p>
            <p style="font-weight:700;color:var(--mulberry-ink);margin-bottom:0.35rem;">${esc(w.welcomeSigns.optionsTitle)}</p>
            <ul class="package-inclusions" style="margin-bottom:0.65rem;">
              ${w.welcomeSigns.options.map((o) => `<li>${esc(o)}</li>`).join("")}
            </ul>
            ${w.welcomeSigns.notes.map((n) => `<p style="font-size:0.84rem;color:var(--mulberry-body);margin-bottom:0.25rem;">${esc(n)}</p>`).join("")}
            <div style="margin-top:0.85rem;">
              <button type="button" class="btn-primary" data-nav="contact">Reserve Your Date</button>
            </div>
          </div>
          <div>
            ${mediaFrame(w.heroImage, w.title, "contain-plate", w.title)}
            <div style="display:flex;flex-direction:column;gap:0.55rem;font-size:0.9rem;font-weight:600;margin-top:1rem;">
              ${w.welcomeSigns.highlights.map((hl) => `<span>${esc(hl)}</span>`).join("")}
            </div>
          </div>
        </div>

        <!-- FEATURING: The Elevate Package -->
        <div class="editorial-section" style="border-bottom:none;">
          <p style="font-size:0.86rem;font-weight:700;letter-spacing:0.35em;color:var(--mulberry-ink);margin-bottom:0.5rem;">${esc(w.featuringHeading)}</p>
          <div class="editorial-split" style="padding-top:0.5rem;">
            <div>
              <h2 class="editorial-h2" style="margin-bottom:0.35rem;">${esc(pkg.title)}</h2>
              <p style="font-size:0.84rem;font-weight:700;color:var(--mulberry-ink);margin-bottom:0.25rem;">${esc(pkg.badge)}</p>
              <p style="font-size:0.9rem;color:var(--mulberry-body);margin-bottom:0.85rem;">${esc(pkg.subtitle)}</p>
              ${mediaFrame(pkg.image, pkg.title, "contain-plate", pkg.title)}
            </div>
            <div>
              <p style="font-size:0.94rem;color:var(--mulberry-body);margin-bottom:0.85rem;">${esc(pkg.description)}</p>
              <p style="font-size:0.9rem;font-weight:700;margin-bottom:0.45rem;">${esc(pkg.includesTitle)}</p>
              <ul class="package-inclusions">
                ${pkg.items.map((it) => `<li>${esc(it)}</li>`).join("")}
              </ul>
            </div>
          </div>

          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;padding-top:1.5rem;">
            ${socialLinksPair()}
            <span style="font-family:var(--font-display);font-size:1.45rem;font-weight:600;">Let’s Make Your Vision A Reality</span>
          </div>
        </div>
      </section>
    `;
  }

  // =========================================================================
  // 5. PARTY PACKAGES (/decor_packages/)
  // =========================================================================
  function renderPartyPackagesPage() {
    const pp = D.partyPackages;

    function renderPkgCard(pkg) {
      return `
        <div style="display:flex;flex-direction:column;border:1px solid var(--rule-hairline);background:var(--porcelain-warm);">
          <div style="padding:0.85rem;">
            ${mediaFrame(pkg.image, pkg.title, "contain-plate", pkg.title)}
          </div>
          <div style="background:var(--mulberry-ink);color:var(--porcelain-pure);padding:0.9rem 1rem;text-align:center;">
            <h3 style="font-family:var(--font-display);font-size:1.3rem;font-weight:600;color:var(--porcelain-pure);">${esc(pkg.title)}</h3>
            <p style="font-size:0.8rem;opacity:0.9;margin-top:0.25rem;">${esc(pkg.subtitle)}</p>
          </div>
          <div style="padding:1.15rem;display:flex;flex-direction:column;gap:0.65rem;flex:1;">
            <div style="text-align:center;">
              ${pkg.badge ? `<span style="display:inline-block;font-size:0.72rem;font-weight:700;color:var(--rose-accent);margin-bottom:0.2rem;">${esc(pkg.badge)}</span><br/>` : ""}
              <span class="package-price-figure">$ ${esc(pkg.price === 1150 ? "1,150" : pkg.price)}</span>
              <div style="font-size:0.76rem;color:var(--mulberry-muted);">Starting at*</div>
            </div>
            <ul class="package-inclusions" style="grid-template-columns:1fr;">
              ${pkg.items.map((it) => `<li>${esc(it)}</li>`).join("")}
            </ul>
            <div style="margin-top:auto;padding-top:0.65rem;text-align:center;font-size:0.74rem;color:var(--mulberry-muted);font-weight:600;">
              <div>${esc(pkg.footerNote)}</div>
            </div>
          </div>
        </div>
      `;
    }

    return `
      <section class="page-section" id="page-party-packages" data-page="party-packages">
        <div class="editorial-section">
          <h1 class="editorial-h1" style="margin-bottom:1rem;">${esc(pp.eyebrow)}</h1>
          <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:1.5rem;margin-bottom:1.75rem;">
            ${socialLinksPair()}
            <div style="max-width:620px;">
              <h2 class="editorial-h2" style="font-size:1.6rem;margin-bottom:0.35rem;">${esc(pp.heading)}</h2>
              <p style="font-size:0.92rem;color:var(--mulberry-body);margin-bottom:0.45rem;">${esc(pp.intro)}</p>
              <p style="font-size:0.92rem;font-weight:600;color:var(--mulberry-ink);margin-bottom:0.85rem;">${esc(pp.customizableNote)}</p>
              <button type="button" class="btn-primary" data-nav="contact">Customize Your Package</button>
            </div>
          </div>

          <!-- 2 Comparison Guides from orig_party_packages.png -->
          <div class="mosaic-grid-2" style="margin-bottom:1.75rem;">
            ${mediaFrame("assets/images/official/2025_08_5.png", "Classic Arch vs. Balloon Garland", "contain-plate")}
            ${mediaFrame("assets/images/official/2025_08_6.png", "Setup & Style Guide", "contain-plate")}
          </div>

          <div class="mosaic-grid-2">
            <div>
              <h4 style="font-family:var(--font-display);font-size:1.2rem;margin-bottom:0.35rem;">ℹ️ Please Note:</h4>
              <p style="font-size:0.9rem;color:var(--mulberry-body);">📍 ${esc(pp.pleaseNote)}</p>
            </div>
            <div>
              <h4 style="font-family:var(--font-display);font-size:1.2rem;margin-bottom:0.35rem;">📍 Service Details</h4>
              <ul class="package-inclusions" style="grid-template-columns:1fr;">
                ${pp.serviceDetails.map((b) => `<li>${esc(b)}</li>`).join("")}
              </ul>
            </div>
          </div>
        </div>

        <!-- Classic Party Packages (3-Column Grid) -->
        <div class="editorial-section">
          <h2 class="editorial-h2" style="text-align:center;margin-bottom:0.35rem;">${esc(pp.tiers[0].tierName)}</h2>
          <p style="text-align:center;font-size:0.9rem;color:var(--mulberry-body);margin-bottom:1.5rem;">${esc(pp.tiers[0].tierIntro)}</p>
          <div class="mosaic-grid-3">
            ${pp.tiers[0].packages.map(renderPkgCard).join("")}
          </div>
        </div>

        <!-- Signature Packages (4-Column Grid) -->
        <div class="editorial-section">
          <h2 class="editorial-h2" style="text-align:center;margin-bottom:0.35rem;">${esc(pp.tiers[1].tierName)}</h2>
          <p style="text-align:center;font-size:0.9rem;color:var(--mulberry-body);margin-bottom:1.5rem;">${esc(pp.tiers[1].tierIntro)}</p>
          <div class="mosaic-grid-4">
            ${pp.tiers[1].packages.map(renderPkgCard).join("")}
          </div>
        </div>

        <!-- Premium Packages (3-Column Grid) -->
        <div class="editorial-section" style="border-bottom:none;">
          <h2 class="editorial-h2" style="text-align:center;margin-bottom:0.35rem;">${esc(pp.tiers[2].tierName)}</h2>
          <p style="text-align:center;font-size:0.9rem;color:var(--mulberry-body);margin-bottom:1.5rem;">${esc(pp.tiers[2].tierIntro)}</p>
          <div class="mosaic-grid-3" style="margin-bottom:2rem;">
            ${pp.tiers[2].packages.map(renderPkgCard).join("")}
          </div>

          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;padding-top:1rem;border-top:1px solid var(--rule-hairline);">
            ${socialLinksPair()}
            <div style="display:flex;align-items:center;gap:1rem;flex-wrap:wrap;">
              <span style="font-family:var(--font-display);font-size:1.45rem;font-weight:600;">Let’s Make Your Vision a Reality</span>
              <button type="button" class="btn-primary" data-nav="contact">Start Your Booking</button>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // =========================================================================
  // 6. THEMATIC DECOR SETS (/party-decor-rental/)
  // =========================================================================
  function renderThematicSetsPage() {
    const ts = D.thematicSets;
    return `
      <section class="page-section" id="page-thematic-sets" data-page="thematic-sets">
        <div class="editorial-split">
          <div>
            <h1 class="editorial-h1" style="margin-bottom:0.65rem;">${esc(ts.eyebrow)}</h1>
            <p style="font-size:0.94rem;color:var(--mulberry-body);margin-bottom:0.65rem;">${esc(ts.intro)}</p>
            <p style="font-size:0.9rem;color:var(--mulberry-body);margin-bottom:1rem;">${esc(ts.serviceAreaText)}</p>
            <button type="button" class="btn-primary" data-nav="contact">CONTACT US</button>
          </div>
          <div>
            ${mediaFrame(ts.heroImage, ts.eyebrow, "contain-plate", ts.eyebrow)}
            <div style="display:flex;gap:0.65rem;justify-content:center;margin-top:0.75rem;">
              <a href="https://www.facebook.com/GlamourBalloonsBoutique/" target="_blank" rel="noopener" class="btn-secondary" style="padding:0.35rem 0.75rem;">Facebook</a>
              <a href="https://www.instagram.com/glamourballoonsboutique/" target="_blank" rel="noopener" class="btn-secondary" style="padding:0.35rem 0.75rem;">Instagram</a>
              <a href="http://wa.me/14076764233" target="_blank" rel="noopener" class="btn-secondary" style="padding:0.35rem 0.75rem;">Whatsapp</a>
            </div>
          </div>
        </div>

        <div class="editorial-split">
          <div>
            <p style="font-size:0.8rem;font-weight:700;text-transform:uppercase;color:var(--rose-accent);">PARTY DECOR RENTAL</p>
            <h2 class="editorial-h2">${esc(ts.startingAt)}</h2>
            <p style="font-size:0.92rem;color:var(--mulberry-body);margin:0.35rem 0 0.65rem;">${esc(ts.startingDesc)}</p>
            <h3 class="editorial-h2" style="font-size:1.65rem;margin-bottom:0.5rem;">${esc(ts.grabGoTitle)}</h3>
            <div style="margin-bottom:0.75rem;">
              <button type="button" class="btn-primary" data-nav="grab-go">More Info</button>
            </div>
            <p style="font-size:0.92rem;color:var(--mulberry-body);margin-bottom:0.65rem;">${esc(ts.grabGoIntro)}</p>
            <p style="font-size:0.9rem;font-weight:600;margin-bottom:0.45rem;">${esc(ts.includedTitle)}</p>
            <ul class="package-inclusions" style="grid-template-columns:1fr;margin-bottom:0.85rem;">
              ${ts.includedItems.map((i) => `<li>${esc(i)}</li>`).join("")}
            </ul>
            <p style="font-size:0.9rem;font-weight:600;margin-bottom:0.45rem;">${esc(ts.addOnsTitle)}</p>
            <ul class="package-inclusions" style="grid-template-columns:1fr;margin-bottom:0.85rem;">
              ${ts.addOns.map((a) => `<li>${esc(a)}</li>`).join("")}
            </ul>
            ${ts.disclaimers.map((d) => `<p class="package-spec-note" style="margin-bottom:0.35rem;">${esc(d)}</p>`).join("")}

            <div style="margin-top:1.25rem;">
              <p style="font-size:0.78rem;color:var(--mulberry-muted);text-transform:uppercase;">GRAB &amp; GO RENTAL DECORATIONS</p>
              <h3 class="editorial-h2" style="font-size:1.5rem;margin-bottom:0.45rem;">${esc(ts.howItWorksTitle)}</h3>
              <ul class="package-inclusions" style="grid-template-columns:1fr;">
                ${ts.howItWorksSteps.map((s) => `<li>${esc(s)}</li>`).join("")}
              </ul>
            </div>
          </div>
          <div>
            ${mediaFrame("assets/images/official/2023_09_Untitled-design_20230820_230443_0000-1-1.png", "Minnie Mouse Decor Set", "contain-plate", "Minnie Mouse Decor Set")}
          </div>
        </div>

        <div class="editorial-section" style="border-bottom:none;">
          <div class="editorial-heading-row">
            <h2 class="editorial-h2">EXCLUSIVE THEMATIC SETS</h2>
            <p class="editorial-lead">${esc(ts.exclusiveDescription)}</p>
          </div>
          <div class="mosaic-grid-2" style="margin-bottom:2rem;">
            ${ts.gallery
              .slice(1)
              .map((src, idx) => mediaFrame(src, `EXCLUSIVE THEMATIC SETS ${idx + 1}`, "contain-plate", `EXCLUSIVE THEMATIC SETS ${idx + 1}`))
              .join("")}
          </div>
          <div style="display:flex;align-items:center;justify-content:center;gap:0.85rem;flex-wrap:wrap;">
            <span style="font-weight:700;">Call Or Text Us:</span>
            <a href="${esc(D.business.phoneHref)}" class="btn-secondary">${esc(D.business.phoneFullDisplay)}</a>
            <a href="${esc(D.business.whatsappDirectHref)}" target="_blank" rel="noopener" class="btn-secondary">Start A WhatsApp Chat</a>
            <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Get A Free Estimate Here</a>
          </div>
        </div>
      </section>
    `;
  }

  // =========================================================================
  // 7. GRAB & GO DECOR (/grab_go/)
  // =========================================================================
  function renderGrabAndGoPage() {
    const gg = D.grabAndGo;
    return `
      <section class="page-section" id="page-grab-go" data-page="grab-go">
        <div class="editorial-section">
          <div style="margin-bottom:1rem;">${socialLinksPair()}</div>
          <h1 class="editorial-h1" style="margin-bottom:0.35rem;">${esc(gg.heroTitle)}</h1>
          <p class="editorial-lead" style="margin-bottom:0.85rem;">${esc(gg.heroSubtitle)}</p>
          <div style="margin-bottom:1.75rem;">
            <button type="button" class="btn-primary" data-nav="contact">Book Your Package</button>
          </div>

          <h2 class="editorial-h2" style="font-size:1.75rem;margin-bottom:0.25rem;">${esc(gg.setsHeading)}</h2>
          <p style="font-size:0.88rem;font-weight:700;margin-bottom:0.45rem;">${esc(gg.setsSubheading)}</p>
          <p class="editorial-lead" style="margin-bottom:0.55rem;">${esc(gg.setsDescription)}</p>
          <p style="font-size:0.9rem;margin-bottom:0.35rem;">${esc(gg.occasionsLine)}</p>
          <p style="font-size:0.86rem;font-weight:600;margin-bottom:1.25rem;">${esc(gg.pickupSummary)}</p>

          <div class="mosaic-grid-2" style="margin-bottom:1.5rem;">
            <div>
              <h4 style="font-family:var(--font-display);font-size:1.2rem;margin-bottom:0.45rem;">📌 Important Info:</h4>
              <ul class="package-inclusions" style="grid-template-columns:1fr;">
                ${gg.importantInfo.map((i) => `<li>${esc(i)}</li>`).join("")}
              </ul>
            </div>
            <div>
              <h4 style="font-family:var(--font-display);font-size:1.2rem;margin-bottom:0.45rem;">📅 Booking Info:</h4>
              <p style="font-size:0.9rem;color:var(--mulberry-body);margin-bottom:0.85rem;">${esc(gg.bookingInfo)}</p>
              <button type="button" class="btn-primary" data-nav="contact">Book Now</button>
            </div>
          </div>

          <!-- 4 Grab & Go Decor Sets in 4-Column Grid (matching orig_grab_go.png) -->
          <div class="mosaic-grid-4">
            ${gg.decorSets
              .map(
                (set) => `
              <div style="display:flex;flex-direction:column;border:1px solid var(--rule-hairline);background:var(--porcelain-warm);">
                ${mediaFrame(set.image, set.title, "contain-plate", set.title)}
                <div style="background:var(--mulberry-ink);color:var(--porcelain-pure);padding:0.65rem;text-align:center;">
                  <h3 style="font-family:var(--font-display);font-size:1.2rem;color:var(--porcelain-pure);">${esc(set.title)}</h3>
                </div>
                <div style="padding:1rem;display:flex;flex-direction:column;gap:0.55rem;flex:1;">
                  <div style="text-align:center;">
                    ${set.badge ? `<span style="font-size:0.72rem;font-weight:700;color:var(--rose-accent);">${esc(set.badge)}</span><br/>` : ""}
                    <span class="package-price-strike">$${set.originalPrice}</span>
                    <span class="package-price-figure">$ ${set.price}</span>
                  </div>
                  <ul class="package-inclusions" style="grid-template-columns:1fr;">
                    ${set.items.map((it) => `<li>${esc(it)}</li>`).join("")}
                  </ul>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- 4 Grab & Go Balloon Garlands in 4-Column Grid -->
        <div class="editorial-section">
          <h2 class="editorial-h2" style="margin-bottom:0.25rem;">${esc(gg.garlandsHeading)}</h2>
          <p style="font-weight:700;margin-bottom:0.45rem;">${esc(gg.garlandsSubheading)}</p>
          <p class="editorial-lead" style="margin-bottom:0.55rem;">${esc(gg.garlandsDescription)}</p>
          <div style="margin-bottom:0.75rem;">
            ${gg.garlandsBullets.map((b) => `<p style="font-size:0.88rem;margin-bottom:0.2rem;">${esc(b)}</p>`).join("")}
          </div>
          <p style="font-size:0.88rem;margin-bottom:0.75rem;"><strong>📅 Booking Info:</strong> Please place your order at least 5-7 days in advance to ensure availability and prep time. Last-minute bookings are not guaranteed and are subject to availability and rush fees.</p>
          <div style="margin-bottom:1.5rem;">
            <button type="button" class="btn-primary" data-nav="contact">Book Now</button>
          </div>

          <div class="mosaic-grid-4">
            ${gg.garlands
              .map(
                (g) => `
              <div style="display:flex;flex-direction:column;border:1px solid var(--rule-hairline);background:var(--porcelain-warm);">
                ${mediaFrame(g.image, g.title, "contain-plate", g.title)}
                <div style="background:var(--mulberry-ink);color:var(--porcelain-pure);padding:0.65rem;text-align:center;">
                  <h3 style="font-family:var(--font-display);font-size:1.15rem;color:var(--porcelain-pure);">${esc(g.title)}</h3>
                </div>
                <div style="padding:1rem;display:flex;flex-direction:column;gap:0.55rem;flex:1;">
                  <div>
                    ${g.badge ? `<span style="font-size:0.72rem;font-weight:700;color:var(--rose-accent);">${esc(g.badge)}</span><br/>` : ""}
                    <span class="package-price-figure">$ ${g.price}</span>
                    <span style="font-size:0.76rem;color:var(--mulberry-muted);"> ${esc(g.priceLabel)}</span>
                  </div>
                  <ul class="package-inclusions" style="grid-template-columns:1fr;">
                    ${g.items.map((it) => `<li>${esc(it)}</li>`).join("")}
                  </ul>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- FAQ (2-Column Grid, closed by default like orig_grab_go.png) -->
        <div class="editorial-section" style="border-bottom:none;">
          <h2 class="editorial-h2" style="text-align:center;margin-bottom:1.25rem;">FAQ</h2>
          <div class="couture-accordion mosaic-grid-2" style="margin-bottom:2rem;">
            ${gg.faqs
              .map(
                (f) => `
              <div class="accordion-item">
                <button type="button" class="accordion-trigger">
                  <span>${esc(f.q)}</span>
                  <span class="accordion-icon">+</span>
                </button>
                <div class="accordion-body">${esc(f.a)}</div>
              </div>
            `
              )
              .join("")}
          </div>
          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
            ${socialLinksPair()}
            <h4 class="editorial-h2" style="font-size:1.45rem;">Your Event Made To Be Remembered!</h4>
          </div>
        </div>
      </section>
    `;
  }

  // =========================================================================
  // 8. CONTACT PAGE (/contact-us-2/)
  // =========================================================================
  function renderContactPage() {
    const fq = D.faqs;
    const b = D.business;
    return `
      <section class="page-section" id="page-contact" data-page="contact">
        <div class="editorial-section" style="text-align:center;">
          <h1 class="editorial-h1" style="margin-bottom:0.45rem;">CONTACT US</h1>
          <p style="font-size:0.84rem;letter-spacing:0.08em;text-transform:uppercase;color:var(--mulberry-body);max-width:640px;margin:0 auto 1.15rem;">
            TELL US ABOUT YOUR CELEBRATION AND WE’LL CREATE A CUSTOM BALLOON EXPERIENCE DESIGNED FOR YOUR EVENT.
          </p>
          <a href="${esc(b.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Get An Estimate</a>

          <div class="mosaic-grid-2" style="max-width:640px;margin:2rem auto 1.25rem;text-align:left;">
            <div style="padding:1rem;border:1px solid var(--rule-hairline);">
              <h3 style="font-family:var(--font-display);font-size:1.25rem;margin-bottom:0.45rem;">Phone/ Text</h3>
              <a href="${esc(b.phoneHref)}" class="btn-primary" style="margin-bottom:0.35rem;">Call Now</a>
              <div style="font-size:0.86rem;color:var(--mulberry-muted);">${esc(b.phoneDisplay)}</div>
            </div>
            <div style="padding:1rem;border:1px solid var(--rule-hairline);">
              <h3 style="font-family:var(--font-display);font-size:1.25rem;margin-bottom:0.45rem;">WhatsApp (Only)</h3>
              <a href="http://wa.me/14076764233" target="_blank" rel="noopener" class="btn-primary" style="margin-bottom:0.35rem;">Chat With Us!</a>
              <div style="font-size:0.86rem;color:var(--mulberry-muted);">${esc(b.whatsappDisplay)}</div>
            </div>
          </div>

          <div style="margin-bottom:1.25rem;font-size:0.94rem;">
            <strong>Email</strong> &nbsp; <a href="mailto:${esc(b.email)}" style="font-weight:600;text-decoration:underline;">${esc(b.email)}</a>
          </div>

          <div style="font-size:0.88rem;color:var(--mulberry-body);">
            <strong>Customer Care Hours:</strong><br/>
            Monday – Saturday<br/>
            09:00 am – 08:00 pm<br/>
            Sundays – 11:00 am – 04:00 pm
          </div>
        </div>

        <!-- FAQ (2-Column Grid matching orig_contact.png) -->
        <div class="editorial-section" style="border-bottom:none;">
          <div style="text-align:center;margin-bottom:1.75rem;">
            <h2 class="editorial-h2">FAQ</h2>
            <p style="font-size:0.88rem;color:var(--rose-accent);">Most frequent questions and answers</p>
          </div>
          <div class="mosaic-grid-2" style="margin-bottom:2.5rem;">
            ${fq.contactPageFaqs
              .map(
                (f) => `
              <div style="padding:1rem 0;border-bottom:1px solid var(--rule-hairline);">
                <h3 style="font-size:0.9rem;font-weight:700;text-transform:uppercase;color:var(--champagne-deep);margin-bottom:0.4rem;">${esc(f.q)}</h3>
                <p style="font-size:0.88rem;color:var(--mulberry-body);">${esc(f.a)}</p>
              </div>
            `
              )
              .join("")}
          </div>

          <div style="text-align:center;">
            <h3 class="editorial-h2" style="font-size:1.65rem;margin-bottom:0.75rem;">Let’s Make Your Vision A Reality</h3>
            <a href="${esc(b.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Start Your Booking</a>
          </div>
        </div>
      </section>
    `;
  }

  function mountAllPages() {
    const stage = document.getElementById("atelierStage");
    if (!stage) return;
    stage.innerHTML = [
      renderHomePage(),
      renderWhatWeOfferPage(),
      renderLuxuryPackagesPage(),
      renderWeddingExperiencePage(),
      renderPartyPackagesPage(),
      renderThematicSetsPage(),
      renderGrabAndGoPage(),
      renderContactPage()
    ].join("\n");
  }

  // =========================================================================
  // NATIVE "LATEST from Glamour Balloons:" 3-MEDIA VIEWER
  // Strictly zero occurrences of the word "Instagram" in this section!
  // =========================================================================
  function sanitizeNoInstagramWord(text) {
    return String(text || "").replace(/instagram/gi, "").replace(/\s+/g, " ").trim();
  }

  function renderLatestMediaCards(items) {
    const grid = document.getElementById("latestMediaGrid");
    if (!grid) return;

    const fallbackPhotos = [
      "assets/images/official/2026_04_ChatGPT-Image-Apr-21-2026-08_20_10-PM.png",
      "assets/images/official/2026_04_ChatGPT-Image-Apr-24-2026-11_23_24-PM.png",
      "assets/images/official/2026_04_ChatGPT-Image-Apr-25-2026-12_20_58-PM.png"
    ];

    grid.innerHTML = items
      .slice(0, 3)
      .map((item, idx) => {
        const cleanCaption = sanitizeNoInstagramWord(item.caption);
        const postUrl = item.postUrl || `https://www.instagram.com/glamourballoonsboutique/p/${item.shortcode}/`;
        const mediaUrl = item.mediaUrl || `/api/media-proxy?shortcode=${encodeURIComponent(item.shortcode)}`;
        const backupSrc = fallbackPhotos[idx % fallbackPhotos.length];
        return `
          <a href="${esc(postUrl)}" target="_blank" rel="noopener" class="latest-plate">
            <div class="latest-plate-media">
              <img src="${esc(mediaUrl)}" alt="Glamour Balloons Boutique ${idx + 1}" onerror="this.onerror=null;this.src='${esc(backupSrc)}';" />
            </div>
            <p class="latest-plate-caption">${esc(cleanCaption)}</p>
          </a>
        `;
      })
      .join("");
  }

  async function loadLatestThreeMedia() {
    const fallbackItems = [
      {
        shortcode: "DezAKHhJ2Fq",
        postUrl: "https://www.instagram.com/glamourballoonsboutique/reel/DezAKHhJ2Fq/",
        mediaUrl: "/api/media-proxy?shortcode=DezAKHhJ2Fq",
        caption:
          "Oh, boy! A magical Mickey Mouse birthday celebration! ❤️🖤💛 Bringing this classic theme to life with vibrant balloon garlands, bold colors, and playful details that made this day extra special. ✨",
        isVideo: true
      },
      {
        shortcode: "Deb9_S8xabU",
        postUrl: "https://www.instagram.com/glamourballoonsboutique/reel/Deb9_S8xabU/",
        mediaUrl: "/api/media-proxy?shortcode=Deb9_S8xabU",
        caption:
          "🕊️ A Beautiful Life, Forever Remembered. 🤍 An elegant celebration of life, honoring precious memories with timeless white and gold balloon styling, soft florals, and heartfelt details.",
        isVideo: true
      },
      {
        shortcode: "Dea1MRVxEqY",
        postUrl: "https://www.instagram.com/glamourballoonsboutique/reel/Dea1MRVxEqY/",
        mediaUrl: "/api/media-proxy?shortcode=Dea1MRVxEqY",
        caption:
          "🎈 BEAUTIFUL PARTY DECOR WITHOUT THE FULL-SERVICE PRICE! ✨ Planning a celebration? Our Grab & Go Rental Packages make it easy to create a stylish, photo-ready setup on a budget!",
        isVideo: true
      }
    ];

    renderLatestMediaCards(fallbackItems);

    try {
      const resp = await fetch("/api/latest-media");
      if (resp.ok) {
        const data = await resp.json();
        if (data && Array.isArray(data.items) && data.items.length >= 3) {
          renderLatestMediaCards(data.items.slice(0, 3));
        }
      }
    } catch (e) {}
  }

  // =========================================================================
  // NAVIGATION, ACCORDIONS & LIGHTBOX
  // =========================================================================
  function navigateToPage(pageId, updateHash = true) {
    currentPage = pageId;

    document.querySelectorAll(".page-section").forEach((sec) => {
      sec.classList.toggle("active", sec.dataset.page === pageId);
    });

    document.querySelectorAll("[data-nav]").forEach((btn) => {
      if (btn.classList.contains("chapter-link") || btn.classList.contains("dock-btn")) {
        btn.classList.toggle("active", btn.dataset.nav === pageId);
      }
    });

    if (updateHash) {
      history.replaceState(null, "", `#${pageId}`);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function openModal(id) {
    const m = document.getElementById(id);
    if (m) {
      m.classList.add("open");
      m.setAttribute("aria-hidden", "false");
    }
  }

  function closeModal(id) {
    const m = document.getElementById(id);
    if (m) {
      m.classList.remove("open");
      m.setAttribute("aria-hidden", "true");
    }
  }

  function bindEvents() {
    document.addEventListener("click", (e) => {
      const navBtn = e.target.closest("[data-nav]");
      if (navBtn) {
        e.preventDefault();
        navigateToPage(navBtn.dataset.nav);
        return;
      }

      const accTrigger = e.target.closest(".accordion-trigger");
      if (accTrigger) {
        const item = accTrigger.closest(".accordion-item");
        if (item) item.classList.toggle("open");
        return;
      }

      const lbTrigger = e.target.closest("[data-lightbox]");
      if (lbTrigger) {
        const src = lbTrigger.dataset.lightbox;
        const cap = lbTrigger.dataset.caption || "";
        const imgEl = document.getElementById("lightboxImg");
        const capEl = document.getElementById("lightboxCaption");
        if (imgEl && src) {
          imgEl.src = src;
          imgEl.alt = cap;
          if (capEl) capEl.textContent = cap;
          openModal("lightboxModal");
        }
        return;
      }

      const closeBtn = e.target.closest("[data-close-modal]");
      if (closeBtn) {
        closeModal(closeBtn.dataset.closeModal);
        return;
      }

      if (e.target.classList.contains("modal-backdrop")) {
        e.target.classList.remove("open");
      }
    });
  }

  mountAllPages();
  bindEvents();
  loadLatestThreeMedia();

  const initialHash = window.location.hash.replace("#", "").trim();
  if (initialHash && document.getElementById(`page-${initialHash}`)) {
    navigateToPage(initialHash, false);
  }
})();
