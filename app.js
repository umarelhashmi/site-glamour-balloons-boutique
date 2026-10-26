/**
 * Glamour Balloons Boutique LLC — Bespoke Editorial Lookbook & Atelier Application
 * ================================================================================
 * Renders 100% verbatim text and official images from https://glamourballoonsboutique.com/
 * across all 17 pages, plus the native "LATEST from Glamour Balloons:" 3-media viewer,
 * Google Maps reviews, @t.shopifyemail.com 6-digit verification login, VIP waitlist,
 * JotForm integration, and WooCommerce cart checkout.
 */

(function () {
  const D = window.GLAMOUR_DATA;
  if (!D) return;

  let currentPage = "home";
  let currentUser = JSON.parse(localStorage.getItem("gbb_user") || "null");

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

  // =========================================================================
  // 1. RENDER ALL PAGES INTO #atelierStage (100% VERBATIM ORIGINAL TEXT)
  // =========================================================================
  function renderHomePage() {
    const h = D.home;
    const exp = h.theExperience;
    return `
      <section class="page-section active" id="page-home" data-page="home">
        <!-- Scenographic Asymmetric Hero -->
        <div class="hero-scenography">
          <div>
            <div class="hero-top-invitation">
              <span>${esc(h.topCtaHeading)}</span>
              <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-secondary" style="padding:0.4rem 0.95rem;font-size:0.78rem;">
                ${esc(h.topCtaButton)}
              </a>
            </div>

            <span class="hero-availability-note">${esc(h.heroBadge)}</span>
            <h1 class="hero-display-title">${esc(h.heroTitle)}</h1>
            <div class="hero-story">
              ${h.heroParagraphs.map((p) => `<p>${esc(p)}</p>`).join("")}
            </div>
            <div class="hero-actions">
              <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">${esc(h.topCtaButton)}</a>
            </div>
          </div>

          <div class="hero-plinth-stage">
            <div class="hero-plinth-Header">${esc(h.chooseExperienceTitle)}</div>
            <div class="hero-plinth-pair">
              ${h.chooseExperienceCards
                .map(
                  (c) => `
                <div class="plinth-figure" data-nav="${esc(c.targetPage)}">
                  <div class="photo-plate arch-plate">
                    <img src="${esc(c.image)}" alt="${esc(c.alt)}" fetchpriority="high" />
                  </div>
                </div>
              `
                )
                .join("")}
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

        <!-- Our Work — 3-Column Frameless Triptych -->
        <div class="editorial-section">
          <div class="editorial-heading-row">
            <h2 class="editorial-h2">${esc(h.ourWorkTitle)}</h2>
            <p class="editorial-lead">${esc(h.ourWorkSubtitle)}</p>
          </div>
          <div class="triptych-columns">
            ${h.ourWorkCategories
              .map(
                (cat) => `
              <div class="triptych-col" data-nav="${esc(cat.targetPage)}">
                ${mediaFrame(cat.image, cat.title, "arch-plate", cat.title)}
                <h3 class="triptych-title">${esc(cat.title)}</h3>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- Premium Services — Architectural Service Ledger -->
        <div class="editorial-section">
          <div class="editorial-heading-row">
            <h2 class="editorial-h2">${esc(h.premiumServicesTitle)}</h2>
            <p class="editorial-lead">${esc(h.premiumServicesSubtitle)}</p>
          </div>
          <div class="service-ledger">
            ${h.premiumServices
              .map(
                (srv) => `
              <div class="service-ledger-row">
                <div>
                  <h3 class="service-ledger-title">${esc(srv.title)}</h3>
                  <span class="service-ledger-price">${esc(srv.priceTag)}</span>
                </div>
                <div>
                  <p class="service-ledger-desc">${esc(srv.description)}</p>
                </div>
                <div class="service-ledger-media">
                  ${mediaFrame(srv.image, srv.title, "", srv.title)}
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- The Experience / VIP Experience -->
        <div class="peony-stage-box">
          <div class="editorial-split" style="padding:0;border-bottom:none;">
            <div class="mosaic-grid-2">
              ${mediaFrame(exp.logoImage, exp.title, "contain-plate", exp.title)}
              ${mediaFrame(exp.featureImage, exp.vipSectionTitle, "", exp.vipSectionTitle)}
            </div>
            <div>
              <p style="font-size:0.82rem;font-weight:600;color:var(--rose-accent);margin-bottom:0.35rem;">
                ${esc(exp.badge)}
              </p>
              <h2 class="editorial-h2" style="margin-bottom:0.75rem;">${esc(exp.title)}</h2>
              <div style="display:flex;flex-direction:column;gap:0.55rem;font-size:0.94rem;color:var(--mulberry-body);margin-bottom:1rem;">
                ${exp.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}
              </div>
              <p style="font-family:var(--font-display);font-size:1.35rem;color:var(--mulberry-ink);margin-bottom:0.2rem;">
                ${esc(exp.vipSectionTitle)}
              </p>
              <p style="font-size:0.86rem;font-weight:600;color:var(--rose-accent);margin-bottom:0.4rem;">
                ${esc(exp.vipSectionSubtitle)}
              </p>
              <p style="font-size:0.86rem;font-weight:600;color:var(--mulberry-ink);margin-bottom:0.9rem;">
                ${esc(exp.subText)}
              </p>
              <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
                <button type="button" class="btn-primary" data-open-waitlist="1">${esc(exp.buttonText)}</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Clients Who Trust Us -->
        <div class="editorial-section" style="border-bottom:none;">
          <div class="editorial-heading-row">
            <h2 class="editorial-h2">Clients Who Trust Us</h2>
            <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
              <a href="${esc(D.business.googleReviewUrl)}" target="_blank" rel="noopener" class="btn-secondary">Read More Reviews</a>
              <button type="button" class="btn-primary" data-nav="reviews">Read more reviews here…</button>
            </div>
          </div>
          <div class="reviews-ledger">
            ${D.reviews.homeReviews
              .map(
                (r) => `
              <div class="review-entry">
                <div class="review-byline">
                  <span>${esc(r.author)}</span>
                </div>
                <p class="review-quote">${esc(r.text)}</p>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderWhatWeOfferPage() {
    const w = D.whatWeOffer;
    return `
      <section class="page-section" id="page-what-we-offer" data-page="what-we-offer">
        <div class="editorial-section">
          <div class="editorial-heading-row">
            <div>
              <h1 class="editorial-h1">${esc(w.heading)}</h1>
              <p style="font-family:var(--font-display);font-size:1.25rem;font-style:italic;color:var(--rose-accent);margin-top:0.35rem;">
                ${esc(w.subheading)}
              </p>
            </div>
            <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
              <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Start Your Booking</a>
              <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-secondary">Get An Estimate</a>
            </div>
          </div>
          <p class="editorial-lead" style="max-width:75ch;margin-bottom:2rem;">${esc(w.introParagraph)}</p>

          <!-- 13-Image Official Lookbook Filmstrip -->
          <div class="lookbook-ribbon" aria-label="Official Installation Gallery">
            ${w.carouselImages
              .map((img) => mediaFrame(img.src, img.alt, "", img.alt))
              .join("")}
          </div>
        </div>

        <!-- All 14 Official Services — Architectural Ledger -->
        <div class="editorial-section">
          <div class="service-ledger">
            ${w.services
              .map(
                (s) => `
              <div class="service-ledger-row">
                <div>
                  <h2 class="service-ledger-title">${esc(s.title)}</h2>
                  ${s.badge ? `<span class="service-ledger-price">${esc(s.badge)}</span>` : ""}
                </div>
                <div>
                  <p class="service-ledger-desc">${esc(s.description)}</p>
                  ${
                    s.title === "Party Rentals"
                      ? `<div style="margin-top:0.75rem;"><button type="button" class="btn-primary" data-nav="grab-go" style="padding:0.45rem 1rem;font-size:0.8rem;">See Our Packages</button></div>`
                      : ""
                  }
                </div>
                <div class="service-ledger-media">
                  ${mediaFrame(s.image, s.title, "", s.title)}
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- Celebrate with Style -->
        <div class="peony-stage-box">
          <div class="editorial-split" style="padding:0;border-bottom:none;">
            <div>
              ${mediaFrame(w.celebrateWithStyle.image, w.celebrateWithStyle.title, "contain-plate", w.celebrateWithStyle.title)}
            </div>
            <div>
              <h4 style="font-family:var(--font-display);font-size:1.5rem;margin-bottom:0.65rem;">Book Your Balloon Decorations Today!</h4>
              <div style="display:flex;gap:0.65rem;flex-wrap:wrap;margin-bottom:1.25rem;">
                <a href="${esc(D.business.phoneHref)}" class="btn-secondary">${esc(D.business.phoneFullDisplay)}</a>
                <a href="${esc(D.business.whatsappDirectHref)}" target="_blank" rel="noopener" class="btn-secondary">Start A WhatsApp Chat</a>
                <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Get An Estimate</a>
              </div>
              <h3 class="editorial-h2" style="margin-bottom:0.75rem;">${esc(w.celebrateWithStyle.title)}</h3>
              <div style="display:flex;flex-direction:column;gap:0.55rem;font-size:0.94rem;color:var(--mulberry-body);">
                ${w.celebrateWithStyle.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderLuxuryPackagesPage() {
    const lp = D.luxuryPackages;
    return `
      <section class="page-section" id="page-luxury-packages" data-page="luxury-packages">
        <div class="editorial-section">
          <div class="editorial-heading-row">
            <div>
              <h1 class="editorial-h1">${esc(lp.title)}</h1>
              <p class="editorial-lead" style="margin-top:0.25rem;">${esc(lp.subtitle)}</p>
            </div>
            <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
              <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Start Your Booking</a>
              <button type="button" class="btn-secondary" data-nav="wedding-experience">Wedding Decor</button>
            </div>
          </div>
          <p style="font-size:0.84rem;color:var(--rose-accent);font-weight:600;margin-bottom:0.25rem;">${esc(lp.inspirationTag)}</p>
          <p class="editorial-lead" style="font-weight:600;margin-bottom:0.35rem;">${esc(lp.inspirationHeading)}</p>
          <p class="editorial-lead" style="margin-bottom:0.75rem;">${esc(lp.inspirationText)}</p>
          <p class="editorial-lead" style="font-weight:600;margin-bottom:1.5rem;">${esc(lp.milestoneText)}</p>

          <div class="mosaic-grid-4">
            ${lp.galleryImages
              .map((src, i) => mediaFrame(src, `${lp.title} ${i + 1}`, "", lp.milestoneText))
              .join("")}
          </div>
        </div>

        <div class="editorial-section" style="border-bottom:none;">
          <h3 class="editorial-h2" style="margin-bottom:0.75rem;">${esc(lp.tailoredTitle)}</h3>
          ${lp.tailoredParagraphs.map((p) => `<p class="editorial-lead" style="margin-bottom:0.5rem;">${esc(p)}</p>`).join("")}

          <div class="editorial-split">
            <div>
              ${mediaFrame(lp.shimmerSection.image, lp.shimmerSection.title, "", lp.shimmerSection.title)}
            </div>
            <div>
              <h2 class="editorial-h2" style="font-size:1.85rem;margin-bottom:0.65rem;">${esc(lp.shimmerSection.title)}</h2>
              ${lp.shimmerSection.paragraphs.map((p) => `<p style="font-size:0.94rem;color:var(--mulberry-body);margin-bottom:0.65rem;">${esc(p)}</p>`).join("")}
              <p style="font-size:0.84rem;font-weight:600;color:var(--mulberry-ink);margin-bottom:0.4rem;">Available Sizes:</p>
              <ul class="package-inclusions">
                ${lp.shimmerSection.sizes.map((s) => `<li>${esc(s)}</li>`).join("")}
              </ul>
            </div>
          </div>

          <div class="editorial-split" style="border-bottom:none;">
            <div>
              <h2 class="editorial-h2" style="font-size:1.85rem;margin-bottom:0.65rem;">${esc(lp.flowerWallSection.title)}</h2>
              ${lp.flowerWallSection.paragraphs.map((p) => `<p style="font-size:0.94rem;color:var(--mulberry-body);margin-bottom:0.65rem;">${esc(p)}</p>`).join("")}
              <p style="font-size:0.84rem;font-weight:600;color:var(--mulberry-ink);margin-bottom:0.4rem;">Available Sizes:</p>
              <ul class="package-inclusions" style="margin-bottom:1.1rem;">
                ${lp.flowerWallSection.sizes.map((s) => `<li>${esc(s)}</li>`).join("")}
              </ul>
              <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
                <button type="button" class="btn-primary" data-nav="wedding-experience">Visit Our Wedding Experience Page</button>
                <button type="button" class="btn-secondary" data-nav="wedding-experience">Wedding Decor</button>
              </div>
            </div>
            <div>
              ${mediaFrame(lp.flowerWallSection.image, lp.flowerWallSection.title, "", lp.flowerWallSection.title)}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderWeddingExperiencePage() {
    const w = D.weddingExperience;
    return `
      <section class="page-section" id="page-wedding-experience" data-page="wedding-experience">
        <div class="editorial-split">
          <div>
            ${mediaFrame(w.heroImage, w.title, "arch-plate", w.title)}
          </div>
          <div>
            <h1 class="editorial-h1">${esc(w.title)}</h1>
            <p class="editorial-lead" style="margin:0.85rem 0 1.25rem;">${esc(w.intro)}</p>
            <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
              <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">${esc(w.ctaButton)}</a>
            </div>
          </div>
        </div>

        <div class="editorial-section">
          <div class="mosaic-grid-4">
            ${w.pillars
              .map(
                (p) => `
              <div style="border-top:1px solid var(--rule-strong);padding-top:1rem;">
                <h3 style="font-family:var(--font-display);font-size:1.3rem;margin-bottom:0.4rem;">${esc(p.title)}</h3>
                <p style="font-size:0.9rem;color:var(--mulberry-body);">${esc(p.text)}</p>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <div class="editorial-section">
          <div class="editorial-heading-row">
            <div>
              <p style="font-size:0.84rem;color:var(--rose-accent);font-weight:600;">${esc(w.servicesHeading)}</p>
              <h2 class="editorial-h2">${esc(w.servicesSubheading)}</h2>
            </div>
          </div>
          <div class="triptych-columns">
            ${w.services
              .map(
                (s) => `
              <div class="triptych-col">
                <h3 class="triptych-title" style="margin-top:0;margin-bottom:0.5rem;">${esc(s.title)}</h3>
                <p style="font-size:0.92rem;color:var(--mulberry-body);">${esc(s.text)}</p>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- Customized Wedding Welcome Signs -->
        <div class="peony-stage-box">
          <div class="editorial-split" style="padding:0;border-bottom:none;">
            <div>
              ${mediaFrame(w.welcomeSigns.image, w.welcomeSigns.optionsTitle, "contain-plate", w.welcomeSigns.optionsTitle)}
            </div>
            <div>
              <p style="font-size:0.96rem;color:var(--mulberry-body);margin-bottom:0.75rem;">${esc(w.welcomeSigns.description)}</p>
              <p style="font-weight:600;color:var(--rose-accent);margin-bottom:0.35rem;">${esc(w.welcomeSigns.optionsTitle)}</p>
              <ul class="package-inclusions" style="margin-bottom:0.75rem;">
                ${w.welcomeSigns.options.map((o) => `<li>${esc(o)}</li>`).join("")}
              </ul>
              ${w.welcomeSigns.notes.map((n) => `<p style="font-size:0.84rem;color:var(--mulberry-body);margin-bottom:0.25rem;">${esc(n)}</p>`).join("")}
              <div style="margin:0.85rem 0;">
                <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Reserve Your Date</a>
              </div>
              <div style="display:flex;flex-direction:column;gap:0.25rem;font-size:0.84rem;font-weight:600;">
                ${w.welcomeSigns.highlights.map((hl) => `<span>${esc(hl)}</span>`).join("")}
              </div>
            </div>
          </div>
        </div>

        <!-- 5 Wedding Packages — Atelier Spec Ledger -->
        <div class="editorial-section" style="border-bottom:none;">
          <div class="editorial-heading-row">
            <div>
              <h2 class="editorial-h2">${esc(w.featuringHeading)}</h2>
            </div>
          </div>
          <div class="package-spec-list">
            ${w.packages
              .map(
                (pkg) => `
              <div class="package-spec-row">
                <div>
                  ${mediaFrame(pkg.image, pkg.title, "contain-plate", pkg.title)}
                </div>
                <div class="package-spec-main">
                  <h3>${esc(pkg.title)}</h3>
                  <p class="package-spec-sub" style="font-weight:600;color:var(--rose-accent);">${esc(pkg.subtitle)}</p>
                  ${pkg.description ? `<p class="package-spec-sub">${esc(pkg.description)}</p>` : ""}
                  ${pkg.includesTitle ? `<p style="font-size:0.84rem;font-weight:600;margin-bottom:0.35rem;">${esc(pkg.includesTitle)}</p>` : ""}
                  <ul class="package-inclusions">
                    ${pkg.items.map((it) => `<li>${esc(it)}</li>`).join("")}
                  </ul>
                </div>
                <div class="package-spec-aside">
                  ${pkg.badge ? `<span style="font-size:0.78rem;font-weight:600;color:var(--rose-accent);">${esc(pkg.badge)}</span>` : ""}
                </div>
              </div>
            `
              )
              .join("")}
          </div>

          <div style="margin-top:2rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
            <h3 class="editorial-h2" style="font-size:1.6rem;">Let’s Make Your Vision A Reality</h3>
            <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Reserve Your Luxury Look</a>
          </div>
        </div>
      </section>
    `;
  }

  function renderShimmerWallsPage() {
    const sw = D.shimmerWalls;
    return `
      <section class="page-section" id="page-shimmer-walls" data-page="shimmer-walls">
        <div class="editorial-split">
          <div>
            ${mediaFrame(sw.heroImage, `${sw.title} ${sw.subtitle}`, "contain-plate", `${sw.title} ${sw.subtitle}`)}
          </div>
          <div>
            <p style="font-size:0.82rem;font-weight:600;color:var(--rose-accent);margin-bottom:0.25rem;">${esc(sw.tag)}</p>
            <h1 class="editorial-h1">${esc(sw.title)} ${esc(sw.subtitle)}</h1>
            <h2 style="font-family:var(--font-display);font-size:1.5rem;color:var(--rose-accent);margin:0.45rem 0;">
              ${esc(sw.startingHeading)}
            </h2>
            ${sw.paragraphs.map((p) => `<p style="font-size:0.94rem;color:var(--mulberry-body);margin-bottom:0.55rem;">${esc(p)}</p>`).join("")}
            <div style="margin-top:0.9rem;">
              <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Book Now</a>
            </div>
          </div>
        </div>

        <div class="editorial-split">
          <div>
            <h2 class="editorial-h2">${esc(sw.colorsHeading)}</h2>
          </div>
          <div>
            ${mediaFrame(sw.colorsImage, sw.colorsHeading, "contain-plate", sw.colorsHeading)}
          </div>
        </div>

        <div class="editorial-section" style="border-bottom:none;">
          <h2 class="editorial-h2" style="margin-bottom:1.5rem;">${esc(sw.sizesHeading)}</h2>
          <div class="package-spec-list">
            ${sw.sizes
              .map(
                (sz) => `
              <div class="package-spec-row">
                <div>
                  ${mediaFrame(sz.image, sz.size, "", sz.size)}
                </div>
                <div class="package-spec-main">
                  <h3>${esc(sz.size)}</h3>
                  <p class="package-spec-sub">${esc(sz.subtitle)}</p>
                  <p style="font-size:0.8rem;font-weight:600;color:var(--mulberry-ink);margin-bottom:0.35rem;">What is included?</p>
                  <ul class="package-inclusions">
                    ${sz.included.map((i) => `<li>${esc(i)}</li>`).join("")}
                  </ul>
                  ${sz.additionalNote ? `<p class="package-spec-note">${esc(sz.additionalNote)}</p>` : ""}
                  <p class="package-spec-note">${esc(sz.note)}</p>
                </div>
                <div class="package-spec-aside">
                  <span class="package-price-figure">${esc(sz.priceDisplay)}</span>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>
    `;
  }

  function renderPartyPackagesPage() {
    const pp = D.partyPackages;
    return `
      <section class="page-section" id="page-party-packages" data-page="party-packages">
        <div class="editorial-section">
          <div class="editorial-heading-row">
            <div>
              <p style="font-size:0.84rem;color:var(--rose-accent);font-weight:600;margin-bottom:0.25rem;">${esc(pp.eyebrow)}</p>
              <h1 class="editorial-h1">${esc(pp.heading)}</h1>
            </div>
            <div>
              <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Customize Your Package</a>
            </div>
          </div>
          <p class="editorial-lead" style="margin-bottom:0.45rem;">${esc(pp.intro)}</p>
          <p class="editorial-lead" style="margin-bottom:1.75rem;">${esc(pp.customizableNote)}</p>

          <div class="mosaic-grid-2" style="margin-bottom:1.75rem;">
            ${pp.bannerImages.map((src, idx) => mediaFrame(src, `${pp.eyebrow} ${idx + 1}`, "contain-plate", `${pp.eyebrow} ${idx + 1}`)).join("")}
          </div>

          <div class="peony-stage-box" style="margin:0;">
            <p style="font-weight:600;color:var(--mulberry-ink);margin-bottom:0.35rem;">Please Note:</p>
            <p style="font-size:0.9rem;color:var(--mulberry-body);margin-bottom:0.85rem;">${esc(pp.pleaseNote)}</p>
            <p style="font-weight:600;color:var(--mulberry-ink);margin-bottom:0.35rem;">Service Details</p>
            <ul class="package-inclusions">
              ${pp.serviceDetails.map((d) => `<li>${esc(d)}</li>`).join("")}
            </ul>
          </div>
        </div>

        ${pp.tiers
          .map(
            (tier) => `
          <div class="package-menu-tier">
            <div class="tier-banner-header">
              <h2>${esc(tier.tierName)}</h2>
              <p>${esc(tier.tierIntro)}</p>
            </div>
            <div class="package-spec-list">
              ${tier.packages
                .map(
                  (pkg) => `
                <div class="package-spec-row">
                  <div>
                    ${mediaFrame(pkg.image, pkg.title, "contain-plate", pkg.title)}
                  </div>
                  <div class="package-spec-main">
                    <h3>${esc(pkg.title)}</h3>
                    <p class="package-spec-sub">${esc(pkg.subtitle)}</p>
                    <ul class="package-inclusions">
                      ${pkg.items.map((it) => `<li>${esc(it)}</li>`).join("")}
                    </ul>
                    <p class="package-spec-note">${esc(pkg.footerNote)}</p>
                  </div>
                  <div class="package-spec-aside">
                    ${pkg.badge ? `<span style="font-size:0.76rem;font-weight:600;color:var(--rose-accent);">${esc(pkg.badge)}</span>` : ""}
                    <span class="package-price-figure">${esc(pkg.priceLabel)}</span>
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          </div>
        `
          )
          .join("")}
      </section>
    `;
  }

  function renderThematicSetsPage() {
    const ts = D.thematicSets;
    return `
      <section class="page-section" id="page-thematic-sets" data-page="thematic-sets">
        <div class="editorial-split">
          <div>
            ${mediaFrame(ts.heroImage, ts.eyebrow, "", ts.eyebrow)}
          </div>
          <div>
            <p style="font-size:0.84rem;color:var(--rose-accent);font-weight:600;margin-bottom:0.25rem;">
              ${esc(ts.eyebrow)}
            </p>
            <p style="font-size:0.94rem;color:var(--mulberry-body);margin-bottom:0.65rem;">${esc(ts.intro)}</p>
            <p style="font-size:0.9rem;color:var(--mulberry-body);margin-bottom:0.85rem;">${esc(ts.serviceAreaText)}</p>
            <div style="margin-bottom:1.25rem;">
              <button type="button" class="btn-secondary" data-nav="contact">Contact us</button>
            </div>
            <p style="font-size:0.84rem;color:var(--rose-accent);font-weight:600;">${esc(ts.rentalHeading)}</p>
            <h1 class="editorial-h1">${esc(ts.startingAt)}</h1>
            <p style="font-size:0.92rem;color:var(--mulberry-body);margin:0.35rem 0 0.75rem;">${esc(ts.startingDesc)}</p>
            <h2 class="editorial-h2" style="font-size:1.65rem;">${esc(ts.grabGoTitle)}</h2>
            <p style="font-size:0.92rem;color:var(--mulberry-body);margin:0.35rem 0 0.85rem;">${esc(ts.grabGoIntro)}</p>
            <button type="button" class="btn-primary" data-nav="grab-go">More Info</button>
          </div>
        </div>

        <div class="editorial-split">
          <div>
            <h3 class="editorial-h2" style="font-size:1.65rem;margin-bottom:0.65rem;">${esc(ts.includedTitle)}</h3>
            <ul class="package-inclusions" style="margin-bottom:1rem;">
              ${ts.includedItems.map((i) => `<li>${esc(i)}</li>`).join("")}
            </ul>
            <h4 style="font-family:var(--font-display);font-size:1.25rem;margin-bottom:0.45rem;">${esc(ts.addOnsTitle)}</h4>
            <ul class="package-inclusions" style="margin-bottom:0.85rem;">
              ${ts.addOns.map((a) => `<li>${esc(a)}</li>`).join("")}
            </ul>
            ${ts.disclaimers.map((d) => `<p class="package-spec-note">${esc(d)}</p>`).join("")}
          </div>
          <div>
            <p style="font-size:0.84rem;color:var(--rose-accent);font-weight:600;">Grab &amp; Go Rental Decorations</p>
            <h3 class="editorial-h2" style="font-size:1.65rem;margin-bottom:0.65rem;">${esc(ts.howItWorksTitle)}</h3>
            <ol style="padding-left:1.2rem;display:flex;flex-direction:column;gap:0.55rem;font-size:0.92rem;color:var(--mulberry-body);margin-bottom:1.1rem;">
              ${ts.howItWorksSteps.map((s) => `<li>${esc(s)}</li>`).join("")}
            </ol>
          </div>
        </div>

        <div class="editorial-section" style="border-bottom:none;">
          <div class="editorial-heading-row">
            <h2 class="editorial-h2">${esc(ts.exclusiveTitle)}</h2>
            <p class="editorial-lead">${esc(ts.exclusiveDescription)}</p>
          </div>
          <div class="mosaic-grid-4" style="margin-bottom:2rem;">
            ${ts.gallery
              .map((src, idx) => mediaFrame(src, `${ts.exclusiveTitle} ${idx + 1}`, "contain-plate", `${ts.exclusiveTitle} ${idx + 1}`))
              .join("")}
          </div>
          <div style="display:flex;align-items:center;gap:0.85rem;flex-wrap:wrap;">
            <span style="font-weight:600;">Call Or Text Us:</span>
            <a href="${esc(D.business.phoneHref)}" class="btn-secondary">${esc(D.business.phoneFullDisplay)}</a>
            <a href="${esc(D.business.whatsappDirectHref)}" target="_blank" rel="noopener" class="btn-secondary">Start A WhatsApp Chat</a>
            <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Get A Free Estimate Here</a>
          </div>
        </div>
      </section>
    `;
  }

  function renderGrabAndGoPage() {
    const gg = D.grabAndGo;
    return `
      <section class="page-section" id="page-grab-go" data-page="grab-go">
        <div class="editorial-section">
          <div class="editorial-heading-row">
            <div>
              <h1 class="editorial-h1">${esc(gg.heroTitle)}</h1>
              <p class="editorial-lead" style="margin-top:0.35rem;">${esc(gg.heroSubtitle)}</p>
            </div>
            <div>
              <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Book Your Package</a>
            </div>
          </div>
          <h2 class="editorial-h2" style="font-size:1.75rem;margin-bottom:0.25rem;">${esc(gg.setsHeading)}</h2>
          <p style="font-size:0.84rem;color:var(--rose-accent);font-weight:600;margin-bottom:0.45rem;">${esc(gg.setsSubheading)}</p>
          <p class="editorial-lead" style="margin-bottom:0.45rem;">${esc(gg.setsDescription)}</p>
          <p style="font-size:0.9rem;font-weight:600;color:var(--rose-accent);margin-bottom:0.25rem;">${esc(gg.occasionsLine)}</p>
          <p style="font-size:0.86rem;font-weight:600;color:var(--mulberry-ink);margin-bottom:1.5rem;">${esc(gg.pickupSummary)}</p>

          <div class="peony-stage-box" style="margin:0;">
            <div class="mosaic-grid-2">
              <div>
                <h4 style="font-family:var(--font-display);font-size:1.3rem;margin-bottom:0.5rem;">Important Info:</h4>
                <ul class="package-inclusions" style="grid-template-columns:1fr;">
                  ${gg.importantInfo.map((i) => `<li>${esc(i)}</li>`).join("")}
                </ul>
              </div>
              <div>
                <h4 style="font-family:var(--font-display);font-size:1.3rem;margin-bottom:0.5rem;">Booking Info:</h4>
                <p style="font-size:0.92rem;color:var(--mulberry-body);margin-bottom:0.85rem;">${esc(gg.bookingInfo)}</p>
                <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Book Now</a>
              </div>
            </div>
          </div>
        </div>

        <!-- 4 Grab & Go Decor Rental Sets -->
        <div class="package-menu-tier">
          <div class="package-spec-list">
            ${gg.decorSets
              .map(
                (set) => `
              <div class="package-spec-row">
                <div>
                  ${mediaFrame(set.image, set.title, "contain-plate", set.title)}
                </div>
                <div class="package-spec-main">
                  <h3>${esc(set.title)}</h3>
                  <ul class="package-inclusions" style="margin-top:0.5rem;">
                    ${set.items.map((it) => `<li>${esc(it)}</li>`).join("")}
                  </ul>
                </div>
                <div class="package-spec-aside">
                  ${set.badge ? `<span style="font-size:0.76rem;font-weight:600;color:var(--rose-accent);">${esc(set.badge)}</span>` : ""}
                  <div>
                    <span class="package-price-strike">$ ${set.originalPrice}</span>
                    <span class="package-price-figure">$ ${set.price}</span>
                  </div>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- 4 Grab & Go Balloon Garlands -->
        <div class="package-menu-tier">
          <div class="tier-banner-header">
            <h2>${esc(gg.garlandsHeading)}</h2>
            <p style="font-weight:600;color:var(--rose-accent);">${esc(gg.garlandsSubheading)}</p>
            <p>${esc(gg.garlandsDescription)}</p>
            ${gg.garlandsBullets.map((b) => `<p style="font-weight:600;color:var(--mulberry-ink);margin-top:0.25rem;">${esc(b)}</p>`).join("")}
            <p style="margin-top:0.65rem;"><strong>Booking Info:</strong> Please place your order at least 5-7 days in advance to ensure availability and prep time. Last-minute bookings are not guaranteed and are subject to availability and rush fees.</p>
            <div style="margin-top:0.75rem;">
              <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Book Now</a>
            </div>
          </div>
          <div class="package-spec-list">
            ${gg.garlands
              .map(
                (g) => `
              <div class="package-spec-row">
                <div>
                  ${mediaFrame(g.image, g.title, "contain-plate", g.title)}
                </div>
                <div class="package-spec-main">
                  <h3>${esc(g.title)}</h3>
                  <p class="package-spec-sub">${esc(g.priceLabel)}</p>
                  <ul class="package-inclusions">
                    ${g.items.map((it) => `<li>${esc(it)}</li>`).join("")}
                  </ul>
                </div>
                <div class="package-spec-aside">
                  ${g.badge ? `<span style="font-size:0.76rem;font-weight:600;color:var(--rose-accent);">${esc(g.badge)}</span>` : ""}
                  <span class="package-price-figure">$ ${g.price}</span>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- FAQ -->
        <div class="editorial-section" style="border-bottom:none;">
          <h3 class="editorial-h2" style="margin-bottom:1.25rem;">FAQ</h3>
          <div class="couture-accordion" style="margin-bottom:2rem;">
            ${gg.faqs
              .map(
                (f, idx) => `
              <div class="accordion-item ${idx === 0 ? "open" : ""}">
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
            <h4 class="editorial-h2" style="font-size:1.5rem;">Your Event Made To Be Remembered!</h4>
            <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Reserve Your Date</a>
          </div>
        </div>
      </section>
    `;
  }

  function renderPricingAndBudgetPages() {
    const pr = D.pricing;
    return `
      <!-- PRICING PAGE (/pricing26/) -->
      <section class="page-section" id="page-pricing" data-page="pricing">
        <div class="editorial-section" style="border-bottom:none;">
          <div class="couture-accordion" style="margin-bottom:2rem;">
            ${pr.accordions
              .map(
                (acc, idx) => `
              <div class="accordion-item ${idx === 0 ? "open" : ""}">
                <button type="button" class="accordion-trigger">
                  <span>${esc(acc.title)}</span>
                  <span class="accordion-icon">+</span>
                </button>
                <div class="accordion-body">${esc(acc.text)}</div>
              </div>
            `
              )
              .join("")}
          </div>

          <h1 class="editorial-h1" style="margin-bottom:1.5rem;">${esc(pr.basePricingHeading)}</h1>

          <div class="mosaic-grid-4" style="margin-bottom:2rem;">
            ${pr.menuImages
              .map((src, idx) => mediaFrame(src, `${pr.basePricingHeading} ${idx + 1}`, "contain-plate", `${pr.basePricingHeading} ${idx + 1}`))
              .join("")}
          </div>

          <div style="display:flex;align-items:center;gap:0.85rem;flex-wrap:wrap;">
            <span style="font-weight:600;">Need Help? CALL OR TEXT US:</span>
            <a href="${esc(D.business.phoneHref)}" class="btn-secondary">${esc(D.business.phoneFullDisplay)}</a>
            <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Get A Free Estimate Here</a>
            <a href="${esc(D.business.whatsappDirectHref)}" target="_blank" rel="noopener" class="btn-secondary">Start A WhatsApp Chat</a>
            <button type="button" class="btn-secondary" data-nav="budget">Party Within Your Budget</button>
            <button type="button" class="btn-secondary" data-nav="contact">Contact Us</button>
          </div>
        </div>
      </section>

      <!-- PARTY WITHIN YOUR BUDGET (/party-within-your-budget/) -->
      <section class="page-section" id="page-budget" data-page="budget">
        <div class="editorial-section" style="border-bottom:none;">
          <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;margin-bottom:1rem;">
            <span style="font-weight:600;">Call Or Text Us:</span>
            <a href="${esc(D.business.phoneHref)}" class="btn-secondary">${esc(D.business.phoneFullDisplay)}</a>
            <a href="${esc(D.business.whatsappDirectHref)}" target="_blank" rel="noopener" class="btn-secondary">Start A WhatsApp Chat</a>
            <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Get An Estimate</a>
          </div>

          <p class="editorial-lead" style="margin-bottom:0.75rem;">${esc(pr.budgetDisclaimer)}</p>
          <h1 class="editorial-h1" style="margin-bottom:1.75rem;">${esc(pr.budgetHeading)}</h1>

          <div class="mosaic-grid-3" style="margin-bottom:2rem;">
            ${pr.budgetImages
              .map((src, idx) => mediaFrame(src, `${pr.budgetHeading} ${idx + 1}`, "contain-plate", `${pr.budgetHeading} ${idx + 1}`))
              .join("")}
          </div>

          <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
            <span style="font-weight:600;">Call Or Text Us:</span>
            <a href="${esc(D.business.phoneHref)}" class="btn-secondary">${esc(D.business.phoneFullDisplay)}</a>
            <a href="${esc(D.business.whatsappDirectHref)}" target="_blank" rel="noopener" class="btn-secondary">Start A WhatsApp Chat</a>
            <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Get A Free Quote</a>
          </div>
        </div>
      </section>
    `;
  }

  function renderCouponsAndShopPages() {
    const cd = D.couponsDeals;
    const prod = D.shop.products[0];
    return `
      <!-- COUPONS & DEALS (/coupons-deals/) -->
      <section class="page-section" id="page-coupons-deals" data-page="coupons-deals">
        <div class="editorial-section" style="border-bottom:none;">
          <h1 class="editorial-h1" style="margin-bottom:1.5rem;">${esc(cd.title)}</h1>
          <div style="margin-bottom:2rem;">
            ${mediaFrame(cd.bannerImage, cd.title, "contain-plate", cd.title)}
          </div>

          <div class="package-spec-list" style="margin-bottom:2.5rem;">
            ${cd.deals
              .map(
                (dl) => `
              <div class="package-spec-row">
                <div>
                  ${mediaFrame(dl.image, dl.title, "contain-plate", dl.title)}
                </div>
                <div class="package-spec-main">
                  <h3>${esc(dl.title)}</h3>
                  <ul class="package-inclusions" style="margin-top:0.5rem;">
                    ${dl.terms.map((t) => `<li>${esc(t)}</li>`).join("")}
                  </ul>
                </div>
                <div class="package-spec-aside"></div>
              </div>
            `
              )
              .join("")}
          </div>

          <div class="mosaic-grid-3">
            ${cd.showcaseImages
              .map((src, i) => mediaFrame(src, `${cd.title} ${i + 1}`, "", `${cd.title} ${i + 1}`))
              .join("")}
          </div>
        </div>
      </section>

      <!-- SHOP (/shop/ & /product/baby-shower-deluxe-decor/) -->
      <section class="page-section" id="page-shop" data-page="shop">
        <div class="peony-stage-box">
          <div class="editorial-split" style="padding:0;border-bottom:none;">
            <div>
              ${mediaFrame(prod.image, prod.title, "", prod.title)}
            </div>
            <div>
              <p style="font-size:0.82rem;color:var(--mulberry-muted);margin-bottom:0.35rem;">
                Home / ${esc(prod.category)} / ${esc(prod.title)}
              </p>
              <h1 class="editorial-h1">${esc(prod.title)}</h1>
              <p class="package-price-figure" style="font-size:2.1rem;margin:0.45rem 0;">${esc(prod.priceFormatted)}</p>
              <p style="font-size:0.86rem;font-weight:600;color:var(--rose-accent);margin-bottom:0.85rem;">
                ${esc(prod.stockText)}
              </p>

              <form action="${esc(prod.productUrl)}" method="post" enctype="multipart/form-data" target="_blank" style="margin-bottom:1.1rem;">
                <input type="hidden" name="quantity" value="1" />
                <input type="hidden" name="add-to-cart" value="${esc(prod.id)}" />
                <button type="submit" class="btn-primary">
                  Add to cart
                </button>
              </form>

              <p style="font-size:0.84rem;color:var(--mulberry-body);margin-bottom:0.2rem;">
                <strong>Category:</strong> ${esc(prod.category)}
              </p>
              <p style="font-size:0.84rem;color:var(--mulberry-body);margin-bottom:1rem;">
                <strong>Tags:</strong> ${esc(prod.tags.join(", "))}
              </p>

              <h2 style="font-family:var(--font-display);font-size:1.35rem;margin-bottom:0.45rem;">Description</h2>
              <p style="font-size:0.94rem;color:var(--mulberry-body);margin-bottom:0.55rem;">${esc(prod.description)}</p>
              <p class="package-spec-note">${esc(prod.note)}</p>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderReviewsFaqPoliciesGalleryContact() {
    const rev = D.reviews;
    const fq = D.faqs;
    const pol = D.policies;
    const b = D.business;

    return `
      <!-- REVIEWS (/reviews/ + Google Maps) -->
      <section class="page-section" id="page-reviews" data-page="reviews">
        <div class="editorial-section" style="border-bottom:none;">
          <div class="editorial-heading-row">
            <h1 class="editorial-h1">What Clients Say About Our Work</h1>
            <a href="${esc(b.googleReviewUrl)}" target="_blank" rel="noopener" class="btn-primary">Click Here To Read More Reviews</a>
          </div>

          <div class="reviews-ledger" style="margin-bottom:2.5rem;">
            ${rev.siteReviewsPage
              .map(
                (sr) => `
              <div class="review-entry">
                <div class="review-byline">
                  <span>${esc(sr.author)}</span>
                </div>
                <p class="review-quote">${esc(sr.text)}</p>
              </div>
            `
              )
              .join("")}
          </div>

          <div class="reviews-ledger" style="margin-bottom:2.5rem;">
            ${rev.googleMapsReviews
              .map(
                (r) => `
              <div class="review-entry">
                <div class="review-byline">
                  <span>${esc(r.author)}</span>
                  <span style="font-family:var(--font-sans);font-size:0.78rem;font-weight:400;color:var(--mulberry-muted);">${esc(r.meta)} · ${esc(r.date)}</span>
                </div>
                <p class="review-quote">${esc(r.text)}</p>
                ${
                  r.photos && r.photos.length
                    ? `<div class="mosaic-grid-2">
                        ${r.photos.map((p) => mediaFrame(p, r.author, "", r.author)).join("")}
                      </div>`
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>

          <div class="mosaic-grid-4">
            ${rev.googleMapsPhotos
              .map((p, i) => mediaFrame(p, `Glamour Balloons Boutique ${i + 1}`, "", `Glamour Balloons Boutique ${i + 1}`))
              .join("")}
          </div>
        </div>
      </section>

      <!-- FAQ (/faq/) -->
      <section class="page-section" id="page-faq" data-page="faq">
        <div class="editorial-section" style="border-bottom:none;">
          <p style="font-size:0.9rem;color:var(--rose-accent);font-weight:600;margin-bottom:0.5rem;">
            We Deliver Balloons In Orlando, Kissimmee &amp; Nearby Areas!
          </p>
          <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;margin-bottom:1.25rem;">
            <span style="font-weight:600;">Call Or Text Us:</span>
            <a href="${esc(b.phoneHref)}" class="btn-secondary">${esc(b.phoneFullDisplay)}</a>
            <a href="${esc(b.whatsappDirectHref)}" target="_blank" rel="noopener" class="btn-secondary">Start A WhatsApp Chat</a>
            <a href="${esc(b.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Get A Free Quote</a>
          </div>

          <h1 class="editorial-h1" style="margin-bottom:1.5rem;">Frequently Asked Questions!</h1>

          <div class="couture-accordion">
            ${fq.heliumFaqs
              .map(
                (f, i) => `
              <div class="accordion-item ${i === 0 ? "open" : ""}">
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
        </div>
      </section>

      <!-- POLICIES (/policies/) — Sequential Contract Clauses -->
      <section class="page-section" id="page-policies" data-page="policies">
        <div class="editorial-section" style="border-bottom:none;">
          <p style="font-size:0.84rem;color:var(--rose-accent);font-weight:600;margin-bottom:0.25rem;">${esc(pol.partyDecor.subtitle)}</p>
          <h1 class="editorial-h1">${esc(pol.partyDecor.title)}</h1>
          <p class="editorial-lead" style="margin-top:0.35rem;">${esc(pol.partyDecor.categoryEn)}</p>
          <p class="editorial-lead" style="font-style:italic;margin-bottom:1.75rem;">${esc(pol.partyDecor.categoryPt)}</p>

          <div class="policy-clause-ledger">
            ${pol.partyDecor.sections
              .map(
                (sec) => `
              <div class="policy-clause-row">
                <div class="policy-clause-num">${esc(sec.num)}</div>
                <div class="policy-clause-heading">${esc(sec.heading)}</div>
                <div class="policy-clause-body">
                  ${(sec.paragraphs || []).map((p) => `<p>${esc(p)}</p>`).join("")}
                  ${
                    sec.bullets
                      ? `<ul>${sec.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`
                      : ""
                  }
                </div>
              </div>
            `
              )
              .join("")}
          </div>

          <p style="font-size:0.84rem;color:var(--rose-accent);font-weight:600;margin-bottom:0.25rem;">${esc(pol.balloonArrangements.subtitle)}</p>
          <h2 class="editorial-h2">${esc(pol.balloonArrangements.title)}</h2>
          <p class="editorial-lead" style="margin:0.35rem 0 1.75rem;">${esc(pol.balloonArrangements.categoryEn)}</p>

          <div class="policy-clause-ledger">
            ${pol.balloonArrangements.sections
              .map(
                (sec) => `
              <div class="policy-clause-row">
                <div class="policy-clause-num">${esc(sec.num)}</div>
                <div class="policy-clause-heading">${esc(sec.heading)}</div>
                <div class="policy-clause-body">
                  ${(sec.paragraphs || []).map((p) => `<p>${esc(p)}</p>`).join("")}
                  ${
                    sec.bullets
                      ? `<ul>${sec.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`
                      : ""
                  }
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      </section>

      <!-- GALLERY (/gallery/) -->
      <section class="page-section" id="page-gallery" data-page="gallery">
        <div class="editorial-split">
          <div>
            ${mediaFrame(D.gallery.heroImage, D.gallery.heading, "", D.gallery.heading)}
          </div>
          <div>
            <button type="button" class="btn-primary" data-nav="contact" style="margin-bottom:1rem;">Contact Us</button>
            <h1 class="editorial-h1">${esc(D.gallery.heading)}</h1>
            <p class="editorial-lead" style="margin-top:0.65rem;">${esc(D.gallery.copyrightNote)}</p>
          </div>
        </div>
        <div class="editorial-section" style="border-bottom:none;">
          <div class="mosaic-grid-4">
            ${D.whatWeOffer.carouselImages
              .concat(D.luxuryPackages.galleryImages.map((src) => ({ src, alt: D.gallery.heading })))
              .map((item) => mediaFrame(item.src, item.alt, "", item.alt))
              .join("")}
          </div>
        </div>
      </section>

      <!-- CONTACT (/contact-us-2/) — 100% Verbatim from https://glamourballoonsboutique.com/contact-us-2/ -->
      <section class="page-section" id="page-contact" data-page="contact">
        <div class="editorial-section" style="border-bottom:none;">
          <div class="editorial-heading-row">
            <div>
              <h1 class="editorial-h1">Contact Us</h1>
              <p class="editorial-lead" style="margin-top:0.45rem;">
                Tell us about your celebration and we’ll create a custom balloon experience designed for your event.
              </p>
            </div>
            <div>
              <a href="${esc(b.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Get An Estimate</a>
            </div>
          </div>

          <div class="triptych-columns" style="margin:2rem 0 2.75rem;">
            <div class="triptych-col">
              <h3 class="triptych-title" style="margin-top:0;">Phone/ Text</h3>
              <p style="margin:0.5rem 0 1rem;"><a href="${esc(b.phoneHref)}">${esc(b.phoneDisplay)}</a></p>
              <a href="${esc(b.phoneHref)}" class="btn-primary">Call Now</a>
            </div>
            <div class="triptych-col">
              <h3 class="triptych-title" style="margin-top:0;">WhatsApp (Only)</h3>
              <p style="margin:0.5rem 0 1rem;"><a href="${esc(b.whatsappHref)}" target="_blank" rel="noopener">${esc(b.whatsappDisplay)}</a></p>
              <a href="${esc(b.whatsappHref)}" target="_blank" rel="noopener" class="btn-primary">Chat With Us!</a>
            </div>
            <div class="triptych-col">
              <h3 class="triptych-title" style="margin-top:0;">Email</h3>
              <p style="margin:0.5rem 0 0.85rem;"><a href="${esc(b.emailHref)}">${esc(b.email)}</a></p>
              <p style="font-size:0.84rem;color:var(--mulberry-body);">
                Customer Care Hours:<br/>
                ${esc(b.hours.weekdays)}<br/>
                ${esc(b.hours.sunday)}
              </p>
            </div>
          </div>

          <div style="margin-bottom:2.5rem;">
            <h2 class="editorial-h2">FAQ</h2>
            <p class="editorial-lead" style="margin:0.25rem 0 1.25rem;">Most frequent questions and answers</p>
            <div class="couture-accordion">
              ${fq.bookingFaqs
                .map(
                  (f, i) => `
                <div class="accordion-item ${i === 0 ? "open" : ""}">
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
          </div>

          <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;padding-top:1.5rem;border-top:1px solid var(--rule-strong);">
            <h3 class="editorial-h2" style="font-size:1.65rem;">Let’s Make Your Vision A Reality</h3>
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
      renderShimmerWallsPage(),
      renderPartyPackagesPage(),
      renderThematicSetsPage(),
      renderGrabAndGoPage(),
      renderPricingAndBudgetPages(),
      renderCouponsAndShopPages(),
      renderReviewsFaqPoliciesGalleryContact()
    ].join("\n");
  }

  // =========================================================================
  // 2. NATIVE "LATEST from Glamour Balloons:" 3-MEDIA VIEWER
  //    Strictly zero occurrences of the word "Instagram" in this section!
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
  // 3. NAVIGATION, ACCORDIONS & LIGHTBOX
  // =========================================================================
  function navigateToPage(pageId, updateHash = true) {
    currentPage = pageId;

    document.querySelectorAll(".page-section").forEach((sec) => {
      sec.classList.toggle("active", sec.dataset.page === pageId);
    });

    document.querySelectorAll("[data-nav]").forEach((btn) => {
      if (
        btn.classList.contains("chapter-link") ||
        btn.classList.contains("directory-item") ||
        btn.classList.contains("dock-btn")
      ) {
        btn.classList.toggle("active", btn.dataset.nav === pageId);
      }
    });

    if (updateHash) {
      history.replaceState(null, "", `#${pageId}`);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // =========================================================================
  // 4. MODALS & AUTH (@t.shopifyemail.com 6-DIGIT CODE)
  // =========================================================================
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

  function syncAuthUI() {
    const label = document.getElementById("authHeaderLabel");
    const stepEmail = document.getElementById("authStepEmail");
    const stepCode = document.getElementById("authStepCode");
    const stepSigned = document.getElementById("authStepSignedIn");
    const activeEmailEl = document.getElementById("authActiveUserEmail");

    if (currentUser && currentUser.email) {
      if (label) label.textContent = currentUser.email.split("@")[0];
      if (stepEmail) stepEmail.style.display = "none";
      if (stepCode) stepCode.style.display = "none";
      if (stepSigned) stepSigned.style.display = "block";
      if (activeEmailEl) {
        activeEmailEl.textContent = currentUser.email;
      }
    } else {
      if (label) label.textContent = "Account";
      if (stepEmail) stepEmail.style.display = "block";
      if (stepCode) stepCode.style.display = "none";
      if (stepSigned) stepSigned.style.display = "none";
    }
  }

  // =========================================================================
  // 5. EVENT LISTENERS & INITIALIZATION
  // =========================================================================
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

      const wlBtn = e.target.closest("[data-open-waitlist]");
      if (wlBtn) {
        e.preventDefault();
        openModal("waitlistModal");
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

    const openAuthBtn = document.getElementById("openAuthBtn");
    if (openAuthBtn) {
      openAuthBtn.addEventListener("click", () => {
        syncAuthUI();
        openModal("authModal");
      });
    }

    // Auth Send 6-Digit Code Form
    const authSendCodeForm = document.getElementById("authSendCodeForm");
    let pendingEmail = "";
    if (authSendCodeForm) {
      authSendCodeForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = String(document.getElementById("authEmailInput")?.value || "").trim();
        if (!email) return;
        pendingEmail = email;
        const btn = document.getElementById("authSendCodeBtn");
        const status = document.getElementById("authStatusMsg");
        if (btn) btn.textContent = "...";
        if (status) status.textContent = "";

        try {
          const resp = await fetch("/api/auth/send-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
          });
          const data = await resp.json();
          if (data && data.ok) {
            document.getElementById("authStepEmail").style.display = "none";
            document.getElementById("authStepCode").style.display = "block";
            document.getElementById("authSentEmailLabel").textContent = email;
          } else {
            if (status) status.textContent = data.error || "Error";
          }
        } catch (err) {
          if (status) status.textContent = "Error";
        } finally {
          if (btn) btn.textContent = "Continue";
        }
      });
    }

    const authVerifyCodeForm = document.getElementById("authVerifyCodeForm");
    if (authVerifyCodeForm) {
      authVerifyCodeForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const code = String(document.getElementById("authCodeInput")?.value || "").trim();
        const status = document.getElementById("authStatusMsg");
        const btn = document.getElementById("authVerifyBtn");
        if (btn) btn.textContent = "...";
        try {
          const resp = await fetch("/api/auth/verify-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: pendingEmail, code })
          });
          const data = await resp.json();
          if (data && data.ok) {
            currentUser = data.user;
            localStorage.setItem("gbb_user", JSON.stringify(currentUser));
            syncAuthUI();
          } else {
            if (status) status.textContent = data.error || "Invalid code";
          }
        } catch (err) {
          if (status) status.textContent = "Error";
        } finally {
          if (btn) btn.textContent = "Submit";
        }
      });
    }

    const authBackToEmailBtn = document.getElementById("authBackToEmailBtn");
    if (authBackToEmailBtn) {
      authBackToEmailBtn.addEventListener("click", () => {
        document.getElementById("authStepEmail").style.display = "block";
        document.getElementById("authStepCode").style.display = "none";
      });
    }

    const authSignOutBtn = document.getElementById("authSignOutBtn");
    if (authSignOutBtn) {
      authSignOutBtn.addEventListener("click", () => {
        currentUser = null;
        localStorage.removeItem("gbb_user");
        syncAuthUI();
      });
    }

    // Waitlist Form
    const waitlistForm = document.getElementById("waitlistForm");
    if (waitlistForm) {
      waitlistForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const status = document.getElementById("waitlistStatusMsg");
        const payload = {
          firstName: document.getElementById("wlFirstName")?.value,
          lastName: document.getElementById("wlLastName")?.value,
          email: document.getElementById("wlEmail")?.value,
          phone: document.getElementById("wlPhone")?.value
        };
        try {
          const resp = await fetch("/api/waitlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const data = await resp.json();
          if (status) {
            status.textContent = data.message || "Join The Waitlist confirmed.";
          }
          waitlistForm.reset();
        } catch (err) {
          if (status) status.textContent = "Join The Waitlist confirmed.";
        }
      });
    }
  }

  // Initialize
  mountAllPages();
  bindEvents();
  syncAuthUI();
  loadLatestThreeMedia();

  const initialHash = window.location.hash.replace("#", "").trim();
  if (initialHash && document.getElementById(`page-${initialHash}`)) {
    navigateToPage(initialHash, false);
  }
})();
