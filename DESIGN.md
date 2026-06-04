# Nekter Event — Design Tokens & Direction

## Status

The current site (v1, deployed) uses a dark-navy + purple-gradient palette that
tested poorly against Spencer's anti-references ("AI slop"). This DESIGN.md
captures both **(a)** what's currently live so we can avoid breaking it during
redesign and **(b)** the direction we're moving toward (informed by the cook.ai
reference and impeccable's design laws).

## Color strategy

Per impeccable's commitment axis: target **Committed** — one saturated color
carries 30-60% of the surface, paired with tinted neutrals.

The redesign moves AWAY from the current navy+purple combo. Forbidden:
- Anything `#000000` or `#ffffff` (use tinted neutrals via OKLCH)
- The current `#0a0a1a` navy and `#6C47FF→#A78BFA` purple gradient (AI slop)
- Gradient-on-text (impeccable absolute ban)

**Proposed v2 palette (anti-slop, Committed strategy):**

| Role | OKLCH | Hex approx | Use |
|---|---|---|---|
| Surface (near-black, warm-tinted) | `oklch(0.16 0.01 60)` | `#1A1714` | Page background — warm dark, not blue-dark |
| Surface-2 (slightly lifted) | `oklch(0.20 0.01 60)` | `#252118` | Card backgrounds when needed |
| Ink (primary text) | `oklch(0.97 0.005 60)` | `#FAF6F0` | Body + headings on dark — warm off-white, not pure |
| Ink-muted | `oklch(0.72 0.01 60)` | `#B4ABA0` | Secondary text |
| Accent (committed) | `oklch(0.72 0.18 55)` | `#F08A52` | Single saturated accent — warm amber/coral, not purple, not teal, not navy |
| Accent-dim | `oklch(0.72 0.18 55 / 0.18)` | — | Pills, callouts, subtle background washes |
| Highlight (emphasis phrase) | `oklch(0.85 0.17 90)` | `#F5D078` | Used only on the ONE highlighted phrase per page (like cook.ai's teal-on-headline trick) |

Why warm amber/coral as the committed accent:
- **Anti-AI-slop**: every AI tool company uses cool palettes (purple, teal, blue, mint). Warm is the deliberate outlier.
- **Operator energy**: matches the brand voice — warm, direct, lived-in.
- **No collision with tool brands**: doesn't ape Anthropic (cream/coral *adjacent* but stronger saturation), OpenAI (green), Higgsfield (magenta), Google (multicolor).

Color strategy commit: warm dark surface + ink + one amber accent. No purple
remains in v2. Nekter purple stays only in the existing logo file, which is
small enough that brand recognition isn't compromised.

## Typography

Editorial direction. Pair a high-personality serif for headlines with a clean
sans for body.

| Role | Family | Weight | Use |
|---|---|---|---|
| Headline serif | **Tiempos Headline** OR fallback `Georgia` italic 700 | 700 | Top of hero, chapter titles, the one highlighted phrase |
| Body sans | **Inter** | 400, 600, 800 | All body, eyebrow labels, CTAs |
| Mono | **JetBrains Mono** OR `Consolas` | 400 | Prompts, code snippets, attribute callouts |

Hierarchy ratio: ≥1.5 between steps. Body 16px → small heading 24px → section
26-32px → hero 56-80px.

Italic serif for the ONE highlighted phrase only (e.g. "*$10k–$50k*"). Never
italicize body copy decoratively.

## Spacing

8px base. Section vertical rhythm: `py-24` (96px) for content sections,
`py-32` (128px) at chapter breaks. Margins between adjacent text blocks: `mb-6`
(24px). Cap body line length 65-75ch (impeccable shared law).

## Motion

- Ease-out-quart on enter animations
- Sticky countdown banner: hard appear, no slide-down
- Section reveals (existing `IntersectionObserver` pattern): keep `cubic-bezier(0.16,1,0.3,1)`
- No layout-property animations (impeccable shared law)

## Layout

- One container width: 1120px max, 28px gutter, scales down at 720px
- VSL hero: video centered, 16:9 max-width ~860px on desktop
- Long-form chapter copy: single column max-width 720px, left-aligned
- Forbidden: identical card grids repeated (rewrite v2 to avoid the "tools grid + features grid + speakers grid" rhythm)

## Components currently in production (preserve / migrate)

These need to survive the v2 redesign:

| Component | Status | Notes |
|---|---|---|
| Sticky CTA (desktop bottom-right) | Keep | Already works |
| Floating mobile CTA | Keep | Already works |
| Custom registration form modal | Keep behavior, restyle | All form fields wired to CRM intake — do not touch the schema |
| Tier banner (VIP toggle inside form) | Keep behavior, restyle | Drives VIP vs Free flow |
| Stripe VIP redirect | Keep wiring | URL: `buy.stripe.com/5kQ7sEb1SgH25of7nC5c400` |
| Confirmation email template (`api/_email.js`) | Untouched | Server-side, separate concern |
| `NEXT_SESSION` config block | Keep, extend if needed | Already supports date-only / time-TBA |

## Components to RETIRE in v2

| Component | Reason |
|---|---|
| Hero curriculum progress card (auto-cycling checklist on the right) | Decorative, distracts from the VSL we want to put there |
| Hero aurora orbs + shape rings | "Look at the cool ambient" — AI slop |
| Big tool-cards grid + "What every webinar covers" grid + speaker grid | Three identical card grids in sequence is monotonous (impeccable shared law) — collapse to chapter copy |
| Replays empty state placeholder | Replays section can collapse until we have one |

## Components to INTRODUCE in v2

| Component | Purpose |
|---|---|
| Sticky countdown banner (top, full-width) | Date + countdown + persistent "Register" CTA, like cook.ai |
| VSL hero (Vimeo or similar) | Replaces the curriculum card. Autoplay muted, click-to-unmute |
| Chapter-structured long-form copy | "PART I · THE PROBLEM" etc. Replaces three card grids. |
| Authority anchor block | One pull-quote with citation, like cook.ai's Sequoia callout |
| Fit-check block | "THIS IS FOR YOU IF / NOT FOR YOU IF" two-column |

## Accessibility minimum

- Color contrast AA on body text (`#FAF6F0` on `#1A1714` = ~16:1, passes)
- Hit targets 44×44 on mobile CTAs
- Reduced-motion: existing `@media (prefers-reduced-motion: reduce)` honors curriculum pause; keep
- Form fields: ARIA labels already present, do not remove
