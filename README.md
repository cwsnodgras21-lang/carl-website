# carl-website

Carl Snodgrass's personal site. Next.js (App Router) · React · TypeScript · Tailwind CSS v4 · Anime.js 4.

```bash
npm install
npm run dev              # http://localhost:3000
npm run check            # typecheck + lint + production build
npm run content:pending  # list content still waiting on Carl
```

## Where things live

| Path | What |
| --- | --- |
| `src/content/` | **All copy and data.** Projects, metrics, articles, career, homepage copy, links. No CMS. |
| `src/content/types.ts` | Content model. `pending("…")` marks a fact that hasn't been supplied; it renders as a visible annotation. |
| `src/app/globals.css` | Design tokens: semantic colors, type scale, reduced-motion rules. Change the look here. |
| `src/app/layout.tsx` | Font faces for the three typographic voices (display / sans / mono). |
| `src/components/scenes/` | One file per homepage scene: markup and static visuals. Its motion lives in the matching `src/motion/scenes/` module. |
| `src/components/system/` | Shared visual language: scene rail, connection, layer drawings, system diagrams, metrics, screenshot slots. |
| `src/components/ui/` | Typography, links, containers. |
| `src/lib/motion.ts` | Motion levels and reduced-motion checks. |
| `src/demos/` | **Demo logic** for `/demos`: synthetic data and the real transformations (BOM, PO, system design). No DOM, deterministic. Copy lives in `src/content/demos.ts`; UI in `src/components/demos/`. |
| `src/motion/` | **Narrative motion.** Scroll controller, helpers, one module per scene. Loaded lazily on the homepage only; never with reduced motion. |

## Adding content

- **Project:** append to `src/content/projects.ts`. `/work` and `/work/[slug]` pick it up. Employer work uses `visualMode: "abstracted"`, meaning sanitized diagrams and metrics only, with no names, screenshots, or internal details.
- **Article:** append to `src/content/articles.ts`. Only publish writing that exists.
- **Metric:** add to `src/content/metrics.ts` and reference it by id. Don't restate a number anywhere else.

Then commit and deploy.

## Motion

One signal travels the page: the hero powers on, the signal runs through the four
disciplines, they converge into the system, the systems come online, and the circuit
closes at the end.

The demos on `/demos` use the same Anime.js vocabulary, but only in response to a button
press (`src/motion/demos.ts`, loaded on first use, never with reduced motion).

- `src/motion/runtime.ts` maps section ids to scene modules in `src/motion/scenes/`.
- `src/motion/controller.ts` maps scroll position onto Anime.js timelines (one passive
  scroll listener, layout cached, one update per frame). Tracks are **scrub** (progress
  follows scroll) or **trigger** (plays once, quickly, when reached).
- Scenes select `data-*` hooks in the static markup; anything that exists only for
  motion (signal heads, energised traces, masks) is created at runtime and removed on
  teardown. The static markup is the reduced-motion experience.
- `src/components/motion/motion-root.tsx` loads the runtime after hydration and tears it
  down if the visitor switches to reduced motion. A pre-paint class (`html.motion`, set
  in `layout.tsx`) lets the hero start un-powered without a flash; it removes itself
  after 1.5s if the runtime never starts.

To inspect it locally:

```bash
npm install
npm run build && npm start    # http://localhost:3000 — production build, real timings
```

Scroll slowly through the homepage; scroll back up to scrub any scene in reverse. To see
the reduced-motion experience, turn on "Reduce motion" in your OS (or in Chrome DevTools →
Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`) and reload.
