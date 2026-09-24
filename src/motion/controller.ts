import type { Timeline } from "animejs";

/**
 * Scroll controller: maps page scroll onto Anime.js timelines.
 *
 * - One passive scroll listener, batched to one update per animation frame.
 * - Layout is read only in `measure()` (on init, resize, and body size
 *   changes), never during scroll. Each frame is arithmetic + `seek()`.
 * - A track whose progress hasn't changed isn't touched, so scenes that are
 *   off-screen (progress pinned at 0 or 1) cost nothing.
 *
 * Two kinds of track:
 *   scrub   — timeline progress follows scroll position between two points.
 *   trigger — timeline plays once, quickly, when an element reaches a line
 *             in the viewport; resets when the element is below the fold
 *             again so it can replay on the next pass.
 */

export type Edge = "top" | "bottom";

export type ScrubRange = {
  el: Element;
  /** Viewport fraction (0 = top, 1 = bottom) where the edge sits at progress 0. */
  start: number;
  /** Viewport fraction where the edge sits at progress 1. */
  end: number;
  edge?: Edge;
};

type ScrubTrack = {
  kind: "scrub";
  tl: Timeline;
  range: ScrubRange;
  y0: number;
  y1: number;
  last: number;
};

type TriggerTrack = {
  kind: "trigger";
  tl: Timeline;
  el: Element;
  /** Viewport fraction the element's top must pass to play. */
  at: number;
  yPlay: number;
  yReset: number;
  played: boolean;
};

type Track = ScrubTrack | TriggerTrack;

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/**
 * Anime.js renders a child's "from" values only once the playhead has
 * passed it. Sweep to the end and back (same task, before paint) so every
 * element starts in its un-powered state.
 */
export function prime(tl: Timeline) {
  tl.seek(tl.duration, true);
  tl.seek(0, true);
}

export class ScrollController {
  private tracks: Track[] = [];
  private frame = 0;
  private vh = 0;

  scrub(tl: Timeline, range: ScrubRange) {
    prime(tl);
    this.tracks.push({ kind: "scrub", tl, range, y0: 0, y1: 1, last: -1 });
  }

  trigger(tl: Timeline, el: Element, at = 0.8) {
    prime(tl);
    this.tracks.push({ kind: "trigger", tl, el, at, yPlay: 0, yReset: 0, played: false });
  }

  /** Read layout once. Call after init and whenever layout may have moved. */
  measure() {
    this.vh = window.innerHeight;
    const y = window.scrollY;
    for (const t of this.tracks) {
      if (t.kind === "scrub") {
        const rect = t.range.el.getBoundingClientRect();
        const edgeY = (t.range.edge === "bottom" ? rect.bottom : rect.top) + y;
        t.y0 = edgeY - t.range.start * this.vh;
        t.y1 = edgeY - t.range.end * this.vh;
        if (t.y1 <= t.y0) t.y1 = t.y0 + 1;
      } else {
        const top = t.el.getBoundingClientRect().top + y;
        t.yPlay = top - t.at * this.vh;
        t.yReset = top - this.vh;
      }
    }
  }

  /** Apply the current scroll position. `initial` settles triggers without playing. */
  update = (initial = false) => {
    this.frame = 0;
    const y = window.scrollY;
    for (const t of this.tracks) {
      if (t.kind === "scrub") {
        const p = clamp01((y - t.y0) / (t.y1 - t.y0));
        if (Math.abs(p - t.last) > 0.0005) {
          t.tl.seek(p * t.tl.duration);
          t.last = p;
        }
      } else if (!t.played && y >= t.yPlay) {
        t.played = true;
        // Already well past it (refresh while scrolled, anchor jump): settle.
        if (initial || y > t.yPlay + this.vh * 0.6) t.tl.seek(t.tl.duration);
        else t.tl.restart();
      } else if (t.played && y < t.yReset) {
        t.played = false;
        t.tl.pause();
        t.tl.seek(0);
      }
    }
  };

  private onScroll = () => {
    if (!this.frame) this.frame = requestAnimationFrame(() => this.update());
  };

  start() {
    this.measure();
    this.update(true);
    window.addEventListener("scroll", this.onScroll, { passive: true });
  }

  /** Revert every timeline to the static markup and stop listening. */
  destroy() {
    window.removeEventListener("scroll", this.onScroll);
    if (this.frame) cancelAnimationFrame(this.frame);
    for (const t of this.tracks) t.tl.revert();
    this.tracks = [];
  }
}
