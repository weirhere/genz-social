---
version: alpha
name: Loop
description: Editorial calm for a Gen Z news ritual — warm paper, deep ink, an electric signal
colors:
  paper: "oklch(0.95 0.018 80)"
  paper-2: "oklch(0.97 0.012 80)"
  paper-3: "oklch(0.92 0.022 80)"
  ink: "oklch(0.16 0.025 270)"
  ink-2: "oklch(0.32 0.020 270)"
  ink-3: "oklch(0.52 0.015 270)"
  signal: "oklch(0.62 0.22 295)"
  signal-soft: "oklch(0.92 0.05 295)"
  ember: "oklch(0.69 0.20 35)"
  ember-soft: "oklch(0.94 0.045 35)"
  sage: "oklch(0.78 0.07 145)"
  sage-soft: "oklch(0.93 0.04 145)"
  lean-left: "#3B82F6"
  lean-center-left: "#6E47FF"
  lean-center: "#9BB89F"
  lean-center-right: "#FFB152"
  lean-right: "#FF5C2E"
  lean-independent: "#9CA3AF"
typography:
  display:
    fontFamily: Bricolage Grotesque
    fontSize: 2rem
    fontWeight: 600
    letterSpacing: -0.02em
  body:
    fontFamily: Geist
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5
  label-caps:
    fontFamily: Geist
    fontSize: 0.625rem
    fontWeight: 500
    letterSpacing: 0.2em
  mono:
    fontFamily: Geist Mono
    fontSize: 0.75rem
rounded:
  sm: 0.5rem
  md: 0.75rem
  lg: 1rem
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.md}"
    padding: 8px 16px
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.ink-2}"
    rounded: "{rounded.full}"
  chip:
    backgroundColor: "{colors.paper-2}"
    textColor: "{colors.ink-2}"
    rounded: "{rounded.full}"
    border: "{colors.paper-3}"
---

## Overview

Loop is a finite, ritual-based news experience for 18–26-year-olds — built to *close the loop* rather than open another tab. The visual language has to read as calm and trustworthy where the category reads as anxious and infinite: editorial, warm, and deliberately bounded.

The aesthetic is **architectural minimalism with a consumer-tech pulse**. A warm cream "paper" ground and a deep blue-black "ink" carry the long-read seriousness; a single electric-violet "signal" supplies the energy a Gen Z product needs without tipping into noise. The product ships **light-first** — dark mode tokens exist but are secondary. Everything is presented inside a 390×844 iPhone-class phone shell.

## Colors

Three families, each with a purpose:

- **Paper** (`paper`, `paper-2`, `paper-3`) — the warm cream background system. `paper` is the canvas, `paper-2` lifts cards a step toward the viewer, `paper-3` is dividers and muted fills.
- **Ink** (`ink`, `ink-2`, `ink-3`) — a near-black with a blue cast, used as a three-step text hierarchy: `ink` for primary copy and dark surfaces, `ink-2` for secondary, `ink-3` for tertiary/muted.
- **Accents** — `signal` (electric violet) is the single brand accent for interactive emphasis and the active state; `ember` (hot orange) and `sage` (soft green) are supporting category accents. Each accent has a `-soft` tint for backgrounds.

The **`lean-*` scale** is a separate, intentional spectrum — left → independent — used only by the source/perspective UI (PerspectiveChip, SourceRail). It is defined in fixed hex (not oklch) so it survives theming unchanged and is never reused for general accenting.

Use tokens, never raw color values, in components. Brand tokens are also mapped onto the shadcn token set (`--background`, `--primary`, `--accent`, etc.) so primitives inherit the palette automatically.

## Typography

- **Display** — Bricolage Grotesque, tight tracking, used for headings and the "Loop" wordmark. Carries the editorial voice.
- **Body / UI** — Geist, the workhorse for all running text and interface labels.
- **Mono** — Geist Mono, reserved for metadata, counts, and the device legend (e.g. `390×844`).
- **Label-caps** — small, wide-tracked, uppercase Geist for eyebrow labels and section kickers.

Scale rationale: one expressive display face against one neutral, highly legible UI face keeps screens feeling like a publication rather than an app dashboard. Reserve display weight for genuine headlines — overusing it flattens the hierarchy.

## Layout

Spacing follows a 4 / 8 / 16 / 24 / 32 px rhythm (`xs`–`xl`), aligned to Tailwind's default scale. The prototype lives inside a fixed phone shell, so layouts are single-column and vertically rhythmic; breathing room between sections matters more than dense information.

Responsive behavior pivots at the Tailwind `lg` breakpoint (1024px): at/above it the desktop chrome and a Loom video sidecar flank the phone; below it the phone owns the canvas and Looms fall back to a draggable picture-in-picture player.

## Elevation & Depth

Depth is expressed through **value, not heavy shadow**. Cards step forward by moving from `paper` to the lighter `paper-2`; separation comes from subtle `paper-3` borders and hairline rings rather than drop shadows. Interactive primitives use only the lightest shadow (`shadow-xs`). The overall feel is matte and printed, not glossy or material-elevated.

## Shapes

Generously rounded. The base radius is **1rem** (`--radius`), giving cards and surfaces a soft, friendly silhouette. Pills and chips are fully rounded (`full`); smaller controls and buttons step down to `md`/`sm`. Avoid sharp corners — they read as system/utility, against the warm editorial tone.

## Components

- **Button** ([src/components/ui/button.tsx](src/components/ui/button.tsx)) — shadcn `cva` variants. `default` is ink-on-paper (`button-primary`); `ghost`/`link` are low-emphasis; `secondary` uses `paper-3`. Sizes `sm`/`default`/`lg`/`icon`.
- **Chip / PerspectiveChip** — fully-rounded `paper-2` pills with a `paper-3` ring; the perspective variant tints by the `lean-*` scale.
- **Phone shell** ([src/components/shell/](src/components/shell/)) — PhoneShell + StatusBar + BottomNav form the device chrome that wraps every prototype screen.
- **BottomNav** — four tabs (Today, Discover, Loops, Me); the active tab is marked with a `signal`/ink pill via a shared Motion `layoutId` for the sliding indicator.
- **Toast / Sheet / ActionMenu** ([src/components/ui/](src/components/ui/)) — transient feedback and bottom-sheet menus, paper-surfaced.

New components should compose existing tokens and the `cn()` helper rather than introduce new color or radius values. Motion constants (springs, easing, stagger) live in [src/lib/motion.ts](src/lib/motion.ts) — reuse them so animation feels consistent across screens.

## Do's and Don'ts

**Do**
- Reach for `signal` as the single accent of emphasis; let it stay rare so it keeps its charge.
- Keep screens bounded and finite — the product's whole thesis is "you're caught up," so resist endless-feed patterns.
- Express elevation with paper-value steps and hairline borders.
- Use the `lean-*` scale *only* for source-perspective UI.

**Don't**
- Don't hardcode hex/oklch in components — always go through tokens (brand or the mapped shadcn vars).
- Don't introduce new radii or shadows; use `--radius` and `shadow-xs`.
- Don't let display type sprawl — it's for headlines, not body or labels.
- Don't optimize for engagement-maximizing density or infinite scroll; that contradicts the brand.
