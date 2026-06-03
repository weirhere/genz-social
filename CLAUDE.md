# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

"Loop" — a concept/portfolio project: a Gen Z news-app prototype plus the research and concept writeups behind it (a Fortune 100 media-brand assignment). The deployed site serves a **landing/case-study page at `/`** and the **interactive prototype at `/prototype`**. There is no backend — all content is mock data and all interaction state is in-memory.

The narrative artifacts are first-class deliverables, not docs: [01_research_brief.md](01_research_brief.md), [02_concept.md](02_concept.md), [03_usability_findings.md](03_usability_findings.md). Read [02_concept.md](02_concept.md) for the product rationale (the "Daily Loop", "Margin", "Loops" bets) that the UI is meant to embody.

## Commands

Package manager is **pnpm**.

- `pnpm dev` — Vite dev server at http://localhost:5173
- `pnpm build` — `tsc -b` (type-check) then `vite build`. This is the only check; **there are no tests, no linter, and no test runner configured.** Run `pnpm build` to validate changes.
- `pnpm preview` — serve the production build

## Architecture

**Stack:** Vite · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui (new-york) · Motion (`motion/react`) · Lucide · React Router v7. Path alias `@/*` → `./src/*` (defined in both [tsconfig.json](tsconfig.json) and [vite.config.ts](vite.config.ts)).

**Routing** ([src/App.tsx](src/App.tsx)) — `BrowserRouter` with `/` → `Landing`, `/prototype` → `Prototype`, `*` → `Landing`. [vercel.json](vercel.json) provides the SPA rewrite so deep links work in production. Providers wrap everything: `AppStateProvider` › `LoomPlayerProvider`. `<Agentation />` (visual feedback toolbar) renders only in DEV.

**Global state** ([src/state/AppState.tsx](src/state/AppState.tsx)) — a single React context (`useAppState()`) holds *all* prototype interaction state: read/bookmark/follow sets, the mutable `loops` + `loopChat`, interests/mutes, settings, and a toast queue. It is **in-memory only by design** — reloads reset to seed data. When adding a new interactive affordance, extend this context rather than introducing local state or new stores. Note many state pieces are `Set<string>` of content IDs; mutations always copy-on-write.

**The prototype shell** ([src/pages/Prototype.tsx](src/pages/Prototype.tsx)) — this is a fake phone, not real navigation. A local `view` discriminated union (`{kind:"tab"} | {kind:"story"}`) drives which screen renders inside `<PhoneShell>`; `AnimatePresence` cross-fades between them. There is no router below `/prototype`. Tabs are `today | discover | loops | me` ([BottomNav](src/components/shell/BottomNav.tsx)). On desktop (≥1024px) a `LoomSidecar` shows alongside the phone; below that, Looms fall back to a draggable PiP player ([src/components/LoomPlayer.tsx](src/components/LoomPlayer.tsx)).

**Component layers** under [src/components/](src/components/):
- `screens/` — the five prototype screens (Today, Story, Discover, Loops, Me, Margin)
- `shell/` — PhoneShell, StatusBar, BottomNav (the device chrome)
- `ui/` — shadcn-style primitives (button, Sheet, ActionMenu, Toast)

**Content** lives in [src/data/content.ts](src/data/content.ts) as typed mock data (`today` stories, `voices`, `topics`, `blindspots`, `loops`, `loopChat`, etc.) and [src/data/looms.ts](src/data/looms.ts) for the walkthrough videos. Seed `loops`/`loopChat` are the initial value the AppState context clones and then mutates.

## Design system

Tokens are defined as CSS variables at the top of [src/index.css](src/index.css) and consumed via Tailwind utility classes (`bg-paper`, `text-ink`, `bg-signal`, etc.) — **use these tokens, not raw hex/oklch.** The palette is Paper (warm cream) + Ink (blue-black) + Signal (violet) / Ember / Sage, plus a `--lean-*` political-spectrum scale for source chips. Dark mode tokens exist but the app ships light-first. Shared motion constants (springs, easing, stagger) live in [src/lib/motion.ts](src/lib/motion.ts) — reuse them for consistent animation. The canonical design system is also published in Figma (linked from [README.md](README.md)).
