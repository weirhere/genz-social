# Loop

**A Gen Z news app that closes the loop instead of opening another tab.**

_Fortune 100 media brand assignment. May 2026._

> Catch up. Not catch fire.

---

## TL;DR

Gen Z is exhausted, not disengaged. Loop is a finite, ritual-based news experience for 18–26-year-olds, with three monumental bets:

1. **The Daily Loop** — 7 stories, ends with a "you're caught up" moment. Anti-doomscroll by construction, not by content moderation.
2. **Margin** — an AI thinking partner that doesn't summarize *at* you, it thinks *with* you.
3. **Loops** — small (3–12 person) group spaces where stories get quoted and debated. The unit of audience is the group chat, not the public feed.

Full rationale in [02_concept.md](02_concept.md).

---

## Watch first

Two Loom walkthroughs — a real-time view of the process, not a polished demo:

- [Part 1 — research to scaffolded concept](https://www.loom.com/share/5bb659a1ce3e4f0ca3531227c816b9da) (~7 min) — framing the brief, running user research, and standing up the React prototype.
- [Part 2 — review, critique, design system](https://www.loom.com/share/5993800c2a7148c0be252922e2e90273) (~10 min) — first reaction to the build, a design critique pass, and bootstrapping the Figma design system from the code.

---

## The prototype

A 4-screen interactive flow built in React + Tailwind + Motion. The deployed app is the project home page (shared separately) — landing at `/`, prototype at `/prototype`. Source for both lives in [src/pages/](src/pages/). To run locally, see [Local setup](#local-setup) below.

---

## Read the work

Three artifacts, in reading order:

| # | Doc | What's in it | Read time |
|---|---|---|---|
| 01 | [Research brief](01_research_brief.md) | What Gen Z actually does with news. Trust collapse, doomscroll fatigue, group-chat-as-network, three personas. | ~10 min |
| 02 | [Concept](02_concept.md) | The product bet, the three monumental moves, personas → product, design system rationale, what we explicitly did not build. | ~12 min |
| — | [Design system (Figma)](https://www.figma.com/design/a5zdBghjOuSxbF4Bytn15v/Loop-Design-System?node-id=0-1&t=P6wwdZX2gxRVgFsu-1) | Components, type scale, color tokens, motion notes. | browse |

---

## What's in this repo

```
.
├── 01_research_brief.md   research synthesis (pre-concept)
├── 02_concept.md          concept + UX rationale + design moves
├── src/
│   ├── App.tsx            router (/ → Landing, /prototype → Prototype)
│   ├── pages/
│   │   ├── Landing.tsx    project home — hero, embedded Looms, docs, Figma
│   │   └── Prototype.tsx  the 4-screen prototype shell
│   ├── components/        screen + UI components
│   ├── data/              mock content (stories, loops, etc.)
│   └── index.css          Tailwind v4 config + design tokens
├── vercel.json            SPA rewrite for client-side routing
└── README.md              you are here
```

---

## Local setup

```sh
pnpm install
pnpm dev
```

App runs at [http://localhost:5173](http://localhost:5173).

**Scripts**

- `pnpm dev` — start the dev server
- `pnpm build` — type-check and build for production
- `pnpm preview` — preview the production build

**Stack** — Vite · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Motion · Lucide

Design tokens and theming live at the top of [src/index.css](src/index.css). Path alias `@/*` → `./src/*` is configured in [tsconfig.json](tsconfig.json) and [vite.config.ts](vite.config.ts).
