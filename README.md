# genz-social

React starter: Vite + TypeScript + Tailwind CSS v4 + shadcn/ui + Motion + Lucide.

## Setup

```sh
pnpm install
pnpm dev
```

App runs at http://localhost:5173.

## Scripts

- `pnpm dev` — start the dev server
- `pnpm build` — type-check and build for production
- `pnpm preview` — preview the production build

## Stack

- **Vite** — build tool and dev server
- **React 19** + **TypeScript**
- **Tailwind CSS v4** — CSS-first config in `src/index.css`
- **shadcn/ui** — copy-paste components in `src/components/ui/`
- **Motion** (`motion.dev`) — animations via `motion/react`
- **Lucide** — icons via `lucide-react`

## Adding shadcn components

```sh
pnpm dlx shadcn@latest add card dialog input
```

Components land in `src/components/ui/` and use the existing `cn()` helper at [src/lib/utils.ts](src/lib/utils.ts).

## Path alias

`@/*` resolves to `./src/*`. Configured in both [tsconfig.json](tsconfig.json) and [vite.config.ts](vite.config.ts).

## Theming

Light and dark CSS variables live at the top of [src/index.css](src/index.css). Toggle dark mode by adding the `dark` class to a parent element (e.g. `<html class="dark">`).
