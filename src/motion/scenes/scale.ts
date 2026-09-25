import { $, $$, drawable, ease, htmlEl, maskedDrawable, scrubTimeline, setTemp, shown, wipe } from "../helpers";
import type { Scene, SceneContext } from "../types";

/**
 * CONVERGENCE → CONSEQUENCE. Scrubbed.
 *
 * The four discipline strands draw in, in the order Carl picked them up,
 * and meet at one junction. Only then does the system line come online and
 * what it produced resolves, one figure at a time:
 *   $500M+ → $150M → $20M → the two operational transformations.
 * Figures resolve behind a moving edge; they never count up. For a
 * transformation, the old value arrives first and stays, the connector
 * carries it, then the new value lands.
 */

const STRAND_STAGGER = 45;

function strands(tl: ReturnType<typeof scrubTimeline>, svg: SVGSVGElement, ctx: SceneContext, span: number) {
  const paths = $$<SVGGeometryElement>(svg, "[data-strand]");
  paths.forEach((path, i) => {
    const t = i * STRAND_STAGGER;
    const target = path.hasAttribute("stroke-dasharray")
      ? (() => {
          const { proxy, cleanup } = maskedDrawable(path);
          ctx.onCleanup(cleanup);
          return proxy;
        })()
      : drawable(path)[0];
    tl.add(target, { draw: ["0 0", "0 1"], duration: span, ease: ease.draw }, t);
  });
  // Labels/origins light as each discipline enters.
  const groups = $$(svg, "[data-strand-group]");
  const origins = groups.length ? groups.map((g) => $$(g, "text, circle")) : $$(svg, ":scope > circle").map((c) => [c]);
  origins.forEach((els, i) => tl.add(els, { opacity: [0.25, 1], duration: 40 }, i * STRAND_STAGGER));
  const junction = $(svg, "[data-junction]");
  const end = span + STRAND_STAGGER * (paths.length - 1);
  if (junction) tl.add(junction, { scale: [0, 1], duration: 40, ease: ease.snap }, end);
  return end + 40;
}

function transformation(tl: ReturnType<typeof scrubTimeline>, root: Element, t: number) {
  const before = $(root, "[data-before]");
  const connector = $(root, "[data-connector]");
  const after = $(root, "[data-after]");
  const label = $(root, ":scope > p:last-child");
  if (before) tl.add(before, { opacity: [0, 1], duration: 30 }, t);
  if (connector) tl.add(connector, { scaleX: [0, 1], duration: 45, ease: ease.draw }, t + 25);
  if (after) tl.add(after, { ...wipe, duration: 40, ease: ease.settle }, t + 65);
  if (label) tl.add(label, { opacity: [0, 1], duration: 40 }, t + 30);
}

function figure(tl: ReturnType<typeof scrubTimeline>, root: Element, t: number) {
  const [value, label] = $$(root, ":scope > p");
  if (value) tl.add(value, { ...wipe, duration: 70, ease: ease.settle }, t);
  if (label) tl.add(label, { opacity: [0, 1], duration: 50 }, t + 40);
}

function wide(ctx: SceneContext, grid: HTMLElement) {
  const svg = $<SVGSVGElement>(grid, '[data-convergence="wide"]')!;
  const bus = $(grid, "[data-bus]");
  const spine = $(grid, "[data-spine]");
  const tl = scrubTimeline();

  const converged = strands(tl, svg, ctx, 230);

  // The system line: bus to the right, spine down (a runtime line stands in
  // for the spine's border so it can grow without scaling its content).
  if (bus) tl.add(bus, { scaleX: [0, 1], duration: 160, ease: ease.draw }, converged);
  if (spine) {
    setTemp(spine, { borderLeftColor: "transparent" });
    const line = htmlEl(spine, "absolute -left-px top-0 bottom-0 w-px bg-technical", true);
    line.setAttribute("data-rail-grow", "");
    ctx.onCleanup(() => line.remove());
    tl.add(line, { scaleY: [0, 1], duration: 420, ease: "linear" }, converged);
  }

  const reveals = $$(grid, "[data-reveal]").sort(
    (a, b) => Number(a.dataset.reveal) - Number(b.dataset.reveal),
  );
  const start = converged + 60;
  const step = (1000 - start - 115) / (reveals.length - 1);
  reveals.forEach((el, i) => {
    const t = start + i * step;
    const tap = $(el, "[data-tap]");
    if (tap) {
      // Drops grow down from the bus; spine taps extend out from the spine.
      const vertical = tap.classList.contains("block");
      tl.add(tap, vertical ? { scaleY: [0, 1], duration: 50 } : { scaleX: [0, 1], duration: 30 }, t - 40);
    }
    const metric = el.matches("[data-metric]") ? el : $(el, "[data-metric]");
    if (!metric) return;
    if ($(metric, "[data-transformation]")) {
      transformation(tl, metric, t);
    } else {
      figure(tl, metric, t);
    }
  });

  ctx.controller.scrub(tl, { el: ctx.root, start: 0.82, end: 0.06 });
}

function narrow(ctx: SceneContext, list: HTMLElement) {
  const svg = $<SVGSVGElement>(list, '[data-convergence="narrow"]');
  const rail = $(list, ":scope > [data-rail]");
  if (svg) {
    const tl = scrubTimeline();
    const end = strands(tl, svg, ctx, 500);
    if (rail && shown(rail)) {
      rail.setAttribute("data-rail-grow", "");
      tl.add(rail, { scaleY: [0, 1], duration: 1000 - end, ease: "linear" }, end);
    }
    ctx.controller.scrub(tl, { el: ctx.root, start: 0.92, end: 0.45 });
  }
  for (const li of $$(list, "li[data-reveal]")) {
    const tl = scrubTimeline();
    const node = $(li, "[data-rail-node]");
    if (node) tl.add(node, { scale: [0, 1], duration: 150, ease: ease.snap }, 0);
    const improvement = $(li, "[data-metric]");
    if (improvement && $(improvement, "[data-transformation]")) transformation(tl, improvement, 150);
    else figure(tl, li, 150);
    ctx.controller.scrub(tl, { el: li, start: 0.9, end: 0.62 });
  }
}

export const scale: Scene = (ctx) => {
  const grid = $(ctx.root, '[data-convergence="wide"]')?.closest<HTMLElement>(".lg\\:grid");
  if (grid && shown(grid)) return wide(ctx, grid);
  const list = $(ctx.root, '[data-convergence="narrow"]')?.parentElement;
  if (list && shown(list)) narrow(ctx, list);
};
