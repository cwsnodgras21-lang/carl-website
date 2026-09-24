# carl-website

Carl Snodgrass's personal site. Next.js (App Router) · React · TypeScript · Tailwind CSS v4. Anime.js gets added in Phase 4 (narrative animation).

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
| `src/components/scenes/` | One file per homepage scene. Each scene owns its markup, visuals, and (later) its animation timeline. |
| `src/components/system/` | Shared visual language: scene rail, connection, layer drawings, system diagrams, metrics, screenshot slots. |
| `src/components/ui/` | Typography, links, containers. |
| `src/lib/motion.ts` | Motion levels and reduced-motion checks. |

## Adding content

- **Project:** append to `src/content/projects.ts`. `/work` and `/work/[slug]` pick it up. Employer work uses `visualMode: "abstracted"`, meaning sanitized diagrams and metrics only, with no names, screenshots, or internal details.
- **Article:** append to `src/content/articles.ts`. Only publish writing that exists.
- **Metric:** add to `src/content/metrics.ts` and reference it by id. Don't restate a number anywhere else.

Then commit and deploy.
