import type { Timeline } from "animejs";
import { ScrollController } from "./controller";
import { restoreAll } from "./helpers";
import { journey } from "./scenes/journey";
import { closing } from "./scenes/closing";
import { customerOperations } from "./scenes/customer-operations";
import { manufacturing } from "./scenes/manufacturing";
import { nolturn } from "./scenes/nolturn";
import { process } from "./scenes/process";
import { projectExecution } from "./scenes/project-execution";
import { quickWins } from "./scenes/quick-wins";
import { scale } from "./scenes/scale";
import { softwareFactory } from "./scenes/software-factory";
import { hero } from "./scenes/hero";
import type { Scene, SceneContext } from "./types";

/**
 * Motion runtime — loaded lazily by <MotionRoot/> on the homepage only, and
 * never when the visitor prefers reduced motion.
 *
 * Scenes are looked up by their section id; each scene module owns its
 * timelines. Content and layout never import from here.
 */

const scenes: Record<string, Scene> = {
  top: hero,
  journey,
  scale,
  work: projectExecution,
  manufacturing,
  "customer-operations": customerOperations,
  "quick-wins": quickWins,
  nolturn,
  "software-factory": softwareFactory,
  process,
  // Demos is deliberately still: its motion is in the demos themselves.
  contact: closing,
};

export function startMotion(): () => void {
  const html = document.documentElement;
  // The pre-paint class survives only if we arrived fast enough to use it.
  const firstPaintHidden = html.classList.contains("motion");
  html.classList.add("motion", "motion-live");

  let controller: ScrollController | null = null;
  let owned: Timeline[] = [];
  let cleanups: (() => void)[] = [];
  let width = window.innerWidth;

  const build = (intro: boolean) => {
    controller = new ScrollController();
    for (const [id, scene] of Object.entries(scenes)) {
      const root = document.getElementById(id);
      if (!root) continue;
      const ctx: SceneContext = {
        root,
        controller,
        intro,
        own: (tl) => owned.push(tl),
        onCleanup: (fn) => cleanups.push(fn),
      };
      scene(ctx);
    }
    controller.start();
  };

  const teardown = () => {
    controller?.destroy();
    controller = null;
    for (const tl of owned) tl.revert();
    owned = [];
    restoreAll();
    for (const fn of cleanups.reverse()) fn();
    cleanups = [];
  };

  build(firstPaintHidden && window.scrollY < window.innerHeight * 0.4);

  // Geometry swaps (phone ↔ desktop drawings) happen on width changes, so
  // rebuild then; height-only changes just need a re-measure.
  let resizeTimer = 0;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (Math.abs(window.innerWidth - width) > 1) {
        width = window.innerWidth;
        teardown();
        build(false);
      } else {
        controller?.measure();
        controller?.update(true);
      }
    }, 150);
  };
  window.addEventListener("resize", onResize);

  // Late layout shifts (fonts, images) move trigger points.
  let roFrame = 0;
  const ro = new ResizeObserver(() => {
    cancelAnimationFrame(roFrame);
    roFrame = requestAnimationFrame(() => {
      controller?.measure();
      controller?.update(true);
    });
  });
  ro.observe(document.body);

  return () => {
    window.removeEventListener("resize", onResize);
    clearTimeout(resizeTimer);
    ro.disconnect();
    cancelAnimationFrame(roFrame);
    teardown();
    html.classList.remove("motion", "motion-live");
  };
}
