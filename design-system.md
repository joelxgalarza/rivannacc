# Rivanna Home Cleaning — Design System LOCK v1.1

**Status: PENDING APPROVAL.** Nothing below changes without a version bump.
v1.1 (2026-09-21): rebranded to match `assets/images/rivanna-logo.svg` —
deep teal / aqua replaces the v1.0 brick-red palette throughout.
Once approved, every page (home, 12 service pages, 29 area pages, any future
combos) is regenerated against this file. No page may introduce a color,
typeface, spacing value, radius, shadow, or component treatment not defined
here. No page may re-decide these choices locally.

## 0. Where this system comes from

The palette is pulled from the brand mark itself (`assets/images/
rivanna-logo.svg`: deep teal #184D59, aqua #9CCEC9, ice #F7FBFA), the type
pairs a sturdy slab display face with a plain readable body face, and the
layout language is editorial (sharp edges, borders, hard offset shadows,
asymmetric sections). Nothing here is chosen because it "reads as
trustworthy" in the abstract.

## 1. Color tokens (exact, functional names)

```css
:root {
  --color-action: #184D59;        /* logo deep teal: buttons, links, key headings accents */
  --color-action-dark: #0F3641;   /* hover / active states for action elements */
  --color-text: #1E2E33;          /* cool charcoal: body text, footer background */
  --color-text-muted: #4E6267;    /* secondary text on light surfaces only */
  --color-surface: #FFFFFF;
  --color-surface-alt: #EDF4F3;   /* aqua tint: tint bands, callouts */
  --color-border: #CBDCDC;        /* cool light border */
  --color-ridge: #237080;         /* mid teal: eyebrows + small-caps labels ONLY */
  --color-feedback-success: #2E7D4F; /* form confirmations ONLY, never brand/decoration */
}
```

Contrast (white background): action ≈ 9.4:1, action-dark higher, text ≈ 14:1,
muted ≈ 6.4:1, ridge ≈ 5.7:1. All pass 4.5:1 for text. Button text is always
surface on action/action-dark.

BANNED: brick-red/rust primaries, amber/gold/orange accents,
purple/indigo gradients, pure black `#000`, and any hex/rgb appearing
outside these tokens. Inline `style=""` may set layout (widths) only,
never color.

Pre-launch scaffolding (phone/email/hours `[TBD]` markers, dashed award
slot) keeps its current dashed treatment, tokenized during implementation
as `--color-scaffold-*`, and is deleted at launch. These are known owner
content gaps, not template artifacts.

Focus indicator (no new token): 3px solid `var(--color-action-dark)` with
2px offset on `:focus-visible`, everywhere, no exceptions.

## 2. Typography (locked pairing)

- Display/headlines: **Bitter** (Google Fonts, weights 600;700;800).
  H1 800, H2/H3 700. Sturdy slab serif: reads local-trades, not template.
- Body/UI: **Public Sans** 400/500/600/700 at 19px/1.65. High x-height,
  plain, readable at every age.
- No third family. No italic body copy. Bold is for single facts and
  labels, never whole sentences. One H1 per page, heading order intact.

This pairing already satisfies the lock's type constraint (distinct
display face + plain body face; not Inter/Roboto/geometric-default), so
v1.0 keeps it instead of churning fonts a second time unseen.

## 3. Spacing scale

`--space-xs: 0.5rem; --space-sm: 1rem; --space-md: 1.75rem; --space-lg: 3rem;
--space-xl: 4.5rem; --space-xxl: 7rem;`

Sections alternate `xl`/`xxl` vertical padding; the hero uses `xxl` top.
No two adjacent sections share identical padding.

## 4. Radius and shadow (varied by component, fixed per component)

- Buttons, inputs, chips, nav dropdown: `--radius-sm: 6px` (tap-friendly,
  older users).
- Cards, images, panels, callouts, quote bands: `--radius-none: 0` with
  1px `var(--color-border)` and a hard offset shadow.
- `--shadow-hard: 6px 6px 0 var(--color-border)` (default card/image).
- `--shadow-hard-accent: 6px 6px 0 var(--color-action)` (rare: hero
  feature card and final CTA band only).
- Overlays (nav dropdown, sticky mobile bar): one small soft shadow
  `0 12px 28px rgba(30,46,51,.14)` — functional exception, documented here.
- Reviewer avatar initials stay circular (identity, not decoration) —
  explicit exception.

BANNED: one radius everywhere, pill buttons, gradient shadows,
left-border accent cards (callouts use the top-border motif instead).

## 5. Icons (information only)

No circle-badge icon grids, no decorative icon rows. Allowed: checklist
checks (scope lists), chevrons (disclosure controls), footer contact
glyphs, social glyphs (standard). Max one icon set per section. Any icon
that restates adjacent text gets cut, not restyled.

## 6. Section patterns (compose pages ONLY from these)

- P1 Split hero (home, service pages): left eyebrow + H1 + lede + CTA
  row + trust strip; right image bleeding to the viewport edge.
- P2 Compact centered hero (area pages ONLY): breadcrumbs, H1, lede,
  CTA row, trust strip. Differentiated by template, identical within it.
- P3 Editorial split: 7/5 columns, text + image, alternating sides.
- P4 Tint band: full-bleed `surface-alt`, left-aligned content.
- P5 Sticky-rail FAQ: H2 pinned left, accordion right (asymmetric).
- P6 Numbered editorial list: services/features as large numerals +
  rule lines, left aligned (replaces card grids and chip piles where
  the list carries meaning; the A–Z area index keeps its card).
- P7 CTA band: full-bleed tint, left H2 + copy, right stacked buttons.
  Never centered, never a gradient.

At least half the sections on every page must be asymmetric (P1, P3,
P5, P7 qualify).

## 7. Trust claims and copy (hard rules)

Each trust claim is stated EXACTLY ONCE per page, in the trust strip,
strongest form: Locally owned and operated / Insured and bonded /
Background-checked cleaners / Free re-clean reported within 24 hours.
Body, FAQ, and CTA copy must not restate any of the four — with one
deliberate exception: the "what if something's missed" FAQ answer states
the remedy, because there it IS the answer, not repetition.

Specifics over adjectives, bound by the business's locked rules (these
override any generic template examples): the quote flow is form-then-
phone-quote and quotes are estimates adjustable after walkthrough (per
the live Terms page) — NEVER a "flat quote in 60 minutes" or any
response-time promise. Pricing numbers, percentages, multipliers, and
offer terms stay internal and are NEVER published. Allowed specifics:
the 24-hour re-clean remedy, first visit runs deeper, regular visits
cost less per clean (qualitative only), background-checked / insured /
bonded status, and the verifiable counts (12 services, 29 areas).

BANNED claims: years in business, customer counts, review counts or
ratings, awards not earned, owner-attribution claims, any SLA. BANNED
constructions: mirrored taglines ("X for X", "Built in A, for A"),
adjective stacking ("fast, friendly, reliable"), and every pattern in
the project's humanize-text spec (11 patterns) and direct-response
7-check audit, which all copy must pass before any page ships.

## 8. QA gates (every page, before done)

1. Token audit: every rendered color traces to Section 1; no new hex.
2. Template-artifact grep: phone/email/Booking-Koala placeholders
   consistent (exactly `(555) 000-0000` + `[TBD]` until the real number
   lands); no lorem/filler; no "Tier", drive minutes, or response-time
   claims; no wrong-template bleed (Connecticut, Ridgefield, Danbury,
   masonry, M&M).
3. Consistency: same tokens, type, spacing, components on home + all
   service + all area pages; nav/footer byte-identical.
4. Accessibility: contrast ratios hold, focus visible, tap targets
   44px+, one H1, heading order, accordion contract (aria-controls
   matches ids, script loaded).
5. Weight: images WebP ≤200KB each; two font families max.

## 9. Regen execution plan (runs ONLY after approval)

- Pass 1: rewrite `:root` + components CSS to this spec.
- Pass 2: regenerate home.
- Pass 3: regenerate 12 service pages (parallel batches + QA).
- Pass 4: regenerate 29 area pages (parallel batches + QA).
- Pass 5: cross-page QA (gates 1–5) + report.

Out of scope for regen (stays as-is): URLs, nav structure and
dropdown behavior, footer content, FAQ accordion behavior, the
contact/quote flow, Booking Koala TBDs. The 2 drafted service+area
variants can be built as live pages inside Pass 4 if approved.

## 10. Decisions locked at approval

Approving this file locks: the teal/aqua palette (matched to the logo);
Bitter + Public Sans; the 7 section patterns; the trust-once rule with its
single FAQ exception; the business-rule overrides in Section 7; and
the regen scope in Section 9.
