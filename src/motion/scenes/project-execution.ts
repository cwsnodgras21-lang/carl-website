import { $, $$, drawable, ease, scrubTimeline, shown, wipe } from "../helpers";
import type { Scene } from "../types";

/**
 * EXPANSION — "It started as a Procore replacement." Scrubbed.
 *
 * The core and its "started here" boundary are there from the start. With
 * scroll, capabilities branch out one at a time; the connected-platform
 * boundary becomes apparent once the system has outgrown the original one;
 * Procurement connects out to ERP last. The turn ("It didn't stay that
 * way.") resolves while the system expands; $350K+ lands after it has.
 * $500M+ stays a quiet reference — its reveal happened in Scale.
 */
export const projectExecution: Scene = ({ root, controller }) => {
  const geometry = $$<SVGSVGElement>(root, "figure [data-geometry]").find(shown);
  if (!geometry) return;
  const expansion = $(geometry, '[data-stage="expansion"]')!;
  const external = $(geometry, '[data-stage="external"]');
  const tl = scrubTimeline();

  const boundary = $$(expansion, ":scope > rect, :scope > text");
  const modules = $$(expansion, ":scope > g");
  // Wide: spokes are direct children, one per module. Narrow: a spine,
  // and each module group carries its own branch wire.
  const direct = $$<SVGGeometryElement>(expansion, ":scope > [data-wire]");
  const spine = direct.find((w) => w.dataset.wire === "spine");
  const spokes = direct.filter((w) => w !== spine);

  const span = 560;
  const step = span / modules.length;
  if (spine) {
    // Narrow geometry: the spine grows down, each branch leaves it in turn.
    tl.add(drawable(spine), { draw: ["0 0", "0 1"], duration: span }, 40);
  }
  modules.forEach((group, i) => {
    const t = 40 + i * step;
    const spoke = spine ? $$<SVGGeometryElement>(group, "[data-wire]") : spokes.slice(i, i + 1);
    if (spoke.length) tl.add(drawable(spoke), { draw: ["0 0", "0 1"], duration: step * 0.8, ease: ease.draw }, t);
    const parts = $$(group, ":scope > circle, :scope > [data-node]");
    tl.add(parts, { opacity: [0, 1], duration: step * 0.5, ease: ease.settle }, t + step * 0.6);
  });
  tl.add(boundary, { opacity: [0, 1], duration: 120 }, 40 + span - 60);

  if (external) {
    const t = 40 + span + 60;
    const wires = $$<SVGGeometryElement>(external, "[data-wire]");
    tl.add(drawable(wires), { draw: ["0 0", "0 1"], duration: 110, ease: ease.draw }, t);
    tl.add($$(external, "[data-junction]"), { scale: [0, 1], duration: 30, ease: ease.snap }, t + 40);
    tl.add($$(external, "circle, [data-node]"), { opacity: [0, 1], duration: 60 }, t + 110);
  }

  const turn = $(root, "[data-turn]");
  if (turn) {
    const [statement, body] = $$(turn, ":scope > *");
    tl.add(statement, { ...wipe, duration: 180, ease: ease.settle }, 200);
    tl.add(body, { opacity: [0.2, 1], duration: 120 }, 330);
  }
  const saved = $(root, '[data-metric="softwareCost"]');
  if (saved) {
    const [value, label] = $$(saved, ":scope > p");
    tl.add(value, { ...wipe, duration: 70, ease: ease.settle }, 860);
    tl.add([label, $(root, "[data-meta]")], { opacity: [0, 1], duration: 60 }, 900);
  }

  controller.scrub(tl, { el: geometry, start: 0.8, end: 0.2 });
};
