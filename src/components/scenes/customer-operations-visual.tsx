import type { Metric, SystemDiagram } from "@/content/types";
import { describeDiagram } from "@/components/system/system-diagram";
import {
  Junction,
  labelWidth,
  layoutSwitch,
  NODE_H,
  SvgNode,
  Terminal,
  Wire,
} from "@/components/system/svg-primitives";

/**
 * CONVERGENCE — scattered information arrives at the person doing the work,
 * then the resulting workflow branches out.
 *
 * Content columns: 0 = sources, 1 = the person (core), 2 = the workflow
 * record, 3 = where it branches. Sources are drawn as stacked sheets and
 * deliberately misaligned; every source wire lands on one junction.
 * The spare-parts total is attached to the node it belongs to, with its
 * breakdown directly beneath — a callout, not a second headline reveal.
 *
 * Motion hooks: [data-stage=sources] → wires converge on
 * [data-junction=converge] → [data-stage=workflow] branches out →
 * [data-callout] appears last.
 */

const annotation = { fontSize: 11.5, letterSpacing: "0.1em" } as const;
const FOCUS = "One screen";

function split(diagram: SystemDiagram) {
  const [sources = [], coreCol = [], middle = [], branches = []] = diagram.columns;
  const has = (from: string, to: string) =>
    diagram.edges.some(([f, t]) => f === from && t === to);
  return { sources, core: coreCol[0], record: middle[0], branches, has };
}

function Callout({ metric, className }: { metric: Metric; className?: string }) {
  return (
    <div data-callout className={className}>
      <p className="font-display text-display-md font-semibold [font-stretch:112%]">{metric.value}</p>
      <p className="mt-1 text-base text-muted">{metric.label}</p>
      {metric.parts && (
        <dl className="mt-4 flex flex-col gap-2 border-l border-technical pl-4">
          {metric.parts.map((part) => (
            <div key={part.label} className="flex items-baseline gap-3">
              <dt className="order-2 text-sm text-muted">{part.label}</dt>
              <dd className="order-1 min-w-[5.5rem] font-semibold text-foreground">{part.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/* ─── Wide ──────────────────────────────────────────────────────────────── */

const W = 850;
const SHELF_Y = 330;

function Wide({ diagram, attachTo }: { diagram: SystemDiagram; attachTo: string }) {
  const { sources, core, record, branches, has } = split(diagram);
  const srcW = Math.max(...sources.map((s) => labelWidth(s.label, 124)));
  const offsets = [0, 34, 10, 22, 4];
  const midY = 171;
  const srcGap = 116;
  const srcTop = midY - ((sources.length - 1) * srcGap) / 2 - NODE_H / 2;
  const src = sources.map((s, i) => ({ ...s, x: offsets[i % offsets.length], y: srcTop + i * srcGap }));

  const convergeX = 292;
  const coreW = Math.max(200, labelWidth(core.label));
  const coreH = 56;
  const coreX = convergeX + 22;
  const recW = Math.max(110, labelWidth(record.label));
  const recX = coreX + coreW + 50;
  const splitX = recX + recW + 32;
  const brW = Math.max(...branches.map((b) => labelWidth(b.label, 120)));
  const brX = W - brW - 2;
  const brGap = 160;
  const brTop = midY - ((branches.length - 1) * brGap) / 2 - NODE_H / 2;
  const br = branches.map((b, i) => ({ ...b, y: brTop + i * brGap }));
  const anchor = br.find((b) => b.id === attachTo);

  return (
    <svg aria-hidden="true" width={W} height={SHELF_Y + 2} viewBox={`0 0 ${W} ${SHELF_Y + 2}`} className="h-auto max-w-full" data-geometry="wide">
      <g data-stage="sources">
        {src.map((s) =>
          has(s.id, core.id) ? (
            <Wire
              key={`w-${s.id}`}
              id={`${s.id}-${core.id}`}
              d={`M${s.x + srcW} ${s.y + NODE_H / 2} C${s.x + srcW + 110} ${s.y + NODE_H / 2} ${convergeX - 90} ${midY} ${convergeX} ${midY}`}
            />
          ) : null,
        )}
        {src.map((s) => (
          <SvgNode key={s.id} id={s.id} x={s.x} y={s.y} w={srcW} label={s.label} variant="source" />
        ))}
      </g>

      <Junction x={convergeX} y={midY} id="converge" />
      <Wire id="converge-core" d={`M${convergeX + 4.5} ${midY} H${coreX}`} />
      <SvgNode id={core.id} x={coreX} y={midY - coreH / 2} w={coreW} h={coreH} label={core.label} variant="core" />
      <text x={coreX + coreW / 2} y={midY + coreH / 2 + 20} textAnchor="middle" className="fill-accent font-mono uppercase" style={annotation}>
        {FOCUS}
      </text>

      <g data-stage="workflow">
        {has(core.id, record.id) && (
          <>
            <Wire id={`${core.id}-${record.id}`} d={`M${coreX + coreW} ${midY} H${recX}`} />
            <Terminal x={recX} y={midY} />
          </>
        )}
        <SvgNode id={record.id} x={recX} y={midY - NODE_H / 2} w={recW} label={record.label} />
        {br.map((b) =>
          has(record.id, b.id) ? (
            <g key={`w-${b.id}`}>
              <Wire id={`${record.id}-${b.id}`} d={`M${recX + recW} ${midY} H${splitX} V${b.y + NODE_H / 2} H${brX}`} />
              <Terminal x={brX} y={b.y + NODE_H / 2} />
            </g>
          ) : null,
        )}
        <Junction x={splitX} y={midY} id="branch" />
        {br.map((b) => (
          <SvgNode key={b.id} id={b.id} x={brX} y={b.y} w={brW} label={b.label} />
        ))}
      </g>

      {anchor && (
        <g data-callout-leader>
          <Wire id="callout" d={`M${brX + brW / 2} ${anchor.y + NODE_H} V${SHELF_Y}`} dash="3 3" />
          <path d={`M${W - 280} ${SHELF_Y} H${W}`} className="stroke-technical" strokeWidth={1} />
          <circle cx={brX + brW / 2} cy={SHELF_Y} r={2.75} className="fill-technical" />
        </g>
      )}
    </svg>
  );
}

/* ─── Narrow ────────────────────────────────────────────────────────────── */

const NW = 340;

function Narrow({ diagram, attachTo }: { diagram: SystemDiagram; attachTo: string }) {
  const { sources, core, record, branches, has } = split(diagram);
  const gap = 8;
  const srcW = (NW - 8 - gap * (sources.length - 1)) / sources.length;
  const src = sources.map((s, i) => ({ ...s, x: i * (srcW + gap), y: 10 }));
  const cx = NW / 2;
  const convergeY = 96;
  const coreW = 230;
  const coreH = 50;
  const coreY = convergeY + 18;
  const recW = 120;
  const recY = coreY + coreH + 44;
  const splitY = recY + NODE_H + 22;
  const brW = 128;
  const brY = splitY + 22;
  const brXs = branches.map((_, i) => (branches.length === 1 ? cx - brW / 2 : i === 0 ? 20 : NW - brW - 20));
  const anchorIndex = branches.findIndex((b) => b.id === attachTo);
  const shelfY = brY + NODE_H + 26;

  return (
    <svg aria-hidden="true" viewBox={`0 0 ${NW} ${shelfY + 2}`} className="h-auto w-full max-w-[30rem]" data-geometry="narrow">
      <g data-stage="sources">
        {src.map((s) => {
          const sx = s.x + srcW / 2;
          return has(s.id, core.id) ? (
            <Wire key={`w-${s.id}`} id={`${s.id}-${core.id}`} d={`M${sx} ${s.y + NODE_H} C${sx} ${s.y + NODE_H + 30} ${cx} ${convergeY - 26} ${cx} ${convergeY}`} />
          ) : null;
        })}
        {src.map((s) => (
          <SvgNode key={s.id} id={s.id} x={s.x} y={s.y} w={srcW} label={s.label} variant="source" />
        ))}
      </g>
      <Junction x={cx} y={convergeY} id="converge" />
      <Wire id="converge-core" d={`M${cx} ${convergeY + 4.5} V${coreY}`} />
      <SvgNode id={core.id} x={cx - coreW / 2} y={coreY} w={coreW} h={coreH} label={core.label} variant="core" />
      <text x={cx - coreW / 2} y={coreY + coreH + 18} className="fill-accent font-mono uppercase" style={annotation}>
        {FOCUS}
      </text>

      <g data-stage="workflow">
        {has(core.id, record.id) && <Wire id={`${core.id}-${record.id}`} d={`M${cx} ${coreY + coreH} V${recY}`} />}
        <SvgNode id={record.id} x={cx - recW / 2} y={recY} w={recW} label={record.label} />
        <Junction x={cx} y={splitY} id="branch" />
        {branches.map((b, i) =>
          has(record.id, b.id) ? (
            <Wire key={`w-${b.id}`} id={`${record.id}-${b.id}`} d={`M${cx} ${recY + NODE_H} V${splitY} H${brXs[i] + brW / 2} V${brY}`} />
          ) : null,
        )}
        {branches.map((b, i) => (
          <SvgNode key={b.id} id={b.id} x={brXs[i]} y={brY} w={brW} label={b.label} />
        ))}
      </g>

      {anchorIndex >= 0 && (
        <g data-callout-leader>
          <Wire id="callout" d={`M${brXs[anchorIndex] + brW / 2} ${brY + NODE_H} V${shelfY}`} dash="3 3" />
          <path d={`M0 ${shelfY} H${NW}`} className="stroke-technical" strokeWidth={1} />
          <circle cx={brXs[anchorIndex] + brW / 2} cy={shelfY} r={2.75} className="fill-technical" />
        </g>
      )}
    </svg>
  );
}

export function ConvergenceDiagram({
  diagram,
  metric,
  attachTo,
}: {
  diagram: SystemDiagram;
  /** The total to attach, and the node it belongs to. */
  metric: Metric;
  attachTo: string;
}) {
  const swap = layoutSwitch(W);
  return (
    <figure className="@container w-full">
      <div className={swap.wide}>
        <div style={{ width: W }} className="max-w-full">
          <Wide diagram={diagram} attachTo={attachTo} />
          <Callout metric={metric} className="ml-auto mt-4 w-[280px]" />
        </div>
      </div>
      <div className={swap.narrow}>
        <div className="max-w-[30rem]">
          <Narrow diagram={diagram} attachTo={attachTo} />
          <Callout metric={metric} className="mt-4" />
        </div>
      </div>
      <figcaption className="sr-only">
        {diagram.title}. {describeDiagram(diagram)}
      </figcaption>
    </figure>
  );
}
