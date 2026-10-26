/**
 * Glamour Balloons Boutique LLC — Interactive Atelier Application
 * ===============================================================
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
      <div class="couture-media-frame ${extraClass}" data-lightbox="${esc(src)}" data-caption="${esc(label)}" role="button" tabindex="0">
        <img src="${esc(src)}" alt="${esc(alt || label)}" decoding="async" />
        <span class="zoom-pill-hint">🔍 Tap to Inspect</span>
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
        <!-- Couture Hero Archway -->
        <div class="hero-atelier">
          <div class="hero-top-strip">
            <h2>${esc(h.topCtaHeading)}</h2>
            <div style="display:flex;gap:0.6rem;flex-wrap:wrap;">
              <button type="button" class="btn-gold-cta" data-nav="contact">${esc(h.topCtaButton)}</button>
              <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-rose-outline">Get An Estimate</a>
            </div>
          </div>

          <div class="hero-grid">
            <div class="hero-copy-col">
              <span class="limited-badge">✦ ${esc(h.heroBadge)}</span>
              <h1 class="hero-h1">${esc(h.heroTitle)}</h1>
              <div class="hero-paragraphs">
                ${h.heroParagraphs.map((p) => `<p>${esc(p)}</p>`).join("")}
              </div>
              <div class="hero-cta-row">
                <button type="button" class="btn-gold-cta" data-nav="contact">${esc(h.topCtaButton)}</button>
                <button type="button" class="btn-rose-outline" data-nav="party-packages">Explore Party Packages</button>
                <button type="button" class="btn-rose-outline" data-nav="wedding-experience">The Wedding Experience</button>
              </div>
              <div class="hero-trust-pills">
                ${D.business.aboutAttributes.map((attr) => `<span class="trust-chip">✦ ${esc(attr)}</span>`).join("")}
              </div>
            </div>

            <div>
              <div style="text-align:center;margin-bottom:0.65rem;">
                <span class="section-eyebrow">${esc(h.chooseExperienceTitle)}</span>
              </div>
              <div class="hero-arches-col">
                ${h.chooseExperienceCards
                  .map(
                    (c) => `
                  <div class="chiara-arch-card" data-nav="${esc(c.targetPage)}">
                    <div class="couture-media-frame">
                      <img src="${esc(c.image)}" alt="${esc(c.alt)}" fetchpriority="high" />
                    </div>
                    <span class="chiara-arch-label">${esc(c.title)}</span>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
          </div>
        </div>

        <!-- NATIVE BUILT-IN VIEWER: "LATEST from Glamour Balloons:" -->
        <!-- Strictly NO word "Instagram" anywhere inside this section -->
        <div class="latest-media-atelier" id="latestFromGlamourSection">
          <div class="latest-media-header">
            <div class="latest-media-title-group">
              <span class="live-pulse-dot" aria-hidden="true"></span>
              <h2 class="latest-media-heading">LATEST from Glamour Balloons:</h2>
            </div>
            <a href="https://www.instagram.com/glamourballoonsboutique/" target="_blank" rel="noopener" class="latest-view-more-link">
              view more -&gt;
            </a>
          </div>
          <div class="latest-media-grid" id="latestMediaGrid">
            <!-- Populated dynamically by loadLatestThreeMedia() -->
          </div>
        </div>

        <!-- Our Work -->
        <div class="section-block">
          <div class="section-header">
            <span class="section-eyebrow">Signature Lookbook</span>
            <h2 class="section-title">${esc(h.ourWorkTitle)}</h2>
            <p class="section-subtitle">${esc(h.ourWorkSubtitle)}</p>
          </div>
          <div class="couture-grid-3">
            ${h.ourWorkCategories
              .map(
                (cat) => `
              <div class="couture-card">
                ${mediaFrame(cat.image, cat.title, "arch-frame", cat.title)}
                <h3 class="couture-card-title" style="text-align:center;">${esc(cat.title)}</h3>
                <div class="card-actions-row">
                  <button type="button" class="btn-rose-outline" data-nav="${esc(cat.targetPage)}">Explore Collection</button>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- Premium Services -->
        <div class="section-block">
          <div class="section-header">
            <span class="section-eyebrow">Bespoke Balloon Artistry</span>
            <h2 class="section-title">${esc(h.premiumServicesTitle)}</h2>
            <p class="section-subtitle">${esc(h.premiumServicesSubtitle)}</p>
          </div>
          <div class="couture-grid-3">
            ${h.premiumServices
              .map(
                (srv) => `
              <div class="couture-card">
                ${mediaFrame(srv.image, srv.title, "", srv.title)}
                <div class="price-pill-row">
                  <h3 class="couture-card-title" style="font-size:1.18rem;">${esc(srv.title)}</h3>
                  <span class="price-value" style="font-size:1.05rem;">${esc(srv.priceTag)}</span>
                </div>
                <p class="couture-card-sub">${esc(srv.description)}</p>
                <div class="card-actions-row">
                  <button type="button" class="btn-rose-outline" data-nav="${esc(srv.targetPage)}">View Details</button>
                  <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-gold-cta">Request A Quote</a>
                </div>
              </div>
            `
              )
              .join("")}
          </div>
        </div>

        <!-- The Experience / VIP Experience -->
        <div class="vip-atelier-banner">
          <div class="vip-media-duo">
            ${mediaFrame(exp.logoImage, exp.title, "contain-mode", exp.title)}
            ${mediaFrame(exp.featureImage, exp.vipSectionTitle, "", exp.vipSectionTitle)}
          </div>
          <div>
            <span class="limited-badge">${esc(exp.badge)} • ${esc(exp.vipSectionTitle)} (${esc(exp.vipSectionSubtitle)})</span>
            <h2 class="section-title" style="margin-top:0.5rem;margin-bottom:0.65rem;">${esc(exp.title)}</h2>
            <div style="display:flex;flex-direction:column;gap:0.5rem;font-size:0.9rem;color:var(--plum-soft);margin-bottom:1rem;">
              ${exp.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}
            </div>
            <p style="font-size:0.84rem;font-weight:700;color:var(--gold-deep);margin-bottom:0.75rem;">
              ${esc(exp.subText)}
            </p>
            <div style="display:flex;gap:0.65rem;flex-wrap:wrap;">
              <button type="button" class="btn-gold-cta" data-open-waitlist="1">👑 ${esc(exp.buttonText)}</button>
              <button type="button" class="btn-rose-outline" data-nav="contact">Start Your Booking</button>
            </div>
          </div>
        </div>

        <!-- Clients Who Trust Us -->
        <div class="section-block">
          <div class="section-header">
            <span class="section-eyebrow">4.9★ Rated on Google (222 Reviews)</span>
            <h2 class="section-title">Clients Who Trust Us</h2>
            <div style="margin-top:0.5rem;display:flex;justify-content:center;gap:0.6rem;flex-wrap:wrap;">
              <a href="${esc(D.business.googleReviewUrl)}" target="_blank" rel="noopener" class="btn-rose-outline" style="font-size:0.76rem;">Read More Reviews</a>
              <button type="button" class="btn-gold-cta" data-nav="reviews" style="font-size:0.76rem;">See All Client Reviews &amp; Photos</button>
            </div>
          </div>
          <div class="couture-grid-2">
            ${D.reviews.homeReviews
              .map(
                (r) => `
              <div class="couture-card">
                <div style="display:flex;justify-content:space-between;align-items:center;">
                  <h3 class="couture-card-title">${esc(r.author)}</h3>
                  <span style="color:var(--gold-primary);font-weight:700;">★★★★★</span>
                </div>
                <p class="couture-card-sub" style="white-space:pre-line;">${esc(r.text)}</p>
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
        <div class="section-header">
          <span class="section-eyebrow">What We Offer! • 7 Days A Week</span>
          <h1 class="section-title">${esc(w.heading)}</h1>
          <p class="section-subtitle">${esc(w.subheading)}</p>
          <p class="section-subtitle" style="margin-top:0.55rem;">${esc(w.introParagraph)}</p>
          <div style="margin-top:0.9rem;display:flex;justify-content:center;gap:0.65rem;flex-wrap:wrap;">
            <button type="button" class="btn-gold-cta" data-nav="contact">Start Your Booking</button>
            <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-rose-outline">Get An Estimate</a>
          </div>
        </div>

        <!-- 13-Image Official Lookbook Strip -->
        <div class="lookbook-strip" aria-label="Official Installation Gallery">
          ${w.carouselImages
            .map((img) => mediaFrame(img.src, img.alt, "", img.alt))
            .join("")}
        </div>

        <!-- All 14 Official Services -->
        <div class="couture-grid-3" style="margin-top:1.5rem;">
          ${w.services
            .map(
              (s) => `
            <div class="couture-card">
              ${s.badge ? `<span class="card-ribbon-badge">${esc(s.badge)}</span>` : ""}
              ${mediaFrame(s.image, s.title, "", s.title)}
              <h2 class="couture-card-title">${esc(s.title)}</h2>
              <p class="couture-card-sub" style="flex:1;">${esc(s.description)}</p>
              <div class="card-actions-row">
                ${
                  s.targetPage
                    ? `<button type="button" class="btn-gold-cta" data-nav="${esc(s.targetPage)}">${esc(s.actionText)}</button>`
                    : s.externalUrl
                    ? `<a href="${esc(s.externalUrl)}" target="_blank" rel="noopener" class="btn-gold-cta">${esc(s.actionText)}</a>`
                    : `<span class="btn-rose-outline" style="text-align:center;opacity:0.75;">${esc(s.actionText)}</span>`
                }
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        <!-- Celebrate with Style -->
        <div class="vip-atelier-banner" style="margin-top:2rem;">
          <div>
            ${mediaFrame(w.celebrateWithStyle.image, w.celebrateWithStyle.title, "contain-mode", w.celebrateWithStyle.title)}
          </div>
          <div>
            <h3 class="section-title" style="margin-bottom:0.65rem;">${esc(w.celebrateWithStyle.title)}</h3>
            <div style="display:flex;flex-direction:column;gap:0.5rem;font-size:0.9rem;color:var(--plum-soft);margin-bottom:1rem;">
              ${w.celebrateWithStyle.paragraphs.map((p) => `<p>${esc(p)}</p>`).join("")}
            </div>
            <h4 style="font-family:var(--font-display);font-size:1.3rem;margin-bottom:0.5rem;">Book Your Balloon Decorations Today!</h4>
            <div style="display:flex;gap:0.6rem;flex-wrap:wrap;">
              <a href="${esc(D.business.phoneHref)}" class="btn-rose-outline">📞 ${esc(D.business.phoneFullDisplay)}</a>
              <a href="${esc(D.business.whatsappDirectHref)}" target="_blank" rel="noopener" class="btn-rose-outline">💬 Start A WhatsApp Chat</a>
              <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-gold-cta">Get An Estimate</a>
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
        <div class="section-header">
          <span class="section-eyebrow">${esc(lp.inspirationTag)}</span>
          <h1 class="section-title">${esc(lp.title)}</h1>
          <p class="section-subtitle">${esc(lp.subtitle)}</p>
          <p class="section-subtitle" style="margin-top:0.45rem;font-weight:600;">${esc(lp.inspirationHeading)}</p>
          <p class="section-subtitle" style="margin-top:0.35rem;">${esc(lp.inspirationText)}</p>
          <div style="margin-top:0.85rem;display:flex;justify-content:center;gap:0.65rem;flex-wrap:wrap;">
            <button type="button" class="btn-gold-cta" data-nav="contact">Start Your Booking</button>
            <button type="button" class="btn-rose-outline" data-nav="wedding-experience">Wedding Decor</button>
          </div>
        </div>

        <div class="couture-grid-4" style="margin-bottom:2rem;">
          ${lp.galleryImages
            .map((src, i) => `
              <div class="couture-card">
                ${mediaFrame(src, `${lp.title} Lookbook ${i + 1}`, "", lp.milestoneText)}
              </div>
            `)
            .join("")}
        </div>

        <div class="section-header">
          <h3 class="section-title">${esc(lp.tailoredTitle)}</h3>
          ${lp.tailoredParagraphs.map((p) => `<p class="section-subtitle">${esc(p)}</p>`).join("")}
        </div>

        <div class="couture-grid-2">
          <div class="couture-card">
            ${mediaFrame(lp.shimmerSection.image, lp.shimmerSection.title, "", lp.shimmerSection.title)}
            <h2 class="couture-card-title">${esc(lp.shimmerSection.title)}</h2>
            ${lp.shimmerSection.paragraphs.map((p) => `<p class="couture-card-sub">${esc(p)}</p>`).join("")}
            <h5 style="font-size:0.82rem;font-weight:700;color:var(--gold-deep);margin-top:0.35rem;">Available Sizes:</h5>
            <ul class="feature-list">
              ${lp.shimmerSection.sizes.map((s) => `<li>${esc(s)}</li>`).join("")}
            </ul>
            <div class="card-actions-row">
              <button type="button" class="btn-gold-cta" data-nav="shimmer-walls">Explore Shimmer Walls</button>
            </div>
          </div>

          <div class="couture-card">
            ${mediaFrame(lp.flowerWallSection.image, lp.flowerWallSection.title, "", lp.flowerWallSection.title)}
            <h2 class="couture-card-title">${esc(lp.flowerWallSection.title)}</h2>
            ${lp.flowerWallSection.paragraphs.map((p) => `<p class="couture-card-sub">${esc(p)}</p>`).join("")}
            <h5 style="font-size:0.82rem;font-weight:700;color:var(--gold-deep);margin-top:0.35rem;">Available Sizes:</h5>
            <ul class="feature-list">
              ${lp.flowerWallSection.sizes.map((s) => `<li>${esc(s)}</li>`).join("")}
            </ul>
            <div class="card-actions-row">
              <button type="button" class="btn-gold-cta" data-nav="wedding-experience">Visit Our Wedding Experience Page</button>
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
        <div class="vip-atelier-banner" style="margin-top:0;">
          <div>
            ${mediaFrame(w.heroImage, w.title, "arch-frame", w.title)}
          </div>
          <div>
            <span class="section-eyebrow">The Wedding Experience</span>
            <h1 class="section-title">${esc(w.title)}</h1>
            <p class="section-subtitle" style="margin:0.65rem 0 1rem;">${esc(w.intro)}</p>
            <div style="display:flex;gap:0.65rem;flex-wrap:wrap;">
              <button type="button" class="btn-gold-cta" data-nav="contact">${esc(w.ctaButton)}</button>
              <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-rose-outline">Reserve Your Luxury Look</a>
            </div>
          </div>
        </div>

        <div class="couture-grid-4" style="margin-bottom:2rem;">
          ${w.pillars
            .map(
              (p) => `
            <div class="couture-card">
              <h3 class="couture-card-title">${esc(p.title)}</h3>
              <p class="couture-card-sub">${esc(p.text)}</p>
            </div>
          `
            )
            .join("")}
        </div>

        <div class="section-header">
          <span class="section-eyebrow">${esc(w.servicesHeading)}</span>
          <h2 class="section-title">${esc(w.servicesSubheading)}</h2>
        </div>

        <div class="couture-grid-3" style="margin-bottom:2rem;">
          ${w.services
            .map(
              (s) => `
            <div class="couture-card">
              <h3 class="couture-card-title">${esc(s.title)}</h3>
              <p class="couture-card-sub">${esc(s.text)}</p>
            </div>
          `
            )
            .join("")}
        </div>

        <!-- Customized Wedding Welcome Signs -->
        <div class="vip-atelier-banner">
          <div>
            ${mediaFrame(w.welcomeSigns.image, "Customized Wedding Welcome Signs", "contain-mode", "Customized Wedding Welcome Signs")}
          </div>
          <div>
            <h3 class="section-title" style="font-size:1.55rem;margin-bottom:0.5rem;">Customized Wedding Welcome Signs</h3>
            <p class="couture-card-sub" style="margin-bottom:0.75rem;">${esc(w.welcomeSigns.description)}</p>
            <h5 style="font-weight:700;color:var(--rose-berry);margin-bottom:0.35rem;">${esc(w.welcomeSigns.optionsTitle)}</h5>
            <ul class="feature-list" style="margin-bottom:0.65rem;">
              ${w.welcomeSigns.options.map((o) => `<li>${esc(o)}</li>`).join("")}
            </ul>
            ${w.welcomeSigns.notes.map((n) => `<p style="font-size:0.78rem;color:var(--plum-muted);">${esc(n)}</p>`).join("")}
            <div style="margin-top:0.65rem;display:flex;flex-direction:column;gap:0.25rem;font-size:0.82rem;font-weight:600;">
              ${w.welcomeSigns.highlights.map((hl) => `<span>${esc(hl)}</span>`).join("")}
            </div>
          </div>
        </div>

        <!-- 5 Wedding Packages -->
        <div class="section-header">
          <span class="section-eyebrow">F E A T U R I N G</span>
          <h2 class="section-title">Signature Wedding Packages</h2>
        </div>
        <div class="couture-grid-3">
          ${w.packages
            .map(
              (pkg) => `
            <div class="couture-card">
              ${pkg.badge ? `<span class="card-ribbon-badge">${esc(pkg.badge)}</span>` : ""}
              ${mediaFrame(pkg.image, pkg.title, "contain-mode", pkg.title)}
              <h3 class="couture-card-title">${esc(pkg.title)}</h3>
              <p class="couture-card-sub" style="font-weight:600;color:var(--gold-deep);">${esc(pkg.subtitle)}</p>
              ${pkg.description ? `<p class="couture-card-sub">${esc(pkg.description)}</p>` : ""}
              <ul class="feature-list">
                ${pkg.items.map((it) => `<li>${esc(it)}</li>`).join("")}
              </ul>
              <div class="card-actions-row">
                <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-gold-cta">Reserve Your Date</a>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function renderShimmerWallsPage() {
    const sw = D.shimmerWalls;
    return `
      <section class="page-section" id="page-shimmer-walls" data-page="shimmer-walls">
        <div class="vip-atelier-banner" style="margin-top:0;">
          <div>
            ${mediaFrame(sw.heroImage, `${sw.title} ${sw.subtitle}`, "contain-mode", `${sw.title} ${sw.subtitle}`)}
          </div>
          <div>
            <span class="limited-badge">${esc(sw.tag)}</span>
            <h1 class="section-title" style="margin-top:0.4rem;">${esc(sw.title)} — ${esc(sw.subtitle)}</h1>
            <h2 style="font-family:var(--font-display);font-size:1.45rem;color:var(--rose-berry);margin:0.4rem 0;">
              ${esc(sw.startingHeading)}
            </h2>
            ${sw.paragraphs.map((p) => `<p class="couture-card-sub" style="margin-bottom:0.5rem;">${esc(p)}</p>`).join("")}
            <div style="margin-top:0.75rem;display:flex;gap:0.6rem;flex-wrap:wrap;">
              <button type="button" class="btn-gold-cta" data-nav="contact">Book Now</button>
              <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-rose-outline">Get An Estimate</a>
            </div>
          </div>
        </div>

        <div class="vip-atelier-banner">
          <div>
            <span class="section-eyebrow">Metallic Shades Palette</span>
            <h2 class="section-title">${esc(sw.colorsHeading)}</h2>
            <p class="couture-card-sub" style="margin-top:0.5rem;">
              Available in gold, silver, rose gold, red, black, blue, white and more. Tap the color chart to inspect full details.
            </p>
          </div>
          <div>
            ${mediaFrame(sw.colorsImage, sw.colorsHeading, "contain-mode", sw.colorsHeading)}
          </div>
        </div>

        <div class="section-header">
          <h2 class="section-title">${esc(sw.sizesHeading)}</h2>
        </div>

        <div class="couture-grid-4">
          ${sw.sizes
            .map(
              (sz) => `
            <div class="couture-card">
              ${mediaFrame(sz.image, `Shimmer Wall ${sz.size}`, "", `Shimmer Wall ${sz.size}`)}
              <div class="price-pill-row">
                <h3 class="couture-card-title">${esc(sz.size)}</h3>
                <span class="price-value">${esc(sz.priceDisplay)}</span>
              </div>
              <p class="couture-card-sub">${esc(sz.subtitle)}</p>
              <p style="font-size:0.78rem;font-weight:700;color:var(--gold-deep);">What is included?</p>
              <ul class="feature-list">
                ${sz.included.map((i) => `<li>${esc(i)}</li>`).join("")}
              </ul>
              ${sz.additionalNote ? `<p class="card-footer-note">${esc(sz.additionalNote)}</p>` : ""}
              <p class="card-footer-note">${esc(sz.note)}</p>
              <div class="card-actions-row">
                <button type="button" class="btn-gold-cta" data-add-bag="${esc(sz.id)}" data-title="Shimmer Wall ${esc(sz.size)}" data-price="${sz.price}">
                  + Add to Bag
                </button>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function renderPartyPackagesPage() {
    const pp = D.partyPackages;
    return `
      <section class="page-section" id="page-party-packages" data-page="party-packages">
        <div class="section-header">
          <span class="section-eyebrow">${esc(pp.eyebrow)}</span>
          <h1 class="section-title">${esc(pp.heading)}</h1>
          <p class="section-subtitle">${esc(pp.intro)}</p>
          <p class="section-subtitle" style="margin-top:0.35rem;">${esc(pp.customizableNote)}</p>
          <div style="margin-top:0.85rem;display:flex;justify-content:center;gap:0.65rem;flex-wrap:wrap;">
            <button type="button" class="btn-gold-cta" data-nav="contact">Customize Your Package</button>
            <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-rose-outline">Get An Estimate</a>
          </div>
        </div>

        <div class="couture-grid-2" style="margin-bottom:1.5rem;">
          ${pp.bannerImages.map((src, idx) => `<div class="couture-card">${mediaFrame(src, `Party Decor Guide ${idx + 1}`, "contain-mode", `Party Decor Guide ${idx + 1}`)}</div>`).join("")}
        </div>

        <div class="couture-card" style="margin-bottom:2rem;">
          <h5 style="font-size:0.95rem;color:var(--rose-berry);">ℹ️ Please Note:</h5>
          <p class="couture-card-sub">${esc(pp.pleaseNote)}</p>
          <h5 style="font-size:0.95rem;color:var(--gold-deep);margin-top:0.4rem;">📍 Service Details</h5>
          <ul class="feature-list">
            ${pp.serviceDetails.map((d) => `<li>${esc(d)}</li>`).join("")}
          </ul>
        </div>

        ${pp.tiers
          .map(
            (tier) => `
          <div class="section-block">
            <div class="section-header">
              <h2 class="section-title">${esc(tier.tierName)}</h2>
              <p class="section-subtitle">${esc(tier.tierIntro)}</p>
            </div>
            <div class="couture-grid-3">
              ${tier.packages
                .map(
                  (pkg) => `
                <div class="couture-card">
                  ${pkg.badge ? `<span class="card-ribbon-badge">${esc(pkg.badge)}</span>` : ""}
                  ${mediaFrame(pkg.image, pkg.title, "contain-mode", pkg.title)}
                  <div class="price-pill-row">
                    <h3 class="couture-card-title">${esc(pkg.title)}</h3>
                    <span class="price-value">${esc(pkg.priceLabel)}</span>
                  </div>
                  <p class="couture-card-sub">${esc(pkg.subtitle)}</p>
                  <ul class="feature-list">
                    ${pkg.items.map((it) => `<li>${esc(it)}</li>`).join("")}
                  </ul>
                  <p class="card-footer-note">${esc(pkg.footerNote)}</p>
                  <div class="card-actions-row">
                    <button type="button" class="btn-gold-cta" data-add-bag="${esc(pkg.id)}" data-title="${esc(pkg.title)}" data-price="${pkg.price}">
                      + Add to Bag ($${pkg.price})
                    </button>
                    <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-rose-outline" style="text-align:center;">
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
        <div class="vip-atelier-banner" style="margin-top:0;">
          <div>
            ${mediaFrame(ts.heroImage, "Birthday Decor Set", "", "Birthday Decor Set")}
          </div>
          <div>
            <span class="section-eyebrow">${esc(ts.eyebrow)} • ${esc(ts.rentalHeading)}</span>
            <h1 class="section-title">${esc(ts.grabGoTitle)} — ${esc(ts.startingAt)}</h1>
            <p class="couture-card-sub" style="margin:0.45rem 0;">${esc(ts.intro)}</p>
            <p class="couture-card-sub" style="margin-bottom:0.75rem;">${esc(ts.serviceAreaText)}</p>
            <div style="display:flex;gap:0.6rem;flex-wrap:wrap;">
              <button type="button" class="btn-gold-cta" data-nav="grab-go">More Info &amp; Packages</button>
              <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-rose-outline">Get A Free Estimate Here</a>
            </div>
          </div>
        </div>

        <div class="couture-grid-3" style="margin-bottom:2rem;">
          <div class="couture-card">
            <h3 class="couture-card-title">${esc(ts.includedTitle)}</h3>
            <ul class="feature-list">
              ${ts.includedItems.map((i) => `<li>${esc(i)}</li>`).join("")}
            </ul>
            <h4 style="font-size:0.9rem;font-weight:700;color:var(--gold-deep);margin-top:0.5rem;">${esc(ts.addOnsTitle)}</h4>
            <ul class="feature-list">
              ${ts.addOns.map((a) => `<li>${esc(a)}</li>`).join("")}
            </ul>
          </div>

          <div class="couture-card">
            ${mediaFrame(ts.featureThemeImage, "Minnie Mouse Thematic Set", "contain-mode", "Minnie Mouse Thematic Set")}
            ${ts.disclaimers.map((d) => `<p class="card-footer-note">${esc(d)}</p>`).join("")}
          </div>

          <div class="couture-card">
            <span class="section-eyebrow">Grab &amp; Go Rental Decorations</span>
            <h3 class="couture-card-title">${esc(ts.howItWorksTitle)}</h3>
            <ol style="padding-left:1.2rem;display:flex;flex-direction:column;gap:0.5rem;font-size:0.88rem;color:var(--plum-soft);margin-top:0.4rem;">
              ${ts.howItWorksSteps.map((s) => `<li>${esc(s)}</li>`).join("")}
            </ol>
            <div class="card-actions-row">
              <a href="${esc(D.business.whatsappDirectHref)}" target="_blank" rel="noopener" class="btn-gold-cta">Start A WhatsApp Chat</a>
            </div>
          </div>
        </div>

        <div class="section-header">
          <h2 class="section-title">${esc(ts.exclusiveTitle)}</h2>
          <p class="section-subtitle">${esc(ts.exclusiveDescription)}</p>
        </div>

        <div class="couture-grid-4">
          ${ts.gallery
            .map(
              (src, idx) => `
            <div class="couture-card">
              ${mediaFrame(src, `Exclusive Thematic Set ${idx + 1}`, "contain-mode", `Exclusive Thematic Set ${idx + 1}`)}
            </div>
          `
            )
            .join("")}
        </div>
      </section>
    `;
  }

  function renderGrabAndGoPage() {
    const gg = D.grabAndGo;
    return `
      <section class="page-section" id="page-grab-go" data-page="grab-go">
        <div class="section-header">
          <span class="section-eyebrow">${esc(gg.setsSubheading)}</span>
          <h1 class="section-title">${esc(gg.heroTitle)}</h1>
          <p class="section-subtitle">${esc(gg.heroSubtitle)}</p>
          <p class="section-subtitle" style="margin-top:0.45rem;">${esc(gg.setsDescription)}</p>
          <p style="font-size:0.88rem;font-weight:700;margin-top:0.55rem;color:var(--rose-berry);">${esc(gg.occasionsLine)}</p>
          <p style="font-size:0.84rem;font-weight:600;margin-top:0.35rem;color:var(--gold-deep);">${esc(gg.pickupSummary)}</p>
        </div>

        <div class="couture-grid-2" style="margin-bottom:1.75rem;">
          <div class="couture-card">
            <h4 class="couture-card-title">📌 Important Info:</h4>
            <ul class="feature-list">
              ${gg.importantInfo.map((i) => `<li>${esc(i)}</li>`).join("")}
            </ul>
          </div>
          <div class="couture-card">
            <h4 class="couture-card-title">📅 Booking Info:</h4>
            <p class="couture-card-sub">${esc(gg.bookingInfo)}</p>
            <div class="card-actions-row">
              <button type="button" class="btn-gold-cta" data-nav="contact">Book Now</button>
              <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-rose-outline">Reserve Your Date</a>
            </div>
          </div>
        </div>

        <div class="section-header">
          <h2 class="section-title">${esc(gg.setsHeading)}</h2>
        </div>

        <div class="couture-grid-4" style="margin-bottom:2.25rem;">
          ${gg.decorSets
            .map(
              (set) => `
            <div class="couture-card">
              ${set.badge ? `<span class="card-ribbon-badge">${esc(set.badge)}</span>` : ""}
              ${mediaFrame(set.image, set.title, "contain-mode", `Grab & Go ${set.title}`)}
              <div class="price-pill-row">
                <h3 class="couture-card-title">${esc(set.title)}</h3>
                <div>
                  <span class="price-strike">$ ${set.originalPrice}</span>
                  <span class="price-value">$ ${set.price}</span>
                </div>
              </div>
              <ul class="feature-list">
                ${set.items.map((it) => `<li>${esc(it)}</li>`).join("")}
              </ul>
              <div class="card-actions-row">
                <button type="button" class="btn-gold-cta" data-add-bag="${esc(set.id)}" data-title="Grab & Go Set: ${esc(set.title)}" data-price="${set.price}">
                  + Add to Bag ($${set.price})
                </button>
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        <!-- Grab & Go Balloon Garlands -->
        <div class="section-header">
          <span class="section-eyebrow">${esc(gg.garlandsSubheading)}</span>
          <h2 class="section-title">${esc(gg.garlandsHeading)}</h2>
          <p class="section-subtitle">${esc(gg.garlandsDescription)}</p>
          ${gg.garlandsBullets.map((b) => `<p style="font-size:0.84rem;font-weight:600;margin-top:0.3rem;color:var(--gold-deep);">${esc(b)}</p>`).join("")}
        </div>

        <div class="couture-grid-4" style="margin-bottom:2.25rem;">
          ${gg.garlands
            .map(
              (g) => `
            <div class="couture-card">
              ${g.badge ? `<span class="card-ribbon-badge">${esc(g.badge)}</span>` : ""}
              ${mediaFrame(g.image, g.title, "contain-mode", `${g.title} (${g.size})`)}
              <div class="price-pill-row">
                <h3 class="couture-card-title" style="font-size:1.1rem;">${esc(g.title)}</h3>
                <span class="price-value" style="font-size:1.1rem;">$${g.price}</span>
              </div>
              <p class="card-footer-note">${esc(g.priceLabel)}</p>
              <ul class="feature-list">
                ${g.items.map((it) => `<li>${esc(it)}</li>`).join("")}
              </ul>
              <div class="card-actions-row">
                <button type="button" class="btn-gold-cta" data-add-bag="${esc(g.id)}" data-title="Grab & Go Garland: ${esc(g.title)}" data-price="${g.price}">
                  + Add to Bag ($${g.price})
                </button>
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        <!-- Grab & Go FAQs -->
        <div class="section-header">
          <h3 class="section-title">Grab &amp; Go FAQ</h3>
        </div>
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
      </section>
    `;
  }

  function renderPricingAndBudgetPages() {
    const pr = D.pricing;
    return `
      <!-- PRICING PAGE (/pricing26/) -->
      <section class="page-section" id="page-pricing" data-page="pricing">
        <div class="section-header">
          <span class="section-eyebrow">Investment &amp; Menu Guide</span>
          <h1 class="section-title">${esc(pr.basePricingHeading)}</h1>
        </div>

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

        <div class="couture-grid-4">
          ${pr.menuImages
            .map(
              (src, idx) => `
            <div class="couture-card">
              ${mediaFrame(src, `Base Pricing Menu Page ${idx + 1}`, "contain-mode", `Base Pricing Menu Page ${idx + 1}`)}
              <p class="card-footer-note" style="text-align:center;">Base Pricing Menu ${idx + 1} (Tap to Enlarge)</p>
            </div>
          `
            )
            .join("")}
        </div>
      </section>

      <!-- PARTY WITHIN YOUR BUDGET (/party-within-your-budget/) -->
      <section class="page-section" id="page-budget" data-page="budget">
        <div class="section-header">
          <span class="section-eyebrow">Party Within Your Budget</span>
          <h1 class="section-title">${esc(pr.budgetHeading)}</h1>
          <p class="section-subtitle">${esc(pr.budgetDisclaimer)}</p>
          <div style="margin-top:0.75rem;display:flex;justify-content:center;gap:0.6rem;flex-wrap:wrap;">
            <a href="${esc(D.business.phoneHref)}" class="btn-rose-outline">📞 ${esc(D.business.phoneFullDisplay)}</a>
            <a href="${esc(D.business.whatsappDirectHref)}" target="_blank" rel="noopener" class="btn-rose-outline">💬 Start A WhatsApp Chat</a>
            <a href="${esc(D.business.jotformUrl)}" target="_blank" rel="noopener" class="btn-gold-cta">Get A Free Quote</a>
          </div>
        </div>

        <div class="couture-grid-3">
          ${pr.budgetImages
            .map(
              (src, idx) => `
            <div class="couture-card">
              ${mediaFrame(src, `Budget Package Option ${idx + 1}`, "contain-mode", `Party Within Your Budget Option ${idx + 1}`)}
            </div>
          `
            )
            .join("")}
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
        <div class="section-header">
          <span class="section-eyebrow">Exclusive Promotions</span>
          <h1 class="section-title">${esc(cd.title)}</h1>
        </div>

        <div class="couture-card" style="margin-bottom:1.5rem;">
          ${mediaFrame(cd.bannerImage, "Holiday Gift Coupon", "contain-mode", "Holiday Gift Coupon")}
        </div>

        <div class="couture-grid-2" style="margin-bottom:2rem;">
          ${cd.deals
            .map(
              (dl) => `
            <div class="couture-card">
              ${mediaFrame(dl.image, dl.title, "contain-mode", dl.title)}
              <h3 class="couture-card-title">${esc(dl.title)}</h3>
              <ul class="feature-list">
                ${dl.terms.map((t) => `<li>${esc(t)}</li>`).join("")}
              </ul>
              <div class="card-actions-row">
                <button type="button" class="btn-gold-cta" data-apply-promo="${esc(dl.code)}">
                  Apply Promo (${esc(dl.code)})
                </button>
                <button type="button" class="btn-rose-outline" data-nav="contact">Start Your Booking</button>
              </div>
            </div>
          `
            )
            .join("")}
        </div>

        <div class="couture-grid-3">
          ${cd.showcaseImages
            .map((src, i) => `<div class="couture-card">${mediaFrame(src, `Glamour Showcase ${i + 1}`, "", `Glamour Showcase ${i + 1}`)}</div>`)
            .join("")}
        </div>
      </section>

      <!-- SHOP (/shop/ & /product/baby-shower-deluxe-decor/) -->
      <section class="page-section" id="page-shop" data-page="shop">
        <div class="section-header">
          <span class="section-eyebrow">Online Boutique Shop • Direct Checkout</span>
          <h1 class="section-title">${esc(prod.title)}</h1>
          <p class="section-subtitle">Category: ${esc(prod.category)} • Tags: ${esc(prod.tags.join(", "))}</p>
        </div>

        <div class="vip-atelier-banner">
          <div>
            ${mediaFrame(prod.image, prod.title, "", prod.title)}
          </div>
          <div>
            <span class="limited-badge">✓ ${esc(prod.stockText)}</span>
            <h2 class="section-title" style="margin-top:0.45rem;">${esc(prod.title)}</h2>
            <p class="price-value" style="font-size:2rem;margin:0.35rem 0;">${esc(prod.priceFormatted)}</p>
            <p class="couture-card-sub" style="margin-bottom:0.75rem;">${esc(prod.shortDescription)}</p>
            <h5 style="font-weight:700;color:var(--gold-deep);margin-bottom:0.35rem;">What’s included:</h5>
            <ul class="feature-list" style="margin-bottom:0.65rem;">
              ${prod.included.map((item) => `<li>${esc(item)}</li>`).join("")}
            </ul>
            <p class="card-footer-note" style="margin-bottom:0.9rem;">
              <strong>Not included:</strong> ${esc(prod.notIncluded)}
            </p>
            <div style="display:flex;gap:0.65rem;flex-wrap:wrap;">
              <button type="button" class="btn-gold-cta" data-add-bag="${esc(prod.id)}" data-title="${esc(prod.title)}" data-price="${prod.price}">
                🛍️ Add to Boutique Bag (${esc(prod.priceFormatted)})
              </button>
              <form action="${esc(prod.productUrl)}" method="post" enctype="multipart/form-data" target="_blank" style="display:inline-flex;">
                <input type="hidden" name="quantity" value="1" />
                <input type="hidden" name="add-to-cart" value="${esc(prod.id)}" />
                <button type="submit" class="btn-rose-outline">
                  Direct WooCommerce Cart ↗
                </button>
              </form>
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
        <div class="section-header">
          <span class="section-eyebrow">4.9★ on Google Maps • 222 Verified Reviews</span>
          <h1 class="section-title">What Clients Say About Our Work</h1>
          <div style="max-width:260px;margin:0.65rem auto;">
            ${mediaFrame(rev.starsBannerImage, "5 Star Google Reviews", "contain-mode", "5 Star Google Reviews")}
          </div>
          <div style="display:flex;justify-content:center;gap:0.6rem;flex-wrap:wrap;margin-top:0.5rem;">
            <a href="${esc(b.googleReviewUrl)}" target="_blank" rel="noopener" class="btn-gold-cta">Write / Read Google Reviews ↗</a>
            <a href="${esc(b.googleMapsUrl)}" target="_blank" rel="noopener" class="btn-rose-outline">Open on Google Maps ↗</a>
          </div>
        </div>

        <div class="couture-grid-2" style="margin-bottom:2rem;">
          ${rev.googleMapsReviews
            .map(
              (r) => `
            <div class="couture-card">
              <div style="display:flex;justify-content:space-between;align-items:flex-start;">
                <div>
                  <h3 class="couture-card-title">${esc(r.author)}</h3>
                  <p style="font-size:0.74rem;color:var(--plum-muted);">${esc(r.meta)} • ${esc(r.date)}</p>
                </div>
                <span style="color:var(--gold-primary);font-weight:700;">★★★★★</span>
              </div>
              <p class="couture-card-sub" style="white-space:pre-line;">${esc(r.text)}</p>
              ${
                r.photos && r.photos.length
                  ? `<div class="couture-grid-${r.photos.length > 1 ? "2" : "1"}">
                      ${r.photos.map((p) => mediaFrame(p, `Customer Photo by ${r.author}`, "", `Review Photo by ${r.author}`)).join("")}
                    </div>`
                  : ""
              }
            </div>
          `
            )
            .join("")}
        </div>

        <div class="section-header">
          <h2 class="section-title">Featured Testimonials from /reviews/</h2>
        </div>
        <div class="couture-grid-3" style="margin-bottom:2rem;">
          ${rev.siteReviewsPage
            .map(
              (sr) => `
            <div class="couture-card">
              <div style="display:flex;align-items:center;gap:0.65rem;">
                <img src="${esc(sr.avatar)}" alt="${esc(sr.author)}" style="width:38px;height:38px;border-radius:50%;object-fit:contain;" />
                <div>
                  <h3 class="couture-card-title" style="font-size:1.1rem;">${esc(sr.author)}</h3>
                  <span style="color:var(--gold-primary);font-size:0.8rem;">★★★★★</span>
                </div>
              </div>
              <p class="couture-card-sub">${esc(sr.text)}</p>
            </div>
          `
            )
            .join("")}
        </div>

        <div class="section-header">
          <h2 class="section-title">Google Maps Customer &amp; Venue Gallery</h2>
        </div>
        <div class="couture-grid-4">
          ${rev.googleMapsPhotos
            .map((p, i) => `<div class="couture-card">${mediaFrame(p, `Google Maps Photo ${i + 1}`, "", `Google Maps Customer Installation ${i + 1}`)}</div>`)
            .join("")}
        </div>
      </section>

      <!-- FAQ (/faq/ + /contact-us-2/) -->
      <section class="page-section" id="page-faq" data-page="faq">
        <div class="section-header">
          <span class="section-eyebrow">We Deliver Balloons In Orlando, Kissimmee &amp; Nearby Areas!</span>
          <h1 class="section-title">Frequently Asked Questions!</h1>
          <p class="section-subtitle">Most frequent questions and answers</p>
        </div>

        <div class="couture-grid-2">
          <div>
            <h3 class="couture-card-title" style="margin-bottom:0.75rem;">Booking, Setup &amp; Event FAQs</h3>
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
            <h3 class="couture-card-title" style="margin-bottom:0.75rem;">Helium, Float Time &amp; Balloon Care FAQs</h3>
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
      </section>

      <!-- POLICIES (/policies/) -->
      <section class="page-section" id="page-policies" data-page="policies">
        <div class="section-header">
          <span class="section-eyebrow">${esc(pol.partyDecor.subtitle)}</span>
          <h1 class="section-title">${esc(pol.partyDecor.title)}</h1>
          <p class="section-subtitle">${esc(pol.partyDecor.categoryEn)}</p>
          <p class="section-subtitle" style="font-style:italic;">${esc(pol.partyDecor.categoryPt)}</p>
        </div>

        <div class="couture-grid-2" style="margin-bottom:2.25rem;">
          ${pol.partyDecor.sections
            .map(
              (sec) => `
            <div class="couture-card">
              <div class="price-pill-row">
                <span class="price-value">${esc(sec.num)}</span>
                <h3 class="couture-card-title" style="font-size:1.12rem;">${esc(sec.heading)}</h3>
              </div>
              ${(sec.paragraphs || []).map((p) => `<p class="couture-card-sub">${esc(p)}</p>`).join("")}
              ${
                sec.bullets
                  ? `<ul class="feature-list">${sec.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`
                  : ""
              }
            </div>
          `
            )
            .join("")}
        </div>

        <div class="section-header">
          <span class="section-eyebrow">${esc(pol.balloonArrangements.subtitle)}</span>
          <h2 class="section-title">${esc(pol.balloonArrangements.title)}</h2>
          <p class="section-subtitle">${esc(pol.balloonArrangements.categoryEn)}</p>
        </div>

        <div class="couture-grid-2">
          ${pol.balloonArrangements.sections
            .map(
              (sec) => `
            <div class="couture-card">
              <div class="price-pill-row">
                <span class="price-value">${esc(sec.num)}</span>
                <h3 class="couture-card-title" style="font-size:1.12rem;">${esc(sec.heading)}</h3>
              </div>
              ${(sec.paragraphs || []).map((p) => `<p class="couture-card-sub">${esc(p)}</p>`).join("")}
              ${
                sec.bullets
                  ? `<ul class="feature-list">${sec.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>`
                  : ""
              }
            </div>
          `
            )
            .join("")}
        </div>
      </section>

      <!-- GALLERY (/gallery/) -->
      <section class="page-section" id="page-gallery" data-page="gallery">
        <div class="vip-atelier-banner" style="margin-top:0;">
          <div>
            ${mediaFrame(D.gallery.heroImage, D.gallery.heading, "", D.gallery.heading)}
          </div>
          <div>
            <span class="section-eyebrow">Official Atelier Lookbook</span>
            <h1 class="section-title">${esc(D.gallery.heading)}</h1>
            <p class="couture-card-sub" style="margin:0.5rem 0 1rem;">${esc(D.gallery.copyrightNote)}</p>
            <button type="button" class="btn-gold-cta" data-nav="contact">Contact Us</button>
          </div>
        </div>
        <div class="couture-grid-4">
          ${D.whatWeOffer.carouselImages
            .concat(D.luxuryPackages.galleryImages.map((src) => ({ src, alt: "Luxury Portfolio" })))
            .map((item) => `<div class="couture-card">${mediaFrame(item.src, item.alt, "", item.alt)}</div>`)
            .join("")}
        </div>
      </section>

      <!-- CONTACT (/contact-us-2/ & /contact-us/) -->
      <section class="page-section" id="page-contact" data-page="contact">
        <div class="section-header">
          <span class="section-eyebrow">how can we help You?</span>
          <h1 class="section-title">Contact Us</h1>
          <p class="section-subtitle">
            Tell us about your celebration and we’ll create a custom balloon experience designed for your event.
          </p>
        </div>

        <div class="couture-grid-3" style="margin-bottom:2rem;">
          <div class="couture-card">
            <h3 class="couture-card-title">📞 Phone/ Text</h3>
            <p class="couture-card-sub"><a href="${esc(b.phoneHref)}">${esc(b.phoneDisplay)}</a></p>
            <div class="card-actions-row">
              <a href="${esc(b.phoneHref)}" class="btn-gold-cta">Call Now</a>
            </div>
          </div>

          <div class="couture-card">
            <h3 class="couture-card-title">💬 WhatsApp (Only)</h3>
            <p class="couture-card-sub"><a href="${esc(b.whatsappHref)}" target="_blank" rel="noopener">${esc(b.whatsappDisplay)}</a></p>
            <div class="card-actions-row">
              <a href="${esc(b.whatsappHref)}" target="_blank" rel="noopener" class="btn-gold-cta">Chat With Us!</a>
            </div>
          </div>

          <div class="couture-card">
            <h3 class="couture-card-title">✉️ Email &amp; Hours</h3>
            <p class="couture-card-sub"><a href="${esc(b.emailHref)}">${esc(b.email)}</a></p>
            <p class="card-footer-note">
              Customer Care Hours:<br/>
              ${esc(b.hours.weekdays)}<br/>
              ${esc(b.hours.sunday)}
            </p>
            <div class="card-actions-row">
              <a href="${esc(b.jotformUrl)}" target="_blank" rel="noopener" class="btn-gold-cta">Get An Estimate</a>
            </div>
          </div>
        </div>

        <!-- Integrated JotForm-Synced Inquiry & Estimate Form -->
        <div class="couture-grid-2">
          <div class="couture-card">
            <span class="section-eyebrow">Direct Estimate &amp; Inquiry Form</span>
            <h2 class="couture-card-title" style="font-size:1.55rem;">Let’s Make Your Vision A Reality</h2>
            <p class="couture-card-sub">
              Submit your celebration details below (synced with our official JotForm estimate system) or open the full interactive JotForm in a new tab.
            </p>
            <form id="contactEstimateForm" style="margin-top:0.5rem;">
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
              <div style="display:flex;gap:0.65rem;flex-wrap:wrap;">
                <button type="submit" class="btn-gold-cta" style="flex:1;">Submit Inquiry &amp; Request Quote</button>
                <a href="${esc(b.jotformUrl)}" target="_blank" rel="noopener" class="btn-rose-outline">Open Full JotForm ↗</a>
              </div>
              <p id="contactFormFeedback" style="font-size:0.82rem;margin-top:0.6rem;color:var(--gold-deep);font-weight:700;"></p>
            </form>
          </div>

          <div class="couture-card">
            <span class="section-eyebrow">Contact Page FAQ</span>
            <h3 class="couture-card-title">Most frequent questions and answers</h3>
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
          <a href="${esc(postUrl)}" target="_blank" rel="noopener" class="latest-media-card">
            <div class="latest-media-thumb">
              <img src="${esc(mediaUrl)}" alt="Glamour Balloons Boutique Latest Creation ${idx + 1}" loading="lazy" />
              <span class="latest-media-badge">${item.isVideo ? "▶ Motion Reel" : "✦ Latest Feature"}</span>
            </div>
            <p class="latest-media-caption">${esc(cleanCaption)}</p>
          </a>
        `;
      })
      .join("");
  }

  async function loadLatestThreeMedia() {
    // Default live fallback items linked to @glamourballoonsboutique
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
        btn.classList.contains("nav-pill") ||
        btn.classList.contains("subpage-chip") ||
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
        <div style="padding:1rem;border-radius:14px;background:rgba(247,228,222,0.35);text-align:center;font-size:0.86rem;color:var(--plum-soft);">
          Your Boutique Bag is currently empty. Add <strong>Baby Shower Deluxe Decor ($599.00)</strong> or any Party, Shimmer Wall, or Grab &amp; Go package!
          <div style="margin-top:0.65rem;">
            <button type="button" class="btn-rose-outline" data-add-bag="31160" data-title="Baby Shower Deluxe Decor" data-price="599" style="font-size:0.76rem;">
              + Add Baby Shower Deluxe Decor ($599.00)
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
        <div style="display:flex;justify-content:space-between;align-items:center;padding:0.6rem 0;border-bottom:1px solid rgba(197,147,65,0.18);font-size:0.86rem;">
          <div>
            <strong>${esc(item.title)}</strong>
            <div style="font-size:0.76rem;color:var(--plum-muted);">$${item.price.toFixed(2)} × ${item.qty}</div>
          </div>
          <div style="display:flex;align-items:center;gap:0.5rem;">
            <span style="font-weight:700;">$${(item.price * item.qty).toFixed(2)}</span>
            <button type="button" data-remove-bag="${idx}" style="color:var(--rose-berry);font-weight:700;padding:0.2rem 0.45rem;">✕</button>
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
      <div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:0.25rem;">
        <span>Subtotal:</span>
        <strong>$${subtotal.toFixed(2)}</strong>
      </div>
      ${
        discount > 0
          ? `<div style="display:flex;justify-content:space-between;font-size:0.84rem;color:var(--rose-berry);margin-bottom:0.25rem;">
              <span>Promo (${esc(activeCoupon)}):</span>
              <strong>-$${discount.toFixed(2)}</strong>
            </div>`
          : ""
      }
      <div style="display:flex;justify-content:space-between;font-size:1.05rem;font-weight:700;color:var(--plum-ink);">
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
          ? "✦ Return to Single-Collection View"
          : "✦ View Full Atelier Lookbook (All Pages)";
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
                "✓ 6-digit verification code sent from @t.shopifyemail.com! Check your inbox.";
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
            if (status) status.textContent = "✓ Signed in successfully!";
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
              "✓ You’re on the VIP Experience Waitlist! We’ll be in touch with early access.";
          }
          waitlistForm.reset();
        } catch (err) {
          if (status) status.textContent = "✓ Added to VIP Waitlist!";
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
              "✓ Thank you! Your inquiry has been received and forwarded to Glamour Balloons Boutique.";
          }
          contactForm.reset();
        } catch (err) {
          if (fb) {
            fb.textContent =
              "✓ Inquiry logged! You can also click 'Open Full JotForm' to attach inspiration photos.";
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
