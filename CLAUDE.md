# Project Guide

A Next.js starter using the Pages Router, React 19, Tailwind v4, and shadcn/ui. This document describes the stack, layout, and code style so any AI assistant (or developer) can extend the project consistently.

---

## Platform-Owned Files

The platform invokes these in a strict, expected shape. **Modifying or removing the listed entries breaks how the project boots, builds, and serves — the user cannot debug the result.**

### `package.json` scripts

- **Do not modify or remove** the `dev`, `build`, and `start` entries. The platform calls them as `npm run dev`, `npm run build`, and `npm run start` — changing their command or removing them breaks the dev preview and production publish.
- **You may add new scripts** (e.g. `db:migrate`, `codegen`, `seed`) when the user's request needs them. New scripts must not shadow or rename the three reserved entries.

### `next.config.ts`

- **Do not modify or remove** these platform-required flags: `productionBrowserSourceMaps: false`, `experimental.cpus`, `experimental.workerThreads`, `typescript.ignoreBuildErrors`. They keep the build inside the container's memory budget.
- **You may add new options** (e.g. `images`, `redirects`, `headers`, additional `experimental` flags) as long as the listed ones are preserved.

### Other framework wiring — do not modify

- `tsconfig.json`, `postcss.config.*`, `next-env.d.ts`. These are fixed by the platform.

If a user's request genuinely requires changing any of the protected entries, stop and surface that to the user explicitly instead of editing silently.

---

## Stack

- **Framework:** Next.js 16 (Pages Router)
- **Runtime:** React 19
- **Styling:** Tailwind CSS v4 + `tw-animate-css`
- **UI primitives:** shadcn/ui (style: `base-nova`, base color: `neutral`)
- **Icons:** lucide-react
- **Class utilities:** `clsx` + `tailwind-merge` (combined as `cn()` in `@/lib/utils`)
- **Language:** TypeScript

---

## Directory Layout

```
src/
├── pages/          Next.js pages (_app, _document, index, 404, 500, ...)
├── components/
│   ├── ui/         shadcn-generated components
│   ├── generals/   shared layout/utility components
│   └── landing/    page-specific composition components
├── lib/            small utilities (utils.ts holds the `cn` helper)
├── constants/      static configuration
├── styles/         globals.css
└── types/          shared TypeScript types
public/             static assets
```

## Imports

- **Path alias:** Use `@/` (maps to `src/`). Avoid relative paths like `../../`.
- **Type imports:** Use `import type { ... }` first, separated from value imports by a blank line.
- **Multiline imports:** When importing more than 4 items, put each on its own line. Add a blank line before the multiline import. Single-line imports come before multiline imports within the same category.

    ```tsx
    import type { ReactNode } from 'react'
    import type { SiteConfig } from '@/types'

    import { Fragment, useState } from 'react'
    import { cn } from '@/lib/utils'

    import {
        Container,
        Layout,
        Seo
    } from '@/components/generals'
    ```

- **Order:**
    1. Type imports
    2. External packages
    3. Internal modules via `@/`
    4. Constants
    5. Relative imports (avoid when possible)

---

## Icons

Use lucide-react. Lucide exports names without an `Icon` suffix:

```tsx
import { Check, ChevronDown, User } from 'lucide-react'

<Check className='size-4' />
```

Use consistent sizes across a page — typically `size-4` (16px), `size-5` (20px), or `size-6` (24px). Don't mix arbitrary sizes within the same UI.

---

## Components

### shadcn primitives

This project is configured to use shadcn for UI primitives (buttons, inputs, dialogs, etc). Add them with:

```bash
npx shadcn add <name>
```

The CLI installs the component into `src/components/ui/` based on the configuration in `components.json`. Aliases: `@/components`, `@/components/ui`, `@/lib/utils`, `@/hooks`.

**Never run `shadcn init` or `shadcn create`** — the project is already initialized with its shadcn base CSS inlined into `src/styles/globals.css` (see the `/* ejected from shadcn@... */` block). Init would re-insert `@import "shadcn/tailwind.css"`, which does not resolve in this environment and breaks the build. Never add that import manually either.

After generation, adjust formatting to match the rules above (4-space indent, single quotes, no semicolons).

### Custom components

- File names: kebab-case (`hero-section.tsx`).
- Component names: PascalCase, default-exported when there's one component per file.
- Compose Tailwind class strings with `cn()` from `@/lib/utils`.
- Prefer Tailwind utilities over inline `style`. Use `style` only for runtime-computed values.

---

## Pages Router

- Pages live in `src/pages/*.tsx`.
- `_app.tsx` wraps every page (global layout/providers).
- `_document.tsx` controls the HTML shell.
- Data fetching: prefer `getStaticProps` for static content; use `getServerSideProps` only when per-request data is required.

### Built-in utilities

These ship with the boilerplate — reuse them rather than reimplementing:

- `@/components/generals/seo` — `<Seo>` component for page `<title>`, meta description, and Open Graph tags. Use it on every page.
- `@/components/generals/layout` — page layout wrapper.

---

## Storage (runtime object storage)

This project has built-in object storage: a private bucket fronted by a public CDN. Read and write objects at runtime with the server-only helper `@/lib/modulify/storage` — never call the storage HTTP API by hand.

```ts
import { putObject, listObjects, getObjectText } from '@/lib/modulify/storage'

// inside a Pages Router API route (src/pages/api/*.ts) or getServerSideProps:
await putObject('submissions/123.json', JSON.stringify(data))
const { files } = await listObjects('submissions/')
const raw = await getObjectText('submissions/123.json')
```

- **Server-only.** Import it only in API routes, `getServerSideProps`, or other server code. It throws in the browser and depends on `process.env.MODULIFY_STORAGE_KEY`, which is never exposed to the client. Never reference that variable in a client component.
- **Public reads.** Whatever you write is readable at the CDN URL returned by `putObject`/`listObjects`. Do not store secrets or personal data you would not want public at a guessable URL; for private data keep it under a dedicated prefix and read it back with `getObject` server-side rather than exposing the URL.
- **Functions:** `putObject(key, body, { contentType?, encoding? })`, `getObject(key)`, `getObjectText(key)`, `listObjects(prefix?, token?)`, `deleteObject(key)`, `deleteObjects(keys)`, `createFolder(name, path?)`, `deleteFolder(path)`, `moveObjects(keys, destination)`. Pass `encoding: 'base64'` to `putObject` for binary data.
- **Caching is automatic.** CDN objects are cached hard at the edge, but every write, overwrite, move, and delete transparently purges that object's cache, so the next fetch always returns the latest bytes. Never append cache-busting query strings (`?v=123`), just reuse the same key to update a file in place. Only when many pages hardcode an asset that must stay byte-stable for a long time (a downloadable release, a pinned dataset) should you write a new versioned key instead of overwriting.
- **Naming.** Organize under clear prefixes (`images/`, `uploads/`, `data/`), keep keys lowercase and hyphenated with no spaces, and name objects by their content rather than a timestamp so URLs stay stable and clean.

## Design system — "the sketchbook"

The site is a hand-drawn sketchbook: warm paper, graphite, and fluorescent riso inks. Keep new work in that language.

- **Tokens** live in `globals.css` (`--paper`, `--graphite*`, `--rule*`, riso `--pink --blue --yellow --navy --green --orange`). Use them via Tailwind (`bg-paper`, `text-graphite-soft`, `text-pink`, `border-rule`). Night mode is `:root[data-theme='night']`, toggled by the pull-cord lamp (`useTheme` → `'paper' | 'night'`).
- **Fonts:** `font-display` (Instrument Serif, headings), `font-serif` (Newsreader, body), `font-hand` (Caveat, annotations), `font-mono` (JetBrains Mono, labels), `font-arabic` (Aref Ruqaa).
- **Marks:** never hand-write SVG squiggles. Use `@/components/sketch/*` — `SketchBox` (pencil frame), `Mark` (circle/underline a word), `HandArrow`, `Tape`, `Reveal` (appears on twos), `Doodle` (live canvas drawing). Geometry comes from `@/lib/sketch` (seeded, deterministic) and canvas marks from `@/lib/pencil`.
- **Motion:** hand-drawn motion is stepped. Doodles draw at 12 fps; hovered marks "boil" between three fixed redraws (`boil-hover` on an ancestor). Randomness must be seeded — no `Math.random` in marks.
- **Hero film:** `film/` holds the source of the hero loop (hand-drawn-canvas-animation skill). It is drawn on white and composited with `mix-blend-mode: multiply` (screen + invert at night). See `film/README.md` to re-render into `public/film/`.
- **Content:** project copy, nav and the ledger are in `@/constants/content.ts`; GitHub data comes live through `@/lib/github` and the `/api/github/*` routes.

## Styling

- Tailwind utilities for everything.
- Custom CSS only in `src/styles/globals.css` and only when utilities can't express it. Append to the file — never rewrite it from scratch, and never remove the inlined `/* ejected from shadcn@... */` block or add an `@import "shadcn/tailwind.css"` line.
- shadcn theme tokens are defined as CSS variables in `globals.css` — reference them via Tailwind (`bg-background`, `text-foreground`, etc.) rather than hex/HSL literals.

---

## TypeScript

- Keep types close to their use. Put cross-cutting shared types in `src/types/index.ts`.
- For component props, declare a local `interface ComponentProps { ... }` at the top of the file.
- Prefer `unknown` + narrowing over `any`.

---

This file is intended to evolve. If you (the assistant or developer) introduce a new convention, update this document so future contributors stay aligned.