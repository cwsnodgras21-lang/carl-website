/**
 * Content model. Everything the site says lives in src/content/*.ts and is
 * typed here; components only render it.
 *
 * Rule: never fill a gap with something plausible. If a fact hasn't been
 * supplied, use `pending("what's missing")`. Pending values are never shown
 * to visitors: whatever depends on them is left out until the fact exists.
 * `npm run content:pending` lists what's still missing.
 */

export type Pending = { readonly pending: string };

/** A value Carl still needs to supply. */
export const pending = (note: string): Pending => ({ pending: note });

export const isPending = (value: unknown): value is Pending =>
  typeof value === "object" &&
  value !== null &&
  "pending" in value &&
  typeof (value as Pending).pending === "string";

export type Maybe<T> = T | Pending;

/* ─── Links ─────────────────────────────────────────────────────────────── */

export type SiteLink = {
  label: string;
  /** Internal path, external URL, mailto:, or Pending when not yet known. */
  href: Maybe<string>;
};

/* ─── Diagrams ──────────────────────────────────────────────────────────────
 * A conceptual system diagram. `columns` read left→right on desktop and
 * top→bottom on mobile, so one definition drives both geometries.
 */

export type DiagramNode = {
  id: string;
  label: string;
  /** Visually emphasise as the system's focal point. */
  core?: boolean;
};

export type SystemDiagram = {
  /** Accessible name for the diagram. */
  title: string;
  columns: DiagramNode[][];
  edges: ReadonlyArray<readonly [from: string, to: string]>;
  /** Draw small "parts" travelling along the connections. */
  flow?: boolean;
};

/* ─── Projects ──────────────────────────────────────────────────────────── */

export type VisualMode = "public-ui";

export type ProjectCategory = "NolTurn";

export type ProjectImage = {
  /** Path under /public, or Pending until a real sanitized asset exists. */
  src: Maybe<string>;
  alt: string;
  caption?: string;
  /**
   * A phone screenshot: shown at its own proportions in a narrow frame
   * instead of the default 16:10 crop. Needs the image's pixel size.
   */
  phone?: { width: number; height: number };
};

export type Project = {
  slug: string;
  title: string;
  category: ProjectCategory;
  status: Maybe<string>;
  /** One or two sentences. Used on the work index and in scenes. */
  summary: string;
  technologies: Maybe<string[]>;
  problem: Maybe<string>;
  context: Maybe<string>;
  system: Maybe<string>;
  /** "How it works" — conceptual only for abstracted work. */
  workflow?: SystemDiagram;
  outcome: Maybe<string>;
  /** What the system does, as short noun phrases. */
  capabilities?: string[];
  technicalNotes: Maybe<string>;
  learned: Maybe<string>;
  images: ProjectImage[];
  featured: boolean;
  visualMode: VisualMode;
  owner: "nolturn";
};

/* ─── Writing ───────────────────────────────────────────────────────────── */

export type Article = {
  slug: string;
  title: string;
  summary: string;
  /** ISO date. */
  published: Maybe<string>;
  /** Paragraphs of the essay body, or Pending until the text is supplied. */
  body: Maybe<string[]>;
  /** If the canonical copy lives elsewhere (LinkedIn, Substack…). */
  externalUrl?: string;
  featured: boolean;
};

/* ─── Career ────────────────────────────────────────────────────────────── */

/** The technical layer a milestone (or scene) belongs to. Drives visuals. */
export type SystemLayer =
  | "connection"
  | "electrical"
  | "mechanical"
  | "controls"
  | "software"
  | "enterprise"
  | "products"
  | "ai"
  | "method";

export type Milestone = {
  period: string;
  title: string;
  body: string;
  layer: SystemLayer;
};
