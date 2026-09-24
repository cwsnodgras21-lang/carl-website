import { scale } from "@/content/home";
import { metrics, scaleMetrics, type MetricId } from "@/content/metrics";
import type { Metric } from "@/content/types";
import { MetricFigure } from "@/components/system/metric";
import { RailNode, RailSegment, SceneShell } from "@/components/system/scene-shell";
import { Junction } from "@/components/system/svg-primitives";
import { Label } from "@/components/ui/typography";
import { cn } from "@/lib/cn";

/**
 * The reveal of what the accumulated disciplines produced.
 *
 * Four strands — electrical, mechanical, controls, software — enter and
 * merge at one junction. From it, a bus runs right and the three scope
 * figures hang off it (deeper and smaller as the numbers get smaller); a
 * branch runs down to the two operational improvements.
 *
 * Motion hooks (Phase 4): [data-strand=<layer>] paths merge into
 * [data-junction=scale] (dashed strands must be drawn through a mask —
 * pathLength would rescale their dash patterns); [data-bus] extends; each
 * [data-tap] drops and reveals its [data-metric] in [data-reveal] order.
 */

const strands = [
  { layer: "electrical", label: "Electrical", y: 16, className: "stroke-accent", width: 2 },
  { layer: "mechanical", label: "Mechanical", y: 44, dash: "12 3 2 3", width: 1.1 },
  { layer: "controls", label: "Controls", y: 84, dash: "7 4", width: 1.5 },
  { layer: "software", label: "Software", y: 112, dash: "0.1 5", width: 2.2, round: true },
] as const;

const BUS_Y = 64;

/* ─── Desktop geometry ──────────────────────────────────────────────────── */

function ConvergenceWide() {
  return (
    <svg
      aria-hidden="true"
      width={240}
      height={128}
      viewBox="0 0 240 128"
      className="overflow-visible"
      data-convergence="wide"
    >
      {strands.map((s) => (
        <g key={s.layer} data-strand-group={s.layer}>
          <text
            x={0}
            y={s.y}
            dominantBaseline="central"
            className="fill-technical font-mono uppercase"
            style={{ fontSize: 11.5, letterSpacing: "0.1em" }}
          >
            {s.label}
          </text>
          <path
            data-strand={s.layer}
            d={`M104 ${s.y} H162 C204 ${s.y} 198 ${BUS_Y} 240 ${BUS_Y}`}
            fill="none"
            strokeWidth={s.width}
            strokeDasharray={"dash" in s ? s.dash : undefined}
            strokeLinecap={"round" in s ? "round" : "butt"}
            className={"className" in s ? s.className : "stroke-technical"}
          />
          <circle cx={104} cy={s.y} r={2.5} className="fill-technical" />
        </g>
      ))}
      <Junction x={240} y={BUS_Y} id="scale" />
    </svg>
  );
}

const scopeSize: Record<string, string> = {
  projectWork: "text-[clamp(4rem,7.1vw,8rem)]",
  manufacturingOperation: "text-[clamp(3rem,5.2vw,5.75rem)]",
  spareParts: "text-[clamp(2.5rem,4vw,4.5rem)]",
};

const scopeDrop: Record<string, string> = {
  manufacturingOperation: "h-[7.5rem]",
  spareParts: "h-[14.5rem]",
};

function ScopeFigure({
  metric,
  className,
  tap = false,
}: {
  metric: Metric;
  className?: string;
  /** Draw a tap from the spine to the figure's midline. */
  tap?: boolean;
}) {
  return (
    <div data-metric={metric.id} className={className}>
      <p
        className={cn(
          "relative font-display font-semibold leading-[0.9] tracking-[-0.045em] [font-stretch:112%]",
          scopeSize[metric.id],
        )}
      >
        {tap && <Tap className="-left-10 top-1/2 w-8" />}
        {metric.value}
      </p>
      <p className="mt-4 max-w-[18rem] text-lg leading-snug text-muted">{metric.label}</p>
    </div>
  );
}

function Improvement({ metric, size, tap }: { metric: Metric; size: string; tap?: string }) {
  return (
    <div data-metric={metric.id}>
      <p className={cn("relative font-display font-semibold uppercase tracking-[-0.03em] [font-stretch:112%]", size)}>
        {tap && <Tap className={cn("top-1/2", tap)} />}
        <MetricFigure metric={metric} />
      </p>
      <p className="mt-2 text-base text-muted">{metric.label}</p>
    </div>
  );
}

/* A short horizontal wire from a spine into the item beside it. */
function Tap({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" data-tap className={cn("absolute h-px bg-technical", className)}>
      <span className="absolute -left-[4px] top-1/2 size-[7px] -translate-y-1/2 border border-foreground bg-background" />
    </span>
  );
}

function ScaleWide() {
  const [first, ...rest] = scaleMetrics.scope;
  return (
    <div className="relative hidden grid-cols-[15rem_minmax(0,1.65fr)_minmax(0,1fr)_minmax(0,0.8fr)] items-start lg:grid">
      {/* Bus: from the junction across the scope figures. */}
      <span
        aria-hidden="true"
        data-bus
        className="absolute left-[15rem] right-0 h-[6px] -translate-y-1/2 border-y border-technical"
        style={{ top: BUS_Y }}
      />

      <ConvergenceWide />

      {/* Spine: straight down from the junction. The largest scope figure
          hangs here first; the operational improvements branch below it. */}
      <div data-spine className="relative ml-0 border-l border-technical pb-2 pl-10" style={{ marginTop: BUS_Y }}>
        <div className="pt-8" data-reveal="1">
          <ScopeFigure metric={metrics[first]} tap />
        </div>
        <div className="mt-16 flex flex-col gap-9">
          {scaleMetrics.improvement.map((id, i) => (
            <div key={id} data-reveal={4 + i}>
              <Improvement
                metric={metrics[id]}
                size="text-[clamp(1.75rem,2.5vw,2.6rem)]"
                tap="-left-10 w-8"
              />
            </div>
          ))}
        </div>
        <span aria-hidden="true" className="absolute -bottom-1 -left-[4px] size-[7px] rounded-full bg-technical" />
      </div>

      {rest.map((id: MetricId, i) => (
        <div key={id} className="relative" style={{ marginTop: BUS_Y }} data-reveal={2 + i}>
          <span aria-hidden="true" data-tap className={cn("block w-px bg-technical", scopeDrop[id])}>
            <span className="absolute left-0 top-0 size-[9px] -translate-x-1/2 -translate-y-1/2 border border-foreground bg-background" />
          </span>
          <ScopeFigure metric={metrics[id]} className="mt-6" />
        </div>
      ))}
    </div>
  );
}

/* ─── Phone / tablet geometry ───────────────────────────────────────────── */

function ConvergenceNarrow() {
  // Four strands descend beside the rail and merge into it.
  const xs = [1, 9.5, 18, 26.5];
  return (
    <svg
      aria-hidden="true"
      width={32}
      height={96}
      viewBox="0 0 32 96"
      className="absolute left-[var(--rail-offset)] top-0 -ml-px overflow-visible"
      data-convergence="narrow"
    >
      {strands.map((s, i) => (
        <path
          key={s.layer}
          data-strand={s.layer}
          d={i === 0 ? `M1 6 V88` : `M${xs[i]} 6 V40 C${xs[i]} 70 1 64 1 88`}
          fill="none"
          strokeWidth={s.width}
          strokeDasharray={"dash" in s ? s.dash : undefined}
          strokeLinecap={"round" in s ? "round" : "butt"}
          className={"className" in s ? s.className : "stroke-technical"}
        />
      ))}
      {xs.map((x) => (
        <circle key={x} cx={x} cy={6} r={2.5} className="fill-technical" />
      ))}
      <Junction x={1} y={88} id="scale" />
    </svg>
  );
}

const narrowSize: Record<string, string> = {
  projectWork: "text-[3.75rem]",
  manufacturingOperation: "text-[3rem]",
  spareParts: "text-[2.5rem]",
};

function ScaleNarrow() {
  return (
    <div className="lg:hidden">
      <ConvergenceNarrow />
      <RailSegment layer="enterprise" className="bottom-0 top-[88px] md:hidden" />
      <ol className="flex flex-col gap-10">
        {scaleMetrics.scope.map((id, i) => {
          const metric: Metric = metrics[id];
          return (
            <li key={id} className="relative" data-reveal={1 + i} data-metric={id}>
              <RailNode className="top-[1.1rem]" />
              <span aria-hidden="true" className="absolute left-[var(--rail-offset)] right-[calc(100%+0.5rem)] top-[calc(1.1rem+4px)] h-px bg-technical" />
              <p className={cn("font-display font-semibold leading-none tracking-[-0.045em] [font-stretch:112%]", narrowSize[id])}>
                {metric.value}
              </p>
              <p className="mt-2 text-base text-muted">{metric.label}</p>
            </li>
          );
        })}
        {scaleMetrics.improvement.map((id, i) => (
          <li key={id} className="relative" data-reveal={4 + i}>
            <RailNode className="top-[0.7rem]" />
            <span aria-hidden="true" className="absolute left-[var(--rail-offset)] right-[calc(100%+0.5rem)] top-[calc(0.7rem+4px)] h-px bg-technical" />
            <Improvement metric={metrics[id]} size="text-[1.45rem]" />
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ScaleScene() {
  return (
    <SceneShell
      id="scale"
      index="03"
      layer="enterprise"
      railLabel="System"
      labelledBy="scale-title"
      mobileRail="self"
    >
      <div className="pb-24 pt-28 lg:pb-28 lg:pt-16">
        <Label as="h2" id="scale-title" className="mb-10 lg:mb-6">
          {scale.label}
        </Label>
        <ScaleWide />
        <ScaleNarrow />
      </div>
    </SceneShell>
  );
}
