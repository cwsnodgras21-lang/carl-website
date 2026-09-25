import { $, $$, drawable, ease, scrubTimeline, shown, wipe } from "../helpers";
import type { Scene } from "../types";

/**
 * CONVERGENCE — "One screen instead of ten places to look." Scrubbed.
 *
 * The sources start apart. Their paths draw toward the support engineer
 * and meet at one junction; only then does the engineer's "one screen"
 * state switch on. The workflow continues to the ticket and branches to
 * warranty and spares. The $20M context activates only after the spares
 * branch has resolved, through its leader line.
 */
export const customerOperations: Scene = ({ root, controller }) => {
  const figure = $(root, "figure");
  const svg = figure && $$<SVGSVGElement>(figure, "svg[data-geometry]").find(shown);
  if (!svg) return;
  const container = svg.parentElement!;
  const sources = $(svg, '[data-stage="sources"]')!;
  const workflow = $(svg, '[data-stage="workflow"]')!;
  const tl = scrubTimeline();

  // 1. Separate sources; their paths converge.
  const sourceNodes = $$(sources, "[data-node]");
  const sourceWires = $$<SVGGeometryElement>(sources, "[data-wire]");
  tl.add(sourceNodes, { opacity: [0.45, 1], duration: 60 }, 0);
  sourceWires.forEach((w, i) => {
    tl.add(drawable(w), { draw: ["0 0", "0 1"], duration: 260, ease: ease.draw }, 60 + i * 30);
  });

  // 2. They meet; the person doing the work comes online.
  const t = 60 + 260 + 30 * (sourceWires.length - 1);
  tl.add($(svg, '[data-junction="converge"]')!, { scale: [0, 1], duration: 30, ease: ease.snap }, t);
  tl.add(drawable($<SVGGeometryElement>(svg, '[data-wire="converge-core"]')!), { draw: ["0 0", "0 1"], duration: 40 }, t + 20);
  const core = $$(svg, ":scope > [data-node]");
  const focus = $$(svg, ":scope > text");
  tl.add(core, { opacity: [0.25, 1], duration: 50, ease: ease.settle }, t + 60);
  tl.add(focus, { opacity: [0, 1], duration: 50 }, t + 90);

  // 3. The workflow continues, then branches.
  const w0 = t + 150;
  const [recordWire, ...rest] = $$<SVGGeometryElement>(workflow, ":scope > [data-wire]");
  const recordNode = $$(workflow, ":scope > [data-node]")[0];
  if (recordWire) tl.add(drawable(recordWire), { draw: ["0 0", "0 1"], duration: 50 }, w0);
  tl.add($$(workflow, ":scope > circle"), { opacity: [0, 1], duration: 20 }, w0 + 40);
  tl.add(recordNode, { opacity: [0.2, 1], duration: 40 }, w0 + 45);
  const branchWires = [...rest, ...$$<SVGGeometryElement>(workflow, ":scope > g [data-wire]")];
  tl.add(drawable(branchWires), { draw: ["0 0", "0 1"], duration: 90, ease: ease.draw }, w0 + 100);
  tl.add($$(workflow, ":scope > g circle, [data-junction='branch']"), { opacity: [0, 1], duration: 30 }, w0 + 140);
  tl.add($$(workflow, ":scope > [data-node]").slice(1), { opacity: [0.2, 1], duration: 50 }, w0 + 170);

  // 4. Only now: the spare-parts context, through its leader.
  const leader = $(svg, "[data-callout-leader]");
  const callout = $(container, "[data-callout]");
  const c0 = w0 + 250;
  if (leader) tl.add($$(leader, ":scope > *"), { opacity: [0, 1], duration: 60 }, c0);
  if (callout) {
    const [value, label, parts] = $$(callout, ":scope > *");
    tl.add(value, { ...wipe, duration: 70, ease: ease.settle }, c0 + 60);
    tl.add([label, parts].filter(Boolean), { opacity: [0, 1], duration: 70 }, c0 + 110);
  }

  controller.scrub(tl, { el: svg, start: 0.8, end: 0.12 });
};
