# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

## Durable Design Decisions

- All public-facing brand and product copy uses the spelling “TellWin”; the public product route is `/tellwin`, while legacy `/tellyn` requests redirect to it. Technical identifiers, asset filenames, and email domains may remain unchanged for compatibility.
- The homepage hero uses a black-and-white hand-drawn team illustration, displayed without a surrounding card or frame.
- The company website positions Tellyn as an enterprise AI implementation partner, with a service journey of diagnosis, enterprise training, FDE co-delivery, and continuous iteration.
- Service copy should remain restrained and evidence-led: do not publish unverified ROI, delivery duration, or pricing figures.
- The homepage presents SnapDesign as a product module directly after Tellyn, focused on quickly generating editable e-commerce, event, and product posters.
- Do not use horizontal divider lines between major page sections; rely on spacing and background changes for separation.
- Do not use grid-pattern backgrounds anywhere on the website; separate sections with whitespace and solid background colors.
- The SnapDesign homepage module uses its YouTube product demo as an autoplaying, muted, looping embed with visible controls so visitors can enable sound.
- Do not include a standalone "WHY TELLYN" capability section on the homepage; transition directly from the product modules to FAQ.
- The homepage hero shows "核心团队来自" with company logos in this order: Tencent Cloud, NIO, ByteDance, Meituan; it replaces the previous text list of service categories below the hero CTAs.
- Core-team company logos are grayscale by default and restore their brand colors on hover.
- Do not expose a standalone `/cases` page; all case-study navigation should scroll to the homepage `SELECTED WORK` section.
- Do not show eyebrow/capsule labels such as "ENTERPRISE AI DELIVERY" or "WHAT WE DO" anywhere on the homepage.
- Do not include the five-step "一条跑得通、也能持续迭代的路径" delivery-method section on the homepage.
- The navigation includes a compact Chinese, English, and Arabic language switcher. Default language is inferred from visitor country when possible, manual choice persists locally, and Arabic uses RTL layout.
- The language switcher is plain text with a small globe icon on the left and chevron on the right; it has no pill shape, white background, border, or red focus outline.
- The entire language-switcher area—including the globe, current language, and chevron—is one clickable native-select target.
- All public website copy and repeatable page content must be maintained through one structured content configuration with complete Chinese, English, and Arabic variants; adding, removing, or reordering a section must not require editing translation logic or relying on DOM text replacement.
- Production builds must validate that every configured content key has Chinese, English, and Arabic values and fail clearly when a translation is missing.
- On the Tellyn product page, the emphasized “下一步行动” text in the dark problem statement section must remain white for legibility.
- Do not include the standalone “START WITH ONE REAL SCENARIO” CTA section on the Tellyn product page; transition directly from the proof section to the contact form.
- The Tellyn product-page hero uses the transparent black-and-white car-sales illustration stored at `/assets/tellyn-hero-sales.png`.
- On English pages, inline emphasized phrases must retain a visible word space before the `<em>` text; adjacent translated text must never render as joined words.
- The homepage places a clickable WeCom sales-analysis showcase immediately above the Tellyn product module, using `/assets/wecom-sales-assistant.webp` and linking to the dedicated experience page.
- The TellWin product page should tell a detailed dual-audience story for enterprise buyers and investors: customer pain, product architecture, cross-department value, target industries, timing, business model, differentiation, growth flywheel, paid validation, and product proof. Keep planned or extrapolated metrics clearly separated from verified facts.
- The public homepage product-section anchor is `#tellwin`; do not publish or link to the legacy `#tellyn` hash.
