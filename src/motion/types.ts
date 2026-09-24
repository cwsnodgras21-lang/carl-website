import type { Timeline } from "animejs";
import type { ScrollController } from "./controller";

export type SceneContext = {
  /** The scene's <section>. */
  root: HTMLElement;
  controller: ScrollController;
  /** True only for the first build after a fresh page load at the top. */
  intro: boolean;
  /** Keep a self-playing timeline so it's reverted on teardown. */
  own: (tl: Timeline) => void;
  /** Undo any runtime-only DOM (masks, signal markers). */
  onCleanup: (fn: () => void) => void;
};

/** A scene module: reads its section, registers timelines, returns nothing. */
export type Scene = (ctx: SceneContext) => void;
