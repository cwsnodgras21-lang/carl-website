import { $, $$, ease, htmlEl, scrubTimeline, shown, undimmed } from "../helpers";
import type { Scene, SceneContext } from "../types";

/**
 * GOVERNED SPEED — AI-assisted speed inside a governed system. Scrubbed.
 *
 * The guardrails establish themselves first; only then does work enter.
 * A signal runs the pipeline stage by stage, and as it reaches each stage
 * that stage's checkpoints on both rails light — every step is validated
 * against the governance around it. Only SHIP leaves the enclosure.
 */

function wide(ctx: SceneContext, layout: HTMLElement) {
  const rails = $$(layout, "[data-guardrail]");
  const railLines = rails.map((r) => $(r, ":scope > span[aria-hidden]")!);
  const rules = rails.flatMap((r) => $$(r, ":scope > span:not([aria-hidden])"));
  const stages = $$(layout, "[data-stage]");
  const posts = $$(layout, "[data-post]");
  const channel = $(layout, "[data-channel]");
  const exit = $(layout, "[data-exit]");
  const list = stages[0]?.parentElement;
  if (!list || !channel) return;

  // Runtime-only signal on the channel.
  // Painted beneath the stage boxes: it disappears into each stage while
  // it's being validated and reappears between them.
  const signal = htmlEl(list, "absolute left-0 top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 bg-accent", true);
  ctx.onCleanup(() => signal.remove());
  const left = list.getBoundingClientRect().left;
  const stops = stages.map((s) => {
    const r = $(s, ":scope > span")!.getBoundingClientRect();
    return r.left + r.width / 2 - left;
  });
  const out = list.getBoundingClientRect().width + 34;

  const tl = scrubTimeline();
  // 1. Governance first.
  tl.add(railLines, { scaleX: [0, 1], duration: 170, ease: ease.draw }, 0);
  rules.forEach((rule, i) => tl.add(rule, { opacity: [0, 1], duration: 60, ease: ease.settle }, 60 + i * 25));
  tl.add(posts, { opacity: [0, 0.35], duration: 60 }, 200);

  // 2. Work enters and is validated at every stage.
  const T0 = 280;
  const leg = 600 / stages.length;
  tl.add(signal, { opacity: [0, 1], duration: 20 }, T0);
  tl.add(channel, { scaleX: [0, 1], duration: 600 + 60, ease: "linear" }, T0);
  let at = T0;
  stops.forEach((x, i) => {
    const arrive = T0 + leg * (i + 0.5);
    tl.add(signal, { translateX: x, duration: arrive - at, ease: "inOutSine" }, at);
    at = arrive;
    const box = $(stages[i], ":scope > span")!;
    tl.add(box, { ...undimmed(box, ["color", "borderColor"]), duration: 25 }, arrive - 10);
    const checks = [posts[i], posts[i + stages.length]].filter(Boolean);
    tl.add(checks, { opacity: [0.35, 1], duration: 25 }, arrive - 10);
  });

  // 3. Only SHIP leaves.
  tl.add(signal, { translateX: out, duration: 80, ease: ease.settle }, at + 20);
  if (exit) tl.add(exit, { opacity: [0, 1], duration: 40 }, at + 60);
  tl.add(signal, { opacity: [1, 0], duration: 30 }, at + 100);

  ctx.controller.scrub(tl, { el: layout, start: 0.8, end: 0.25 });
}

function narrow(ctx: SceneContext, layout: HTMLElement) {
  const rules = $$(layout, "[data-guardrail] li");
  const stages = $$(layout, "[data-stage]");
  const exit = $(layout, "[data-exit]");
  const tl = scrubTimeline();
  rules.forEach((rule, i) => tl.add(rule, { opacity: [0.15, 1], duration: 50 }, i * 30));
  const leg = 700 / stages.length;
  stages.forEach((stage, i) => {
    const t = 200 + i * leg;
    const box = $(stage, ":scope > span:not([data-post])")!;
    tl.add(box, { ...undimmed(box, ["color", "borderColor"]), duration: leg * 0.6 }, t);
    const post = $(stage, "[data-post]");
    if (post) tl.add(post, { opacity: [0.1, 0.6], duration: leg * 0.6 }, t);
  });
  if (exit) tl.add(exit, { opacity: [0, 1], duration: 60 }, 920);
  ctx.controller.scrub(tl, { el: layout, start: 0.85, end: 0.15 });
}

export const softwareFactory: Scene = (ctx) => {
  const figure = $(ctx.root, "figure");
  const layout = figure && $$(figure, ":scope > div").find(shown);
  if (!layout) return;
  if (layout.classList.contains("hidden")) wide(ctx, $(layout, ":scope > div")!);
  else narrow(ctx, layout);
};
