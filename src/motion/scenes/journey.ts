import { svg, type Timeline } from "animejs";
import { $, $$, drawable, ease, maskedDrawable, scrubTimeline, shown, svgEl, token } from "../helpers";
import type { Scene, SceneContext } from "../types";

/**
 * THE SIGNAL MOVES THROUGH CARL'S BACKGROUND — and nothing it passes turns
 * off again. Scrubbed with scroll.
 *
 * Desktop: one copper signal travels the real wiring of the four drawings
 * (the receptacle's conductors → the part's centreline → the ladder rung →
 * the data path), leaving an energised trace behind it. Each drawing,
 * its rail segment and its milestones switch on as the signal arrives:
 *   electrical  — conductors energise
 *   mechanical  — dimension and leader lines are constructed
 *   controls    — contacts close input → interlock → output coil
 *   software    — both data branches connect (the most connected form)
 *
 * Phones/tablet: the page rail itself is the wire. Each milestone's rail
 * segment grows down to it as it arrives, then its drawing and text resolve.
 */

// The signal's path through the 800×120 strip. It runs straight through
// each device (receptacle, part, ladder rung, API node, datastore) and takes
// the upper branch through the software drawing.
const HEAD_PATH = "M0 60 H676 V32 H746 V60 H800";
const HEAD_LENGTH = 856;
// The visible energised trace follows only real conductors, as continuous
// runs (SVG restarts dash patterns at every subpath, so each run is drawn on
// its own). [d, start, end] in lengths along HEAD_PATH.
const RUNS: [string, number, number][] = [
  ["M0 60 H68", 0, 68],
  ["M132 60 H628", 132, 628],
  ["M656 60 H676 V32 H696", 656, 724],
  ["M724 32 H746 V60", 752, 802],
  ["M778 60 H800", 834, 856],
];
// The lower data branch connects alongside the upper one.
const BRANCH_RUNS: [string, number, number][] = [
  ["M676 60 V88 H696", 676, 724],
  ["M724 88 H746 V60", 752, 802],
];
// Where each drawing starts along HEAD_PATH.
const ARRIVAL = { electrical: 0, mechanical: 200, controls: 400, software: 600 };
const T0 = 60;
const T1 = 820;
const at = (length: number) => T0 + (length / HEAD_LENGTH) * (T1 - T0);

const DIM = 0.22;

function desktop(ctx: SceneContext, strip: SVGSVGElement) {
  const { root, controller, onCleanup } = ctx;
  const accent = token("accent");
  const glyphs = Object.fromEntries(
    $$<SVGGElement>(strip, "[data-glyph]").map((g) => [g.dataset.glyph!, g]),
  ) as Record<keyof typeof ARRIVAL, SVGGElement>;
  const columns = Object.fromEntries(
    $$(root, "[data-layer-column]").map((c) => [c.dataset.layerColumn!, c]),
  );
  const segments = $$(root, "[data-scene-content] > span > [data-rail]");

  // Runtime-only signal: energised runs and the travelling head.
  const stroke = { fill: "none", stroke: accent, "stroke-width": 1.75, opacity: 0.9 };
  const runs = [...RUNS, ...BRANCH_RUNS].map(([d, a, b]) => ({ el: svgEl(strip, "path", { d, ...stroke }), a, b }));
  const guide = svgEl(strip, "path", { d: HEAD_PATH, fill: "none", stroke: "none" });
  const head = svgEl(strip, "circle", { cx: 0, cy: 0, r: 4.5, fill: accent });
  onCleanup(() => [...runs.map((r) => r.el), guide, head].forEach((el) => el.remove()));

  const tl: Timeline = scrubTimeline();
  for (const run of runs) {
    const [proxy] = drawable(run.el);
    tl.add(proxy, { draw: ["0 0", "0 1"], duration: at(run.b) - at(run.a) }, at(run.a));
  }
  tl.add(head, { ...svg.createMotionPath(guide as unknown as SVGPathElement), duration: T1 - T0 }, T0)
    .add(head, { opacity: [0, 1], duration: 30 }, T0)
    .add(head, { opacity: [1, 0], duration: 80 }, T1 + 40);

  (Object.keys(ARRIVAL) as (keyof typeof ARRIVAL)[]).forEach((layer, i) => {
    const t = at(ARRIVAL[layer]);
    const glyph = glyphs[layer];
    tl.add(glyph, { opacity: [DIM, 1], duration: 70, ease: ease.settle }, t);
    if (columns[layer]) tl.add(columns[layer], { opacity: [0.28, 1], duration: 90 }, t + 10);
    if (segments[i]) tl.add(segments[i], { opacity: [0.25, 1], duration: 90 }, t);
  });

  // Mechanical: the drawing is constructed — dimension + leader lines draw,
  // then their arrowheads and values appear.
  const m = at(ARRIVAL.mechanical);
  const dims = drawable($$(glyphs.mechanical, "[data-dim]"));
  tl.add(dims, { draw: ["0 0", "0 1"], duration: 90, ease: ease.draw }, m + 20);
  tl.add($$(glyphs.mechanical, "[data-annotation]"), { opacity: [0, 1], duration: 50 }, m + 100);

  // Controls: logic becomes true from input toward output.
  const c = at(ARRIVAL.controls);
  const span = at(ARRIVAL.software) - c;
  (["input", "interlock", "output"] as const).forEach((name, i) => {
    const el = $(glyphs.controls, `[data-logic="${name}"]`);
    if (el) tl.add(el, { stroke: [token("technical"), accent], duration: 30 }, c + span * [0.22, 0.45, 0.72][i]);
  });

  // Software: data nodes resolve as both branches connect through them.
  const s = at(ARRIVAL.software);
  tl.add($$(glyphs.software, "[data-data-node]"), { opacity: [0.4, 1], duration: 60 }, s + 20);

  controller.scrub(tl, { el: strip, start: 0.8, end: 0.28 });
}

function narrow(ctx: SceneContext) {
  const { root, controller, onCleanup } = ctx;
  for (const li of $$(root, "ol [data-milestone]").filter(shown)) {
    const tl = scrubTimeline();
    const segment = $(li, "[data-rail]");
    const node = $(li, "[data-rail-node]");
    const glyph = $<SVGSVGElement>(li, "svg");
    const text = $$(li, ":scope > p, :scope > h3");

    if (segment && shown(segment)) tl.add(segment, { scaleY: [0, 1], duration: 700 }, 0);
    if (node) tl.add(node, { scale: [0.3, 1], duration: 120, ease: ease.snap }, 0);
    if (glyph) {
      tl.add(glyph, { opacity: [DIM, 1], duration: 250 }, 120);
      const solid = $$<SVGGeometryElement>(glyph, "[data-signal]:not([stroke-dasharray]), [data-dim]");
      if (solid.length) tl.add(drawable(solid), { draw: ["0 0", "0 1"], duration: 450, ease: ease.draw }, 120);
      for (const dashed of $$<SVGGeometryElement>(glyph, "[data-signal][stroke-dasharray]")) {
        const { proxy, cleanup } = maskedDrawable(dashed);
        onCleanup(cleanup);
        tl.add(proxy, { draw: ["0 0", "0 1"], duration: 450, ease: ease.draw }, 120);
      }
    }
    tl.add(text, { opacity: [0.25, 1], duration: 300, ease: ease.settle }, glyph ? 420 : 200);
    controller.scrub(tl, { el: li, start: 0.88, end: 0.5 });
  }
}

export const journey: Scene = (ctx) => {
  const strip = $<SVGSVGElement>(ctx.root, "[data-layer-strip]");
  if (shown(strip)) desktop(ctx, strip);
  else narrow(ctx);
};
