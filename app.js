/**
 * Glamour Balloons Boutique LLC — Bespoke Editorial Lookbook & Atelier Application
 * ================================================================================
 * Renders all verbatim pages, collections, packages, FAQs, policies,
 * Google Maps reviews, native "LATEST from Glamour Balloons:" 3-media
 * viewer, @t.shopifyemail.com 6-digit verification login, VIP waitlist,
 * JotForm integration, and WooCommerce cart checkout.
 */

(function () {
  const D = window.GLAMOUR_DATA;
  if (!D) return;

  // State
  let currentPage = "home";
  let showAllPages = false;
  let bag = JSON.parse(localStorage.getItem("gbb_bag") || "[]");
  let activeCoupon = null;
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
  // 1. RENDER ALL PAGES INTO #atelierStage
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
              <button type="button" class="btn-secondary" data-nav="contact" style="padding:0.4rem 0.95rem;font-size:0.78rem;">
                ${esc(h.topCtaButton)}
              </button>
            </div>

            <span class="hero-availability-note">${esc(h.heroBadge)}</span>
            <h1 class="hero-display-title">${esc(h.heroTitle)}</h1>
            <div class="hero-story">
              ${h.heroParagraphs.map((p) => `<p>${esc(p)}</p>`).join("")}
            </div>
            <div class="hero-actions">
              <button type="button" class="btn-primary" data-nav="contact">${esc(h.topCtaButton)}</button>
              <button type="button" class="btn-secondary" data-nav="party-packages">Explore Party Packages</button>
              <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-secondary">Get An Estimate</a>
            </div>
            <div class="hero-attributes">
              ${D.business.aboutAttributes.map((attr) => `<span>${esc(attr)}</span>`).join(" · ")}
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
                  <div class="plinth-caption">
                    <span>${esc(c.title)}</span>
                    <span>→</span>
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
            <div class="latest-filmstrip" id="latestMediaGrid">
              <!-- Populated dynamically by loadLatestThreeMedia() -->
            </div>
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
                <p style="font-size:0.84rem;color:var(--rose-accent);margin-top:0.35rem;font-weight:500;">Explore Collection →</p>
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
                  <div style="margin-top:0.75rem;display:flex;gap:0.75rem;flex-wrap:wrap;">
                    <button type="button" class="btn-secondary" data-nav="${esc(srv.targetPage)}" style="padding:0.45rem 1rem;font-size:0.8rem;">View Details</button>
                    <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary" style="padding:0.45rem 1rem;font-size:0.8rem;">Request A Quote</a>
                  </div>
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
                ${esc(exp.badge)} · ${esc(exp.vipSectionTitle)} (${esc(exp.vipSectionSubtitle)})
              </p>
              <h2 class="editorial-h2" style="margin-bottom:0.75rem;">${esc(exp.title)}</h2>
              <div style="display:flex;flex-direction:column;gap:0.55rem;font-size:0.94rem;color:var(--mulberry-body);margin-bottom:1rem;">
                ${exp.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}
              </div>
              <p style="font-size:0.86rem;font-weight:600;color:var(--mulberry-ink);margin-bottom:0.9rem;">
                ${esc(exp.subText)}
              </p>
              <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
                <button type="button" class="btn-primary" data-open-waitlist="1">${esc(exp.buttonText)}</button>
                <button type="button" class="btn-secondary" data-nav="contact">Start Your Booking</button>
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
              <button type="button" class="btn-primary" data-nav="reviews">See All Client Reviews &amp; Photos</button>
            </div>
          </div>
          <div class="reviews-ledger">
            ${D.reviews.homeReviews
              .map(
                (r) => `
              <div class="review-entry">
                <div class="review-byline">
                  <span>${esc(r.author)}</span>
                  <span style="font-size:0.82rem;color:var(--rose-accent);">5.0 / 5.0</span>
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
              <p style="font-family:var(--font-display);font-size:1.25rem;font-style:italic;color:var(--rose-accent);margin-top:0.25rem;">
                ${esc(w.subheading)}
              </p>
            </div>
            <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
              <button type="button" class="btn-primary" data-nav="contact">Start Your Booking</button>
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
                  <div style="margin-top:0.75rem;">
                    ${
                      s.targetPage
                        ? `<button type="button" class="btn-primary" data-nav="${esc(s.targetPage)}" style="padding:0.45rem 1rem;font-size:0.8rem;">${esc(s.actionText)}</button>`
                        : s.externalUrl
                        ? `<a href="${esc(s.externalUrl)}" target="_blank" rel="noopener" class="btn-primary" style="padding:0.45rem 1rem;font-size:0.8rem;">${esc(s.actionText)}</a>`
                        : `<span class="btn-secondary" style="padding:0.45rem 1rem;font-size:0.8rem;">${esc(s.actionText)}</span>`
                    }
                  </div>
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
              <h3 class="editorial-h2" style="margin-bottom:0.75rem;">${esc(w.celebrateWithStyle.title)}</h3>
              <div style="display:flex;flex-direction:column;gap:0.55rem;font-size:0.94rem;color:var(--mulberry-body);margin-bottom:1.1rem;">
                ${w.celebrateWithStyle.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}
              </div>
              <h4 style="font-family:var(--font-display);font-size:1.35rem;margin-bottom:0.65rem;">Book Your Balloon Decorations Today!</h4>
              <div style="display:flex;gap:0.65rem;flex-wrap:wrap;">
                <a href="${esc(D.business.phoneHref)}" class="btn-secondary">${esc(D.business.phoneFullDisplay)}</a>
                <a href="${esc(D.business.whatsappDirectHref)}" target="_blank" rel="noopener" class="btn-secondary">Start A WhatsApp Chat</a>
                <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Get An Estimate</a>
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
              <p style="font-size:0.84rem;color:var(--rose-accent);font-weight:600;margin-bottom:0.25rem;">${esc(lp.inspirationTag)}</p>
              <h1 class="editorial-h1">${esc(lp.title)}</h1>
            </div>
            <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
              <button type="button" class="btn-primary" data-nav="contact">Start Your Booking</button>
              <button type="button" class="btn-secondary" data-nav="wedding-experience">Wedding Decor</button>
            </div>
          </div>
          <p class="editorial-lead" style="margin-bottom:0.5rem;">${esc(lp.subtitle)}</p>
          <p class="editorial-lead" style="font-weight:600;margin-bottom:0.35rem;">${esc(lp.inspirationHeading)}</p>
          <p class="editorial-lead" style="margin-bottom:2rem;">${esc(lp.inspirationText)}</p>

          <div class="mosaic-grid-4">
            ${lp.galleryImages
              .map((src, i) => mediaFrame(src, `${lp.title} Lookbook ${i + 1}`, "", lp.milestoneText))
              .join("")}
          </div>
        </div>

        <div class="editorial-section">
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
              <ul class="package-inclusions" style="margin-bottom:1.1rem;">
                ${lp.shimmerSection.sizes.map((s) => `<li>${esc(s)}</li>`).join("")}
              </ul>
              <button type="button" class="btn-primary" data-nav="shimmer-walls">Explore Shimmer Walls</button>
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
              <button type="button" class="btn-primary" data-nav="wedding-experience">Visit Our Wedding Experience Page</button>
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
            <p style="font-size:0.84rem;color:var(--rose-accent);font-weight:600;margin-bottom:0.25rem;">The Wedding Experience</p>
            <h1 class="editorial-h1">${esc(w.title)}</h1>
            <p class="editorial-lead" style="margin:0.85rem 0 1.25rem;">${esc(w.intro)}</p>
            <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
              <button type="button" class="btn-primary" data-nav="contact">${esc(w.ctaButton)}</button>
              <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-secondary">Reserve Your Luxury Look</a>
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
              ${mediaFrame(w.welcomeSigns.image, "Customized Wedding Welcome Signs", "contain-plate", "Customized Wedding Welcome Signs")}
            </div>
            <div>
              <h3 class="editorial-h2" style="margin-bottom:0.65rem;">Customized Wedding Welcome Signs</h3>
              <p style="font-size:0.94rem;color:var(--mulberry-body);margin-bottom:0.75rem;">${esc(w.welcomeSigns.description)}</p>
              <p style="font-weight:600;color:var(--rose-accent);margin-bottom:0.35rem;">${esc(w.welcomeSigns.optionsTitle)}</p>
              <ul class="package-inclusions" style="margin-bottom:0.75rem;">
                ${w.welcomeSigns.options.map((o) => `<li>${esc(o)}</li>`).join("")}
              </ul>
              ${w.welcomeSigns.notes.map((n) => `<p style="font-size:0.8rem;color:var(--mulberry-muted);">${esc(n)}</p>`).join("")}
              <div style="margin-top:0.75rem;display:flex;flex-direction:column;gap:0.25rem;font-size:0.84rem;font-weight:600;">
                ${w.welcomeSigns.highlights.map((hl) => `<span>${esc(hl)}</span>`).join("")}
              </div>
            </div>
          </div>
        </div>

        <!-- 5 Wedding Packages — Atelier Spec Ledger -->
        <div class="editorial-section" style="border-bottom:none;">
          <div class="editorial-heading-row">
            <div>
              <p style="font-size:0.84rem;color:var(--rose-accent);font-weight:600;">${esc(w.featuringHeading)}</p>
              <h2 class="editorial-h2">Signature Wedding Packages</h2>
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
                  <ul class="package-inclusions">
                    ${pkg.items.map((it) => `<li>${esc(it)}</li>`).join("")}
                  </ul>
                </div>
                <div class="package-spec-aside">
                  ${pkg.badge ? `<span style="font-size:0.78rem;font-weight:600;color:var(--rose-accent);">${esc(pkg.badge)}</span>` : ""}
                  <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Reserve Your Date</a>
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
            <h1 class="editorial-h1">${esc(sw.title)} — ${esc(sw.subtitle)}</h1>
            <h2 style="font-family:var(--font-display);font-size:1.5rem;color:var(--rose-accent);margin:0.45rem 0;">
              ${esc(sw.startingHeading)}
            </h2>
            ${sw.paragraphs.map((p) => `<p style="font-size:0.94rem;color:var(--mulberry-body);margin-bottom:0.55rem;">${esc(p)}</p>`).join("")}
            <div style="margin-top:0.9rem;display:flex;gap:0.75rem;flex-wrap:wrap;">
              <button type="button" class="btn-primary" data-nav="contact">Book Now</button>
              <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-secondary">Get An Estimate</a>
            </div>
          </div>
        </div>

        <div class="editorial-split">
          <div>
            <h2 class="editorial-h2">${esc(sw.colorsHeading)}</h2>
            <p style="font-size:0.94rem;color:var(--mulberry-body);margin-top:0.5rem;">
              Available in gold, silver, rose gold, red, black, blue, white and more. Select the color chart to inspect full details.
            </p>
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
                  ${mediaFrame(sz.image, `Shimmer Wall ${sz.size}`, "", `Shimmer Wall ${sz.size}`)}
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
                  <button type="button" class="btn-primary" data-add-bag="${esc(sz.id)}" data-title="Shimmer Wall ${esc(sz.size)}" data-price="${sz.price}">
                    Add to Bag
                  </button>
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
            <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
              <button type="button" class="btn-primary" data-nav="contact">Customize Your Package</button>
              <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-secondary">Get An Estimate</a>
            </div>
          </div>
          <p class="editorial-lead" style="margin-bottom:0.45rem;">${esc(pp.intro)}</p>
          <p class="editorial-lead" style="margin-bottom:1.75rem;">${esc(pp.customizableNote)}</p>

          <div class="mosaic-grid-2" style="margin-bottom:1.75rem;">
            ${pp.bannerImages.map((src, idx) => mediaFrame(src, `Party Decor Guide ${idx + 1}`, "contain-plate", `Party Decor Guide ${idx + 1}`)).join("")}
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
                    <button type="button" class="btn-primary" data-add-bag="${esc(pkg.id)}" data-title="${esc(pkg.title)}" data-price="${pkg.price}">
                      Add to Bag ($${pkg.price})
                    </button>
                    <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-secondary" style="font-size:0.78rem;padding:0.45rem 0.9rem;">
                      Book Date
                    </a>
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
            ${mediaFrame(ts.heroImage, "Birthday Decor Set", "", "Birthday Decor Set")}
          </div>
          <div>
            <p style="font-size:0.84rem;color:var(--rose-accent);font-weight:600;margin-bottom:0.25rem;">
              ${esc(ts.eyebrow)} · ${esc(ts.rentalHeading)}
            </p>
            <h1 class="editorial-h1">${esc(ts.grabGoTitle)} — ${esc(ts.startingAt)}</h1>
            <p style="font-size:0.94rem;color:var(--mulberry-body);margin:0.65rem 0;">${esc(ts.intro)}</p>
            <p style="font-size:0.9rem;color:var(--mulberry-body);margin-bottom:1rem;">${esc(ts.serviceAreaText)}</p>
            <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
              <button type="button" class="btn-primary" data-nav="grab-go">More Info &amp; Packages</button>
              <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-secondary">Get A Free Estimate Here</a>
            </div>
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
            <h3 class="editorial-h2" style="font-size:1.65rem;margin-bottom:0.65rem;">${esc(ts.howItWorksTitle)}</h3>
            <ol style="padding-left:1.2rem;display:flex;flex-direction:column;gap:0.55rem;font-size:0.92rem;color:var(--mulberry-body);margin-bottom:1.1rem;">
              ${ts.howItWorksSteps.map((s) => `<li>${esc(s)}</li>`).join("")}
            </ol>
            <a href="${esc(D.business.whatsappDirectHref)}" target="_blank" rel="noopener" class="btn-primary">Start A WhatsApp Chat</a>
          </div>
        </div>

        <div class="editorial-section" style="border-bottom:none;">
          <div class="editorial-heading-row">
            <h2 class="editorial-h2">${esc(ts.exclusiveTitle)}</h2>
            <p class="editorial-lead">${esc(ts.exclusiveDescription)}</p>
          </div>
          <div class="mosaic-grid-4">
            ${ts.gallery
              .map((src, idx) => mediaFrame(src, `Exclusive Thematic Set ${idx + 1}`, "contain-plate", `Exclusive Thematic Set ${idx + 1}`))
              .join("")}
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
              <p style="font-size:0.84rem;color:var(--rose-accent);font-weight:600;margin-bottom:0.25rem;">${esc(gg.setsSubheading)}</p>
              <h1 class="editorial-h1">${esc(gg.heroTitle)}</h1>
            </div>
            <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
              <button type="button" class="btn-primary" data-nav="contact">Book Now</button>
              <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-secondary">Reserve Your Date</a>
            </div>
          </div>
          <p class="editorial-lead" style="margin-bottom:0.45rem;">${esc(gg.heroSubtitle)}</p>
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
                <p style="font-size:0.92rem;color:var(--mulberry-body);">${esc(gg.bookingInfo)}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 4 Grab & Go Decor Rental Sets -->
        <div class="package-menu-tier">
          <div class="tier-banner-header">
            <h2>${esc(gg.setsHeading)}</h2>
          </div>
          <div class="package-spec-list">
            ${gg.decorSets
              .map(
                (set) => `
              <div class="package-spec-row">
                <div>
                  ${mediaFrame(set.image, set.title, "contain-plate", `Grab & Go ${set.title}`)}
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
                  <button type="button" class="btn-primary" data-add-bag="${esc(set.id)}" data-title="Grab & Go Set: ${esc(set.title)}" data-price="${set.price}">
                    Add to Bag ($${set.price})
                  </button>
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
            <h2>${esc(gg.garlandsHeading)} — ${esc(gg.garlandsSubheading)}</h2>
            <p>${esc(gg.garlandsDescription)}</p>
            ${gg.garlandsBullets.map((b) => `<p style="font-weight:600;color:var(--rose-accent);">${esc(b)}</p>`).join("")}
          </div>
          <div class="package-spec-list">
            ${gg.garlands
              .map(
                (g) => `
              <div class="package-spec-row">
                <div>
                  ${mediaFrame(g.image, g.title, "contain-plate", `${g.title} (${g.size})`)}
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
                  <span class="package-price-figure">$${g.price}</span>
                  <button type="button" class="btn-primary" data-add-bag="${esc(g.id)}" data-title="Grab & Go Garland: ${esc(g.title)}" data-price="${g.price}">
                    Add to Bag ($${g.price})
                  </button>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- Grab & Go FAQs -->
        <div class="editorial-section" style="border-bottom:none;">
          <h3 class="editorial-h2" style="margin-bottom:1.25rem;">Grab &amp; Go FAQ</h3>
          <div class="couture-accordion">
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
        </div>
      </section>
    `;
  }

  function renderPricingAndBudgetPages() {
    const pr = D.pricing;
    return `
      <!-- PRICING PAGE (/pricing26/) -->
      <section class="page-section" id="page-pricing" data-page="pricing">
        <div class="editorial-section">
          <h1 class="editorial-h1" style="margin-bottom:1.5rem;">${esc(pr.basePricingHeading)}</h1>
          <div class="couture-accordion" style="margin-bottom:2.5rem;">
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

          <div class="mosaic-grid-4">
            ${pr.menuImages
              .map((src, idx) => mediaFrame(src, `Base Pricing Menu Page ${idx + 1}`, "contain-plate", `Base Pricing Menu Page ${idx + 1}`))
              .join("")}
          </div>
        </div>
      </section>

      <!-- PARTY WITHIN YOUR BUDGET (/party-within-your-budget/) -->
      <section class="page-section" id="page-budget" data-page="budget">
        <div class="editorial-section" style="border-bottom:none;">
          <div class="editorial-heading-row">
            <div>
              <h1 class="editorial-h1">${esc(pr.budgetHeading)}</h1>
              <p class="editorial-lead" style="margin-top:0.5rem;">${esc(pr.budgetDisclaimer)}</p>
            </div>
            <div style="display:flex;gap:0.65rem;flex-wrap:wrap;">
              <a href="${esc(D.business.phoneHref)}" class="btn-secondary">${esc(D.business.phoneFullDisplay)}</a>
              <a href="${esc(D.business.whatsappDirectHref)}" target="_blank" rel="noopener" class="btn-secondary">Start A WhatsApp Chat</a>
              <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Get A Free Quote</a>
            </div>
          </div>

          <div class="mosaic-grid-3">
            ${pr.budgetImages
              .map((src, idx) => mediaFrame(src, `Budget Package Option ${idx + 1}`, "contain-plate", `Party Within Your Budget Option ${idx + 1}`))
              .join("")}
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
        <div class="editorial-section">
          <h1 class="editorial-h1" style="margin-bottom:1.5rem;">${esc(cd.title)}</h1>
          <div style="margin-bottom:2rem;">
            ${mediaFrame(cd.bannerImage, "Holiday Gift Coupon", "contain-plate", "Holiday Gift Coupon")}
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
                <div class="package-spec-aside">
                  <button type="button" class="btn-primary" data-apply-promo="${esc(dl.code)}">
                    Apply Promo (${esc(dl.code)})
                  </button>
                  <button type="button" class="btn-secondary" data-nav="contact">Start Your Booking</button>
                </div>
              </div>
            `
              )
              .join("")}
          </div>

          <div class="mosaic-grid-3">
            ${cd.showcaseImages
              .map((src, i) => mediaFrame(src, `Glamour Showcase ${i + 1}`, "", `Glamour Showcase ${i + 1}`))
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
              <p style="font-size:0.82rem;font-weight:600;color:var(--rose-accent);margin-bottom:0.25rem;">
                ${esc(prod.stockText)} · Category: ${esc(prod.category)}
              </p>
              <h1 class="editorial-h1">${esc(prod.title)}</h1>
              <p class="package-price-figure" style="font-size:2.1rem;margin:0.45rem 0;">${esc(prod.priceFormatted)}</p>
              <p style="font-size:0.94rem;color:var(--mulberry-body);margin-bottom:0.85rem;">${esc(prod.shortDescription)}</p>
              <p style="font-weight:600;color:var(--mulberry-ink);margin-bottom:0.35rem;">What’s included:</p>
              <ul class="package-inclusions" style="margin-bottom:0.75rem;">
                ${prod.included.map((item) => `<li>${esc(item)}</li>`).join("")}
              </ul>
              <p class="package-spec-note" style="margin-bottom:1.1rem;">
                <strong>Not included:</strong> ${esc(prod.notIncluded)}
              </p>
              <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
                <button type="button" class="btn-primary" data-add-bag="${esc(prod.id)}" data-title="${esc(prod.title)}" data-price="${prod.price}">
                  Add to Boutique Bag (${esc(prod.priceFormatted)})
                </button>
                <form action="${esc(prod.productUrl)}" method="post" enctype="multipart/form-data" target="_blank" style="display:inline-flex;">
                  <input type="hidden" name="quantity" value="1" />
                  <input type="hidden" name="add-to-cart" value="${esc(prod.id)}" />
                  <button type="submit" class="btn-secondary">
                    Direct WooCommerce Cart ↗
                  </button>
                </form>
              </div>
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
        <div class="editorial-section">
          <div class="editorial-heading-row">
            <div>
              <p style="font-size:0.84rem;color:var(--rose-accent);font-weight:600;margin-bottom:0.25rem;">4.9 on Google Maps · 222 Verified Reviews</p>
              <h1 class="editorial-h1">What Clients Say About Our Work</h1>
            </div>
            <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
              <a href="${esc(b.googleReviewUrl)}" target="_blank" rel="noopener" class="btn-primary">Write / Read Google Reviews ↗</a>
              <a href="${esc(b.googleMapsUrl)}" target="_blank" rel="noopener" class="btn-secondary">Open on Google Maps ↗</a>
            </div>
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
                        ${r.photos.map((p) => mediaFrame(p, `Customer Photo by ${r.author}`, "", `Review Photo by ${r.author}`)).join("")}
                      </div>`
                    : ""
                }
              </div>
            `
              )
              .join("")}
          </div>

          <h2 class="editorial-h2" style="margin-bottom:1.25rem;">Featured Testimonials from /reviews/</h2>
          <div class="reviews-ledger" style="margin-bottom:2.5rem;">
            ${rev.siteReviewsPage
              .map(
                (sr) => `
              <div class="review-entry">
                <div class="review-byline">
                  <span>${esc(sr.author)}</span>
                  <span style="font-size:0.8rem;color:var(--rose-accent);">Verified Client</span>
                </div>
                <p class="review-quote">${esc(sr.text)}</p>
              </div>
            `
              )
              .join("")}
          </div>

          <h2 class="editorial-h2" style="margin-bottom:1.25rem;">Google Maps Customer &amp; Venue Gallery</h2>
          <div class="mosaic-grid-4">
            ${rev.googleMapsPhotos
              .map((p, i) => mediaFrame(p, `Google Maps Photo ${i + 1}`, "", `Google Maps Customer Installation ${i + 1}`))
              .join("")}
          </div>
        </div>
      </section>

      <!-- FAQ (/faq/ + /contact-us-2/) -->
      <section class="page-section" id="page-faq" data-page="faq">
        <div class="editorial-section" style="border-bottom:none;">
          <p style="font-size:0.84rem;color:var(--rose-accent);font-weight:600;margin-bottom:0.25rem;">
            We Deliver Balloons In Orlando, Kissimmee &amp; Nearby Areas!
          </p>
          <h1 class="editorial-h1" style="margin-bottom:0.35rem;">Frequently Asked Questions!</h1>
          <p class="editorial-lead" style="margin-bottom:2rem;">Most frequent questions and answers</p>

          <div class="mosaic-grid-2">
            <div>
              <h3 style="font-family:var(--font-display);font-size:1.5rem;margin-bottom:0.85rem;">Booking, Setup &amp; Event FAQs</h3>
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

            <div>
              <h3 style="font-family:var(--font-display);font-size:1.5rem;margin-bottom:0.85rem;">Helium, Float Time &amp; Balloon Care FAQs</h3>
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
            <h1 class="editorial-h1">${esc(D.gallery.heading)}</h1>
            <p class="editorial-lead" style="margin:0.65rem 0 1.25rem;">${esc(D.gallery.copyrightNote)}</p>
            <button type="button" class="btn-primary" data-nav="contact">Contact Us</button>
          </div>
        </div>
        <div class="editorial-section" style="border-bottom:none;">
          <div class="mosaic-grid-4">
            ${D.whatWeOffer.carouselImages
              .concat(D.luxuryPackages.galleryImages.map((src) => ({ src, alt: "Luxury Portfolio" })))
              .map((item) => mediaFrame(item.src, item.alt, "", item.alt))
              .join("")}
          </div>
        </div>
      </section>

      <!-- CONTACT (/contact-us-2/ & /contact-us/) -->
      <section class="page-section" id="page-contact" data-page="contact">
        <div class="editorial-section">
          <p style="font-size:0.84rem;color:var(--rose-accent);font-weight:600;margin-bottom:0.25rem;">how can we help You?</p>
          <h1 class="editorial-h1">Contact Us</h1>
          <p class="editorial-lead" style="margin:0.45rem 0 2rem;">
            Tell us about your celebration and we’ll create a custom balloon experience designed for your event.
          </p>

          <div class="triptych-columns" style="margin-bottom:2.5rem;">
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
              <h3 class="triptych-title" style="margin-top:0;">Email &amp; Hours</h3>
              <p style="margin:0.5rem 0;"><a href="${esc(b.emailHref)}">${esc(b.email)}</a></p>
              <p style="font-size:0.82rem;color:var(--mulberry-muted);margin-bottom:1rem;">
                Customer Care Hours:<br/>
                ${esc(b.hours.weekdays)}<br/>
                ${esc(b.hours.sunday)}
              </p>
              <a href="${esc(b.jotformUrl)}" target="_blank" rel="noopener" class="btn-primary">Get An Estimate</a>
            </div>
          </div>

          <div class="editorial-split" style="align-items:start;border-bottom:none;">
            <div>
              <h2 class="editorial-h2" style="margin-bottom:0.5rem;">Let’s Make Your Vision A Reality</h2>
              <p style="font-size:0.92rem;color:var(--mulberry-body);margin-bottom:1.25rem;">
                Submit your celebration details below (synced with our official JotForm estimate system) or open the full interactive JotForm in a new tab.
              </p>
              <form id="contactEstimateForm">
                <div class="form-grid">
                  <div class="form-field">
                    <label for="cfFirst">First Name *</label>
                    <input type="text" id="cfFirst" required placeholder="First Name" />
                  </div>
                  <div class="form-field">
                    <label for="cfLast">Last Name *</label>
                    <input type="text" id="cfLast" required placeholder="Last Name" />
                  </div>
                </div>
                <div class="form-grid">
                  <div class="form-field">
                    <label for="cfEmail">Email *</label>
                    <input type="email" id="cfEmail" required placeholder="you@example.com" />
                  </div>
                  <div class="form-field">
                    <label for="cfPhone">Phone Number *</label>
                    <input type="tel" id="cfPhone" required placeholder="(407) 000-0000" />
                  </div>
                </div>
                <div class="form-grid">
                  <div class="form-field">
                    <label for="cfIntent">I want... *</label>
                    <select id="cfIntent">
                      <option value="To get a quote">To get a quote</option>
                      <option value="To book a service/package">To book a service/package</option>
                      <option value="More information">More information</option>
                    </select>
                  </div>
                  <div class="form-field">
                    <label for="cfOccasion">Event Occasion *</label>
                    <select id="cfOccasion">
                      <option value="Birthday Party">Birthday Party</option>
                      <option value="Baby Shower">Baby Shower</option>
                      <option value="Wedding / Engagement">Wedding / Engagement</option>
                      <option value="Bridal Shower / Bachelorette">Bridal Shower / Bachelorette</option>
                      <option value="Corporate Event">Corporate Event</option>
                      <option value="Gender Reveal">Gender Reveal</option>
                      <option value="Graduation">Graduation</option>
                      <option value="Grab & Go Rental">Grab &amp; Go Rental</option>
                    </select>
                  </div>
                </div>
                <div class="form-grid">
                  <div class="form-field">
                    <label for="cfService">Primary Service</label>
                    <select id="cfService">
                      <option value="Luxury Tailored Event Decor">Luxury Tailored Event Decor</option>
                      <option value="Organic Balloon Garland">Organic Balloon Garland</option>
                      <option value="Shimmer Wall">Shimmer Wall</option>
                      <option value="Wedding Decor">Wedding Decor</option>
                      <option value="Backdrops & Pedestal Tables Rental">Backdrops &amp; Pedestal Tables Rental</option>
                      <option value="Grab & Go Decor Rental Sets">Grab &amp; Go Decor Rental Sets</option>
                      <option value="Grab & Go Balloon Garland">Grab &amp; Go Balloon Garland</option>
                      <option value="Helium Balloon Bouquet">Helium Balloon Bouquet</option>
                    </select>
                  </div>
                  <div class="form-field">
                    <label for="cfTheme">Theme &amp; Colors *</label>
                    <input type="text" id="cfTheme" required placeholder="e.g. Rose Gold, Champagne &amp; White" />
                  </div>
                </div>
                <div class="form-field">
                  <label for="cfMessage">Additional Information / Event Date &amp; Venue *</label>
                  <textarea id="cfMessage" rows="3" required placeholder="Share your event date, venue or Kissimmee/Orlando location, and vision..."></textarea>
                </div>
                <div style="display:flex;gap:0.75rem;flex-wrap:wrap;">
                  <button type="submit" class="btn-primary" style="flex:1;">Submit Inquiry &amp; Request Quote</button>
                  <a href="${esc(b.jotformUrl)}" target="_blank" rel="noopener" class="btn-secondary">Open Full JotForm ↗</a>
                </div>
                <p id="contactFormFeedback" style="font-size:0.84rem;margin-top:0.65rem;color:var(--rose-accent);font-weight:600;"></p>
              </form>
            </div>

            <div>
              <h3 class="editorial-h2" style="font-size:1.65rem;margin-bottom:0.85rem;">Most frequent questions and answers</h3>
              <div class="couture-accordion">
                ${fq.bookingFaqs
                  .slice(0, 6)
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

    grid.innerHTML = items
      .slice(0, 3)
      .map((item, idx) => {
        const cleanCaption = sanitizeNoInstagramWord(item.caption);
        const postUrl = item.postUrl || `https://www.instagram.com/glamourballoonsboutique/p/${item.shortcode}/`;
        const mediaUrl = item.mediaUrl || `/api/media-proxy?shortcode=${encodeURIComponent(item.shortcode)}`;
        return `
          <a href="${esc(postUrl)}" target="_blank" rel="noopener" class="latest-plate">
            <div class="latest-plate-media">
              <img src="${esc(mediaUrl)}" alt="Glamour Balloons Boutique Latest Creation ${idx + 1}" />
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
    if (showAllPages) {
      const targetEl = document.getElementById(`page-${pageId}`);
      if (targetEl) targetEl.scrollIntoView({ behavior: "smooth" });
      return;
    }

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
  // 4. BOUTIQUE BAG & COUPON & CHECKOUT
  // =========================================================================
  function saveBag() {
    localStorage.setItem("gbb_bag", JSON.stringify(bag));
    updateBagUI();
  }

  function addToBag(id, title, price) {
    const numPrice = Number(price) || 0;
    const existing = bag.find((item) => item.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      bag.push({ id, title, price: numPrice, qty: 1 });
    }
    saveBag();
    openModal("bagModal");
  }

  function updateBagUI() {
    const count = bag.reduce((sum, item) => sum + item.qty, 0);
    const badge = document.getElementById("bagCountBadge");
    if (badge) badge.textContent = String(count);

    const container = document.getElementById("bagItemsContainer");
    const totalsBox = document.getElementById("bagTotalsBox");
    if (!container || !totalsBox) return;

    if (bag.length === 0) {
      container.innerHTML = `
        <div style="padding:1rem;background:var(--peony-soft);font-size:0.88rem;color:var(--mulberry-body);">
          Your Boutique Bag is currently empty. Add <strong>Baby Shower Deluxe Decor ($599.00)</strong> or any Party, Shimmer Wall, or Grab &amp; Go package!
          <div style="margin-top:0.65rem;">
            <button type="button" class="btn-secondary" data-add-bag="31160" data-title="Baby Shower Deluxe Decor" data-price="599" style="font-size:0.78rem;padding:0.45rem 0.9rem;">
              Add Baby Shower Deluxe Decor ($599.00)
            </button>
          </div>
        </div>
      `;
      totalsBox.innerHTML = "";
      return;
    }

    container.innerHTML = bag
      .map(
        (item, idx) => `
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.65rem 0;border-bottom:1px solid var(--rule-hairline);font-size:0.88rem;">
          <div>
            <strong>${esc(item.title)}</strong>
            <div style="font-size:0.78rem;color:var(--mulberry-muted);">$${item.price.toFixed(2)} × ${item.qty}</div>
          </div>
          <div style="display:flex;align-items:center;gap:0.5rem;">
            <span style="font-weight:600;">$${(item.price * item.qty).toFixed(2)}</span>
            <button type="button" data-remove-bag="${idx}" style="color:var(--rose-accent);font-weight:700;padding:0.2rem 0.45rem;">✕</button>
          </div>
        </div>
      `
      )
      .join("");

    const subtotal = bag.reduce((sum, item) => sum + item.price * item.qty, 0);
    let discount = 0;
    if (activeCoupon === "GLAMOUR20" && subtotal >= 400) {
      discount = subtotal * 0.2;
    } else if (activeCoupon === "GLAMOUR15" && subtotal >= 250) {
      discount = subtotal * 0.15;
    }
    const finalTotal = Math.max(0, subtotal - discount);

    totalsBox.innerHTML = `
      <div style="display:flex;justify-content:space-between;font-size:0.86rem;margin-bottom:0.25rem;">
        <span>Subtotal:</span>
        <strong>$${subtotal.toFixed(2)}</strong>
      </div>
      ${
        discount > 0
          ? `<div style="display:flex;justify-content:space-between;font-size:0.85rem;color:var(--rose-accent);margin-bottom:0.25rem;">
              <span>Promo (${esc(activeCoupon)}):</span>
              <strong>-$${discount.toFixed(2)}</strong>
            </div>`
          : ""
      }
      <div style="display:flex;justify-content:space-between;font-size:1.05rem;font-weight:700;color:var(--mulberry-ink);">
        <span>Estimated Total (Before Fees &amp; 7.5% Tax):</span>
        <span>$${finalTotal.toFixed(2)}</span>
      </div>
    `;
  }

  // =========================================================================
  // 5. MODALS & AUTH (@t.shopifyemail.com 6-DIGIT CODE)
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
        activeEmailEl.textContent = `Signed in as ${currentUser.email} (Verified via ${currentUser.verifiedVia || "@t.shopifyemail.com"})`;
      }
    } else {
      if (label) label.textContent = "Account";
      if (stepEmail) stepEmail.style.display = "block";
      if (stepCode) stepCode.style.display = "none";
      if (stepSigned) stepSigned.style.display = "none";
    }
  }

  // =========================================================================
  // 6. EVENT LISTENERS & INITIALIZATION
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

      const addBagBtn = e.target.closest("[data-add-bag]");
      if (addBagBtn) {
        addToBag(
          addBagBtn.dataset.addBag,
          addBagBtn.dataset.title,
          addBagBtn.dataset.price
        );
        return;
      }

      const removeBagBtn = e.target.closest("[data-remove-bag]");
      if (removeBagBtn) {
        const idx = Number(removeBagBtn.dataset.removeBag);
        bag.splice(idx, 1);
        saveBag();
        return;
      }

      const promoBtn = e.target.closest("[data-apply-promo]");
      if (promoBtn) {
        activeCoupon = promoBtn.dataset.applyPromo;
        const input = document.getElementById("couponInput");
        if (input) input.value = activeCoupon;
        const fb = document.getElementById("couponFeedback");
        if (fb) fb.textContent = `Promo code ${activeCoupon} staged in your bag!`;
        updateBagUI();
        openModal("bagModal");
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

    const toggleAllBtn = document.getElementById("toggleAllPagesBtn");
    if (toggleAllBtn) {
      toggleAllBtn.addEventListener("click", () => {
        showAllPages = !showAllPages;
        document.body.classList.toggle("show-all-pages", showAllPages);
        toggleAllBtn.textContent = showAllPages
          ? "Return to Single-Collection View"
          : "View Full Atelier Lookbook (All Pages)";
      });
    }

    const openAuthBtn = document.getElementById("openAuthBtn");
    if (openAuthBtn) {
      openAuthBtn.addEventListener("click", () => {
        syncAuthUI();
        openModal("authModal");
      });
    }

    const openBagBtn = document.getElementById("openBagBtn");
    const mobileBagDockBtn = document.getElementById("mobileBagDockBtn");
    [openBagBtn, mobileBagDockBtn].forEach((btn) => {
      if (btn) {
        btn.addEventListener("click", () => {
          updateBagUI();
          openModal("bagModal");
        });
      }
    });

    const applyCouponBtn = document.getElementById("applyCouponBtn");
    if (applyCouponBtn) {
      applyCouponBtn.addEventListener("click", () => {
        const val = String(document.getElementById("couponInput")?.value || "")
          .trim()
          .toUpperCase();
        const fb = document.getElementById("couponFeedback");
        if (val === "GLAMOUR20" || val === "GLAMOUR15") {
          activeCoupon = val;
          if (fb) fb.textContent = `Applied ${val}! (20% OFF $400+ or 15% OFF $250+)`;
          updateBagUI();
        } else {
          if (fb) fb.textContent = "Use GLAMOUR20 (20% OFF $400+) or GLAMOUR15 (15% OFF $250+).";
        }
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
        if (btn) btn.textContent = "Dispatching 6-Digit Code...";
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
            if (status) {
              status.textContent =
                "6-digit verification code sent from @t.shopifyemail.com! Check your inbox.";
            }
          } else {
            if (status) status.textContent = data.error || "Could not send code.";
          }
        } catch (err) {
          if (status) status.textContent = "Network error while sending verification code.";
        } finally {
          if (btn) btn.textContent = "Send 6-Digit Verification Code";
        }
      });
    }

    const authDirectRedirectBtn = document.getElementById("authDirectRedirectBtn");
    if (authDirectRedirectBtn) {
      authDirectRedirectBtn.addEventListener("click", () => {
        const email = String(document.getElementById("authEmailInput")?.value || "").trim();
        if (!email || !email.includes("@")) {
          const status = document.getElementById("authStatusMsg");
          if (status) status.textContent = "Please enter your email address first.";
          return;
        }
        window.open(`/api/auth/redirect?email=${encodeURIComponent(email)}`, "_blank");
      });
    }

    const authVerifyCodeForm = document.getElementById("authVerifyCodeForm");
    if (authVerifyCodeForm) {
      authVerifyCodeForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const code = String(document.getElementById("authCodeInput")?.value || "").trim();
        const status = document.getElementById("authStatusMsg");
        const btn = document.getElementById("authVerifyBtn");
        if (btn) btn.textContent = "Verifying Code...";
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
            if (status) status.textContent = "Signed in successfully!";
          } else {
            if (status) status.textContent = data.error || "Invalid verification code.";
          }
        } catch (err) {
          if (status) status.textContent = "Verification failed. Please try again.";
        } finally {
          if (btn) btn.textContent = "Verify Code & Sign In";
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
          phone: document.getElementById("wlPhone")?.value,
          eventDate: document.getElementById("wlEventDate")?.value
        };
        try {
          const resp = await fetch("/api/waitlist", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const data = await resp.json();
          if (status) {
            status.textContent =
              data.message ||
              "You’re on the VIP Experience Waitlist! We’ll be in touch with early access.";
          }
          waitlistForm.reset();
        } catch (err) {
          if (status) status.textContent = "Added to VIP Waitlist!";
        }
      });
    }

    // Contact Estimate Form
    const contactForm = document.getElementById("contactEstimateForm");
    if (contactForm) {
      contactForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const fb = document.getElementById("contactFormFeedback");
        if (fb) fb.textContent = "Submitting your event inquiry...";
        const payload = {
          firstName: document.getElementById("cfFirst")?.value,
          lastName: document.getElementById("cfLast")?.value,
          email: document.getElementById("cfEmail")?.value,
          phone: document.getElementById("cfPhone")?.value,
          intent: document.getElementById("cfIntent")?.value,
          occasion: document.getElementById("cfOccasion")?.value,
          service: document.getElementById("cfService")?.value,
          theme: document.getElementById("cfTheme")?.value,
          message: document.getElementById("cfMessage")?.value
        };
        try {
          await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          if (fb) {
            fb.textContent =
              "Thank you! Your inquiry has been received and forwarded to Glamour Balloons Boutique.";
          }
          contactForm.reset();
        } catch (err) {
          if (fb) {
            fb.textContent =
              "Inquiry logged! You can also select 'Open Full JotForm' to attach inspiration photos.";
          }
        }
      });
    }
  }

  // Initialize
  mountAllPages();
  bindEvents();
  updateBagUI();
  syncAuthUI();
  loadLatestThreeMedia();

  const initialHash = window.location.hash.replace("#", "").trim();
  if (initialHash && document.getElementById(`page-${initialHash}`)) {
    navigateToPage(initialHash, false);
  }
})();
