# Rivanna Home Cleaning Website

A static marketing website for Rivanna Home Cleaning (Charlottesville, VA), built per
`rivanna-website-plan.md`. No build step required. Open the pages in a browser or deploy
the folder as-is to any static host.

**Local testing note:** the review carousel and reviews page fetch `data/reviews.json` with
`fetch()`, which most browsers block under the `file://` protocol (CORS). To test locally,
serve the folder over HTTP, e.g.:

```
cd rivanna-site
python3 -m http.server 8000
# then visit http://localhost:8000/
```

## File structure

```
rivanna-site/
  index.html              Home
  services.html            All 12 services (overview + anchored detail sections)
  service-areas.html       Full service-area list + map
  about.html                Company story, values, team, guarantee
  reviews.html               Full reviews grid
  contact.html               Quote form + contact details + Booking Koala embed slot
  assets/
    css/styles.css           Hand-written, mobile-first stylesheet (brand palette)
    js/carousel.js            Home page review carousel controller
    js/faq.js                 FAQ accordion toggle logic
    images/                   (reserved for locally-hosted images, see note below)
  data/
    reviews.json              6 real customer review objects
  images.json                 Maps image keys to their (currently hotlinked) URLs + alt text
  areas/                      29 individual service-area advertorial/SEO pages (one per
                              neighborhood/town in service-areas.html), each with unique
                              local copy, a local FAQ, featured services, and its own CTA
  services/                   12 individual service detail pages (one per service on the
                              services.html hub), each with full copy, FAQs, related
                              services, and area links
  README.md                   This file
```

## Design refresh & navigation fix (see git history / build notes)

- Replaced the `<details>/<summary>` mobile nav disclosure (which relied on
  `display: contents` and rendered inconsistently, most notably failing to show a usable
  navbar in some browsers) with a plain `<button class="nav-toggle">` + `<nav id="primary-nav">`
  pattern driven by `assets/js/nav.js`. This is now the only mobile-nav mechanism on every page.
- The bigger type scale (see below) initially made the desktop nav wider than the page
  container, causing it to wrap onto a second row on many screen widths. Fixed by hiding
  the redundant phone-number subtitle in the header's "Call Now" button (the number is
  already shown in the top bar), tightening nav spacing slightly, and raising the
  breakpoint where the full inline nav appears from 900px to 1180px (matching the site's
  container width) so the hamburger menu is used until there's guaranteed room.
- Added a serif display font (Fraunces, paired with the existing Inter body font), reduced
  the border-radius scale, and de-pill-ified buttons, eyebrow labels, trust badges, and area
  chips to move away from generic AI-generated-site visual patterns.
- Service-area names on the homepage and `service-areas.html` are now links to their
  individual `areas/<slug>.html` pages instead of plain text chips.
- Service areas are a single A-to-Z list (no tiers, no drive-time claims). The navbar
  carries hover dropdowns (tap-to-expand on mobile) listing all 12 services and all
  29 service areas.

## Individual service-area pages (`areas/`)

Modeled on the advertorial/local-SEO pattern (distinct per-location copy, local FAQ,
location-specific CTA). One page per neighborhood/town listed in `service-areas.html`
(29 total, including a Charlottesville city page). Each page includes:
- A unique, geographically accurate description (not generic filler) sourced from real
  local landmarks and neighborhood character.
- A "Services {Area} Customers Book Most" list, ordered to reflect what's actually likely
  to be requested in that area (e.g. move-in cleans for new-construction Crozet/Rivanna
  Village, commercial/office cleaning for the Zion Crossroads corridor, premium recurring
  service for Glenmore/Keswick estates).
- A short local FAQ (2 questions) and a "nearby areas we serve" cross-link block.

Before launch:
- [ ] Add a `sitemap.xml` covering all pages, including the 29 area and 12 service pages, and a
      `robots.txt` pointing to it. Neither exists yet.
- [ ] Consider Service/LocalBusiness structured data per area page once real contact
      details are finalized (not added yet).

## Launch checklist: everything marked TBD/placeholder

Search the codebase for `TBD`, `TODO`, and `placeholder` to find every instance. The main
items to resolve before going live:

### 1. Contact information
- [ ] Real phone number: currently `(555) 000-0000 [TBD]` in the top bar, header nav,
      footer (all pages), contact page, and the mobile sticky CTA bar `tel:` links.
- [ ] Real email address: currently `info@rivannahomecleaning.com [TBD]` (this is a
      placeholder address, not a live inbox) in the top bar, footer, and contact page.
- [ ] Business address / service radius disclosure: currently unset. `contact.html` and
      the footer say "Charlottesville, VA [Exact address TBD]." Decide whether to publish a
      street address or keep it general before launch.
- [ ] Business hours: currently `Mon–Fri, 8am–6pm [Hours TBD]` (top bar) / "Hours TBD"
      (footer, contact page). Confirm actual hours.
- [ ] Social links: Facebook, Instagram, and Google Business Profile icons in the footer
      currently link to `#` placeholders with `[TBD]` in their `aria-label`.

### 2. Booking Koala integration
- [ ] Supply the real Booking Koala hosted booking URL: currently `#booking-koala-url-tbd`
      everywhere ("Book Now" in the top bar, header, footer, and mobile CTA bar).
- [ ] Decide on embed method: Booking Koala's embeddable lead-capture/quote widget
      `<script>` snippet, or an `<iframe>` of the hosted booking flow.
- [ ] Wire up the quote forms: look for `<!-- BOOKING KOALA EMBED GOES HERE -->` in
      `contact.html` (primary quote form) and the matching TODO comment in `index.html`
      (hero quote form). Both currently just show a "thanks, not wired up yet" message on
      submit (see the inline `<script>` at the bottom of each page).

### 3. Reviews
- [x] `data/reviews.json` holds 6 real customer reviews. To add more, append
      objects to the JSON array and update the matching JSON-LD (see below).
- [x] `Review` / `AggregateRating` JSON-LD structured data is in the `<head>` of
      `index.html` and `reviews.html`. Keep it in sync with `data/reviews.json`:
      update `aggregateRating` and the `review` list whenever reviews change.
- [ ] Add `url` to the JSON-LD once the domain is live, plus `telephone` and
      `openingHours` once finalized (both still TBD — do not publish the
      placeholder phone number in structured data).

### 4. Awards / trust badges
- [ ] The trust badge row (Home page and elsewhere) includes an "Award pending: Quality
      Business Awards" badge with a dashed border, reserved for a real Quality Business
      Awards badge. Submit Rivanna at qualitybusinessawards.com/request-consideration, and
      once (if) approved, replace that badge with the real award artwork.
- [ ] Do not add any other award claims until Rivanna has actually received them.

### 5. Photography
- [ ] All current photos (hero, service cards, before/after, team portraits) are
      Higgsfield-generated placeholders, hotlinked from Higgsfield's CDN
      (`d8j0ntlcm91z4.cloudfront.net`) per `images.json`. For production, download these
      once and self-host them under `assets/images/` (swap the `src` values across the
      HTML files and in `images.json`) so the site doesn't depend on a third-party CDN
      staying available long-term.
- [ ] Team portraits (`about.html`) are explicitly labeled "Placeholder photo: replace
      with real team photo" in both the visible caption and the `alt` text. Replace with
      real staff photos once available (optional, placeholders can stay if preferred).
- [ ] No logo exists yet. The site currently uses a text wordmark ("Rivanna Home
      Cleaning"). Add a logo file and swap the `.logo` markup in the header/footer once one
      exists.

### 6. Domain & hosting
- [ ] Choose and connect a domain.
- [ ] Choose a static hosting target (Netlify, Vercel, GitHub Pages, S3 + CloudFront, etc.).
      No build step is required; the folder can be deployed as-is.

### 7. Policy pages
- [x] `privacy-policy.html` and `terms-of-service.html` are live at the site root and
      linked from every page footer (root pages link directly; the 29 `areas/` pages link
      via `../`). Content reflects what Joel described using: Meta/Facebook (ads, Pixel),
      GoHighLevel (CRM, appointment texts/emails), and Booking Koala (once live), plus a
      data-minimization statement ("we only use your info for what's necessary to run the
      business").
- [ ] **Have a Virginia-licensed attorney review both pages before launch.** These were
      drafted from what Joel described about the business, not by a lawyer, and are not a
      substitute for legal advice. Pay particular attention to the cancellation-fee and
      property-access clauses in Terms of Service (currently flagged `[TBD]`, since no
      specific fee amount was given) and to whether any additional disclosures are required
      once real ad tracking / CRM configuration is finalized.
- [ ] Update the "Last updated" date on both pages to the actual publish date at launch
      (currently a placeholder date, flagged inline on each page).

### 8. Cancellation policy detail
- [ ] The FAQ answer on cancellation policy (Home page) gives a general 24-hour-notice
      guideline and flags `[Exact policy/fee details TBD]`. Confirm the final policy wording.

## Notes on deliberate design decisions (per the build plan)

- **Reviews are real customer testimonials.** Each entry in
  `data/reviews.json` uses a first-name + last-initial format. New reviews can be
  appended to the JSON array with no template changes (see `assets/js/carousel.js`
  and the inline script in `reviews.html`).
- **Reviewer avatars are CSS initials bubbles**, not photos: a colored circle with the
  reviewer's first initial. No AI-generated face is ever presented as a specific person's
  photo.
- **Trust badges only claim what's true today**: Insured & Bonded, Locally Owned &
  Operated, 100% Satisfaction Guarantee, Background-Checked Staff, plus the reserved
  "Award pending" slot described above. No specific award is shown as already won.
- **Review/AggregateRating schema** is emitted in the `<head>` of `index.html` and
  `reviews.html`, matching the visible reviews (see Section 3 above). Keep it in
  sync with `data/reviews.json` when reviews change.
