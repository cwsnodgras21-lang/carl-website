import { animate, createTimeline, stagger, utils, type JSAnimation, type Timeline } from "animejs";
import { ease } from "./helpers";

/**
 * Interaction motion for the demos — the same Anime.js vocabulary as the
 * homepage narrative, but driven by a button press instead of scroll.
 *
 * Rules:
 * - The demo's React state is the truth. Motion only carries the eye from
 *   one state to the next and calls back when a stage is reached.
 * - Nothing here leaves inline styles behind: every animation either ends
 *   on the element's static state and cleans itself up, or is reverted by
 *   `stop()` (reset / unmount).
 * - Loaded lazily on the first interaction, never with reduced motion (the
 *   demos apply their final state immediately instead).
 */

type Live = JSAnimation | Timeline;

export type DemoMotion = {
  /**
   * Walk the copper signal through the pipeline's stage nodes. Calls
   * `onStage(i)` as the signal reaches stage i, then `onDone()`.
   */
  runPipeline(opts: {
    track: HTMLElement;
    signal: HTMLElement;
    nodes: HTMLElement[];
    onStage: (index: number) => void;
    onDone: () => void;
    /** Time spent at each stage before moving on (ms). */
    dwell?: number | ((index: number) => number);
  }): void;
  /** Bring newly-rendered elements in: fade + short travel, staggered. */
  enter(targets: Element[], opts?: { axis?: "x" | "y"; delay?: number }): void;
  /** Draw solid SVG wires (pathLength=1) from their start. */
  draw(wires: SVGGeometryElement[], opts?: { delay?: number }): void;
  /** Cancel and undo everything in flight. */
  stop(): void;
};

const HOP = 420;

export function createDemoMotion(): DemoMotion {
  const live = new Set<Live>();

  /** Inline styles an animation owns; removed when it ends or is stopped. */
  const owned = new Map<Live, { els: Element[]; props: string[] }>();
  const clean = (anim: Live) => {
    const own = owned.get(anim);
    owned.delete(anim);
    live.delete(anim);
    for (const el of own?.els ?? []) {
      for (const p of own!.props) (el as HTMLElement).style.removeProperty(p);
      if ((el as HTMLElement).getAttribute("style") === "") el.removeAttribute("style");
    }
  };

  // Every animation ends on the element's static state, so on completion
  // the inline copy of it is dropped.
  const track = (anim: Live, els: Element[], props: string[]) => {
    live.add(anim);
    owned.set(anim, { els, props });
    anim.then(() => clean(anim));
  };

  return {
    runPipeline({ track: box, signal, nodes, onStage, onDone, dwell = 520 }) {
      const origin = box.getBoundingClientRect();
      const centre = (node: HTMLElement) => {
        const r = node.getBoundingClientRect();
        const s = signal.getBoundingClientRect();
        return {
          x: r.left + r.width / 2 - origin.left - s.width / 2,
          y: r.top + r.height / 2 - origin.top - s.height / 2,
        };
      };
      const stops = nodes.map(centre);
      const wait = (i: number) => (typeof dwell === "function" ? dwell(i) : dwell);

      const placed = utils.set(signal, { x: stops[0].x, y: stops[0].y });
      live.add(placed);
      owned.set(placed, { els: [signal], props: ["transform", "translate"] });
      onStage(0);

      const tl = createTimeline({ autoplay: false });
      let at = wait(0);
      for (let i = 1; i < stops.length; i++) {
        tl.add(signal, { x: stops[i].x, y: stops[i].y, duration: HOP, ease: ease.settle }, at);
        const index = i;
        tl.call(() => onStage(index), at + HOP);
        at += HOP + (i < stops.length - 1 ? wait(i) : 0);
      }
      tl.call(() => {
        live.delete(tl);
        live.delete(placed);
        onDone();
        // The signal is hidden by the demo's state once done; then drop
        // its position.
        requestAnimationFrame(() => {
          tl.revert();
          placed.revert();
          clean(placed);
        });
      }, at + 1);

      live.add(tl);
      tl.play();
    },

    enter(targets, { axis = "x", delay = 0 } = {}) {
      if (!targets.length) return;
      // Hidden synchronously so nothing flashes before the first frame.
      for (const el of targets) (el as HTMLElement).style.opacity = "0";
      track(
        animate(targets, {
          opacity: [0, 1],
          [axis]: [axis === "x" ? -10 : -6, 0],
          duration: 360,
          delay: stagger(70, { start: delay }),
          ease: ease.settle,
        }),
        targets,
        ["opacity", "transform", "translate"],
      );
    },

    draw(wires, { delay = 0 } = {}) {
      if (!wires.length) return;
      for (const wire of wires) Object.assign(wire.style, { strokeDasharray: "1", strokeDashoffset: "1" });
      track(
        animate(wires, {
          strokeDashoffset: [1, 0],
          duration: 380,
          delay: stagger(70, { start: delay }),
          ease: ease.draw,
        }),
        wires,
        ["stroke-dasharray", "stroke-dashoffset"],
      );
    },

    stop() {
      // Newest first: each revert restores what was there before it started.
      for (const anim of [...live].reverse()) {
        anim.pause();
        anim.revert();
        clean(anim);
      }
      live.clear();
    },
  };
}
