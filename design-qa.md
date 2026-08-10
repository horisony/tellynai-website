# Tellyn Product Page — Design QA

- Source visual truth: `/Users/baoling/Desktop/Tellyn1-2.png` (primary content and art-direction reference), supported by `/Users/baoling/Desktop/Tellyn1-1.png`.
- Implementation: `http://localhost:4173/tellyn`
- Desktop evidence: `/Users/baoling/Documents/tellyn-website/tellyn-implementation-desktop.png`
- Mobile evidence: `/Users/baoling/Documents/tellyn-website/tellyn-implementation-mobile.png`
- Desktop viewport / capture: 1440 × 1000 CSS px, device scale factor 1, 1440 × 1000 px screenshot.
- Mobile viewport / capture: 390 × 844 CSS px, device scale factor 1, 390 × 844 px screenshot.
- Source dimensions: 1055 × 1491 px. The source is a poster-style content reference rather than a same-viewport webpage comp, so comparison is normalized by visual language, hierarchy, section anatomy, and content rather than pixel position.
- State: English, default page state. Chinese and Arabic content were also checked; Arabic rendered RTL without horizontal overflow.

## Findings

No actionable P0, P1, or P2 differences remain.

- Fonts and typography: heavy grotesk display hierarchy, compact supporting copy, yellow underline emphasis, and clear card headings preserve the source's character. The responsive hero wraps cleanly at 390 px.
- Spacing and layout rhythm: desktop uses a two-column hero and three-column industry story; mobile collapses to one column with no horizontal page overflow. Section spacing replaces divider lines, consistent with the site's durable design rules.
- Colors and visual tokens: warm off-white, black, restrained gray, and yellow emphasis match the reference. No grid-pattern backgrounds or major-section divider rules were introduced.
- Image quality and asset fidelity: the supplied Tellyn mark, existing hand-drawn team illustration, and real Tellyn dashboard image are sharp and correctly scaled. No placeholder illustrations or custom CSS/SVG drawings were used.
- Copy and content: healthcare, automotive, and real-estate stories each explain the sales situation, why information gets lost, and the concrete follow-up value. Claims remain evidence-led and avoid unverified ROI, pricing, or delivery-time figures.

## Interaction and responsive evidence

- Homepage “Explore/Learn about Tellyn” entry navigates to `/tellyn`.
- “Book a product demo” scrolls to `#contact`.
- Language selector works for Chinese, English, and Arabic; Arabic switches the document to RTL.
- Desktop and 390 px mobile layouts have no horizontal document overflow.
- Browser console checked after the final reload: no new errors.

## Comparison history

1. Initial mobile pass found the hero grid's intrinsic width could clip long English display copy. Added `min-width: 0`, constrained the promise strip, and enabled safe display-text wrapping.
2. Post-fix evidence at 390 × 844 shows the full heading inside a 354 px content width with document `scrollWidth === innerWidth`.
3. The localization tree initially emitted React key warnings. Localized array children now receive stable fallback keys; the final browser pass produced no new console errors.

## Focused region comparison

The hero and industry-card regions were compared because they carry the primary fidelity burden: logo lockup, bold headline, yellow emphasis, black-and-white illustration, rounded cards, and healthcare / automotive / real-estate content. The implementation intentionally extends the poster reference into a complete conversion page with workflow, dashboard, trust, and contact sections.

## Follow-up polish

- P3: if dedicated industry illustrations become available, each industry card could gain its own black-and-white spot illustration, as in the source poster. The current cards prioritize specific, readable customer scenarios.

## Final result

final result: passed
