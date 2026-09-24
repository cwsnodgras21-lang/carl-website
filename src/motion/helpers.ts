import { createTimeline, svg, type Timeline } from "animejs";

/**
 * Shared building blocks for scene timelines.
 *
 * Authoring convention: every scrubbed timeline is written on a 0–1000 ms
 * scale, so positions read as per-mille of scroll progress.
 */

export const SPAN = 1000;

/** Motion vocabulary — mechanical, deliberate, no bounce. */
export const ease = {
  draw: "inOutSine",
  settle: "outCubic",
  snap: "outQuart",
  travel: "linear",
} as const;

export const $ = <T extends Element = HTMLElement>(root: ParentNode, sel: string) =>
  root.querySelector<T & Element>(sel) as T | null;

export const $$ = <T extends Element = HTMLElement>(root: ParentNode, sel: string) =>
  Array.from(root.querySelectorAll(sel)) as T[];

/** Rendered (not display:none, not inside a hidden geometry). */
export const shown = (el: Element | null | undefined): el is Element =>
  !!el && el.getClientRects().length > 0;

/** A left-to-right reveal: the value resolves behind a moving edge. */
export const wipe = {
  // Open on the left so taps/arrows attached to the value aren't clipped.
  clipPath: ["inset(-15% 100% -15% -4rem)", "inset(-15% 0% -15% -4rem)"],
};

/** Timeline driven by the scroll controller (never autoplays). */
export function scrubTimeline(): Timeline {
  const tl = createTimeline({ autoplay: false, defaults: { ease: "linear" } });
  // Pin the length so positions are always per-mille of progress.
  tl.add({ duration: 1 }, SPAN - 1);
  return tl;
}

/** Short timeline for trigger tracks. */
export function playTimeline(): Timeline {
  return createTimeline({ autoplay: false, defaults: { ease: ease.snap } });
}

/**
 * Teardown for things `timeline.revert()` doesn't undo (drawable dash
 * attributes, temporary styles). Flushed by the runtime after reverting.
 */
const restores: (() => void)[] = [];
export const onRestore = (fn: () => void) => restores.push(fn);
export function restoreAll() {
  while (restores.length) restores.pop()!();
}

/** Temporarily override inline styles; restored on teardown. */
export function setTemp(el: HTMLElement | SVGElement, styles: Partial<CSSStyleDeclaration>) {
  const before = el.getAttribute("style");
  Object.assign(el.style, styles);
  onRestore(() => (before === null ? el.removeAttribute("style") : el.setAttribute("style", before)));
}

const DASH_ATTRS = ["stroke-dasharray", "stroke-dashoffset", "pathLength"] as const;

/**
 * Drawable proxies for solid strokes (Anime.js `svg.createDrawable`).
 * Their dash attributes are restored on teardown.
 */
export function drawable(targets: Element | Element[]) {
  const list = Array.isArray(targets) ? targets : [targets];
  for (const el of list) {
    const saved = DASH_ATTRS.map((a) => [a, el.getAttribute(a)] as const);
    const cap = (el as SVGElement).style.strokeLinecap;
    onRestore(() => {
      for (const [a, v] of saved) {
        if (v === null) el.removeAttribute(a);
        else el.setAttribute(a, v);
      }
      (el as SVGElement).style.strokeLinecap = cap;
    });
  }
  return svg.createDrawable(list as unknown as string);
}

let maskId = 0;

/**
 * Dashed/dotted strokes can't be drawn with dash offsets (that *is* their
 * pattern). Instead, reveal them through a mask whose solid copy of the
 * same geometry is drawn. Returns the drawable proxy and a cleanup.
 */
export function maskedDrawable(path: SVGGeometryElement) {
  const svgEl = path.ownerSVGElement!;
  const ns = "http://www.w3.org/2000/svg";
  const vb = svgEl.viewBox.baseVal;
  const id = `m-draw-${++maskId}`;

  let defs = svgEl.querySelector("defs");
  const createdDefs = !defs;
  if (!defs) {
    defs = document.createElementNS(ns, "defs");
    svgEl.prepend(defs);
  }
  const mask = document.createElementNS(ns, "mask");
  mask.setAttribute("id", id);
  mask.setAttribute("maskUnits", "userSpaceOnUse");
  mask.setAttribute("x", String((vb?.x ?? 0) - 20));
  mask.setAttribute("y", String((vb?.y ?? 0) - 20));
  mask.setAttribute("width", String((vb?.width || svgEl.clientWidth) + 40));
  mask.setAttribute("height", String((vb?.height || svgEl.clientHeight) + 40));

  const copy = path.cloneNode(false) as SVGGeometryElement;
  copy.removeAttribute("stroke-dasharray");
  copy.removeAttribute("class");
  copy.removeAttribute("data-strand");
  copy.removeAttribute("data-wire");
  copy.setAttribute("stroke", "#fff");
  copy.setAttribute("fill", "none");
  const width = parseFloat(path.getAttribute("stroke-width") ?? "1.5");
  copy.setAttribute("stroke-width", String(width + 6));
  mask.append(copy);
  defs.append(mask);
  path.setAttribute("mask", `url(#${id})`);

  const [proxy] = drawable(copy);
  const cleanup = () => {
    path.removeAttribute("mask");
    mask.remove();
    if (createdDefs) defs!.remove();
  };
  return { proxy, cleanup };
}

/** Create a runtime-only SVG element (never part of the static markup). */
export function svgEl<K extends keyof SVGElementTagNameMap>(
  parent: Element,
  tag: K,
  attrs: Record<string, string | number>,
) {
  const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, String(v));
  el.setAttribute("data-motion-only", "");
  parent.append(el);
  return el;
}

/** Create a runtime-only HTML element. */
export function htmlEl(parent: Element, className: string, prepend = false) {
  const el = document.createElement("span");
  el.className = className;
  el.setAttribute("aria-hidden", "true");
  el.setAttribute("data-motion-only", "");
  if (prepend) parent.prepend(el);
  else parent.append(el);
  return el;
}

/** Resolve a design token (CSS custom property) to its current value. */
export const token = (name: string) =>
  getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim();

type ColorProp = "color" | "borderColor" | "backgroundColor";

/**
 * "Not yet energised" without opacity: opacity would make opaque boxes
 * see-through and show the wires behind them. Returns tween params from a
 * dim token to the element's own current (static) colours.
 */
export function undimmed(el: Element, props: ColorProp[], dim = token("border")) {
  const cs = getComputedStyle(el);
  return Object.fromEntries(props.map((p) => [p, [dim, cs[p]]])) as Record<ColorProp, [string, string]>;
}
