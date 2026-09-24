import type { SystemDiagram } from "@/content/types";
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
 * EXPANSION — a point solution became a connected project platform.
 *
 * Reads the project's workflow from content: column 0 is the original core,
 * column 1 the capabilities it grew into, column 2 external systems. Only
 * edges present in the data are drawn, in both geometries.
 *
 * Motion hooks: [data-stage=core] is visible first; [data-stage=expansion]
 * (spokes, modules, outer boundary) grows out of [data-junction=hub];
 * [data-stage=external] connects last through [data-junction=interface].
 */

const ORIGIN = "Started here";
const PLATFORM = "Connected project platform";

const annotation = { fontSize: 11.5, letterSpacing: "0.1em" } as const;

function split(diagram: SystemDiagram) {
  const [coreCol = [], modules = [], externals = []] = diagram.columns;
  const core = coreCol[0];
  const links = diagram.edges.filter(([from, to]) =>
    modules.some((m) => m.id === from) && externals.some((e) => e.id === to),
  );
  return { core, modules, externals, links };
}

/* ─── Wide: radial fan out of the original boundary ─────────────────────── */

const W = 700;
const H = 524;

function Wide({ diagram }: { diagram: SystemDiagram }) {
  const { core, modules, externals, links } = split(diagram);
  const cx = 130;
  const cy = 272;
  const coreW = labelWidth(core.label, 150);
  const inner = { x: cx - coreW / 2 - 16, y: cy - 46, w: coreW + 32, h: 92 };
  const hub = { x: inner.x + inner.w, y: cy };

  const radius = 250;
  const spread = 54;
  const modW = Math.max(...modules.map((m) => labelWidth(m.label, 120)));
  const placed = modules.map((m, i) => {
    const angle = modules.length === 1 ? 0 : -spread + (i * (2 * spread)) / (modules.length - 1);
    const rad = (angle * Math.PI) / 180;
    const mx = cx + radius * Math.cos(rad);
    const my = cy + radius * Math.sin(rad);
    const box = { x: mx - modW / 2, y: my - NODE_H / 2 };
    // Land the spoke on the face that points back toward the hub.
    const anchor =
      angle < -35
        ? { x: mx, y: box.y + NODE_H }
        : angle > 35
          ? { x: mx, y: box.y }
          : { x: box.x, y: my };
    return { ...m, mx, my, box, anchor };
  });

  const outerRight = Math.max(...placed.map((p) => p.box.x + modW)) + 16;
  const outer = { x: 14, y: 26, w: outerRight - 14, h: H - 26 - 12 };
  const extW = Math.max(96, ...externals.map((e) => labelWidth(e.label, 96)));
  const extX = W - extW - 4;

  return (
    <svg
      aria-hidden="true"
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto max-w-full"
      data-geometry="wide"
    >
      <g data-stage="expansion">
        <rect
          x={outer.x}
          y={outer.y}
          width={outer.w}
          height={outer.h}
          fill="none"
          className="stroke-technical/70"
          strokeDasharray="6 5"
        />
        <text x={outer.x} y={outer.y - 10} className="fill-technical font-mono uppercase" style={annotation}>
          {PLATFORM}
        </text>
        {placed.map((p) => (
          <Wire key={p.id} id={`${core.id}-${p.id}`} d={`M${hub.x} ${hub.y} L${p.anchor.x} ${p.anchor.y}`} />
        ))}
        {placed.map((p) => (
          <g key={p.id}>
            <Terminal x={p.anchor.x} y={p.anchor.y} />
            <SvgNode id={p.id} x={p.box.x} y={p.box.y} w={modW} label={p.label} />
          </g>
        ))}
      </g>

      <g data-stage="core">
        <rect
          x={inner.x}
          y={inner.y}
          width={inner.w}
          height={inner.h}
          className="fill-background stroke-accent/70"
          strokeDasharray="4 3"
        />
        <text x={inner.x} y={inner.y - 9} className="fill-accent font-mono uppercase" style={annotation}>
          {ORIGIN}
        </text>
        <SvgNode id={core.id} x={cx - coreW / 2} y={cy - NODE_H / 2} w={coreW} label={core.label} variant="core" />
        <Junction x={hub.x} y={hub.y} id="hub" />
      </g>

      <g data-stage="external">
        {externals.map((ext) => {
          const from = placed.find((p) => links.some(([f, t]) => f === p.id && t === ext.id));
          if (!from) return null;
          const y = from.my;
          return (
            <g key={ext.id}>
              <Wire id={`${from.id}-${ext.id}`} d={`M${from.box.x + modW} ${y} H${extX}`} />
              <Junction x={outer.x + outer.w} y={y} id="interface" />
              <Terminal x={extX} y={y} />
              <SvgNode id={ext.id} x={extX} y={y - NODE_H / 2} w={extW} label={ext.label} variant="external" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

/* ─── Narrow: the same system as a tree ──────────────────────────────────── */

const NW = 340;

function Narrow({ diagram }: { diagram: SystemDiagram }) {
  const { core, modules, externals, links } = split(diagram);
  const outer = { x: 2, y: 26 };
  const inner = { x: 14, y: 56 };
  const coreW = Math.min(labelWidth(core.label, 150), NW - 60);
  const coreBox = { x: inner.x + 12, y: inner.y + 12, w: coreW };
  const innerW = coreW + 24;
  const innerH = NODE_H + 24;
  const spineX = coreBox.x + 16;
  const modX = spineX + 24;
  const modW = NW - 18 - modX;
  const top = inner.y + innerH + 22;
  const step = NODE_H + 10;
  const mods = modules.map((m, i) => ({ ...m, y: top + i * step }));
  const lastMod = mods[mods.length - 1];
  const outerBottom = lastMod.y + NODE_H + 14;
  const extW = 110;
  const extY = outerBottom + 34;
  const height = extY + (externals.length ? NODE_H + 6 : 0);

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${NW} ${height}`}
      className="h-auto w-full max-w-[30rem]"
      data-geometry="narrow"
    >
      <g data-stage="expansion">
        <rect
          x={outer.x}
          y={outer.y}
          width={NW - 4}
          height={outerBottom - outer.y}
          fill="none"
          className="stroke-technical/70"
          strokeDasharray="6 5"
        />
        <text x={outer.x} y={outer.y - 10} className="fill-technical font-mono uppercase" style={annotation}>
          {PLATFORM}
        </text>
        <Wire id="spine" d={`M${spineX} ${coreBox.y + NODE_H} V${lastMod.y + NODE_H / 2}`} />
        {mods.map((m) => (
          <g key={m.id}>
            <Wire id={`${core.id}-${m.id}`} d={`M${spineX} ${m.y + NODE_H / 2} H${modX}`} />
            <Terminal x={modX} y={m.y + NODE_H / 2} />
            <SvgNode id={m.id} x={modX} y={m.y} w={modW} label={m.label} />
          </g>
        ))}
      </g>

      <g data-stage="core">
        <rect
          x={inner.x}
          y={inner.y}
          width={innerW}
          height={innerH}
          className="fill-background stroke-accent/70"
          strokeDasharray="4 3"
        />
        <text x={inner.x + innerW + 10} y={inner.y + innerH / 2} dominantBaseline="central" className="fill-accent font-mono uppercase" style={annotation}>
          {ORIGIN}
        </text>
        <SvgNode id={core.id} x={coreBox.x} y={coreBox.y} w={coreW} label={core.label} variant="core" />
        <Junction x={spineX} y={coreBox.y + NODE_H} id="hub" />
      </g>

      <g data-stage="external">
        {externals.map((ext) => {
          const from = mods.find((m) => links.some(([f, t]) => f === m.id && t === ext.id));
          if (!from) return null;
          const extX = (NW - extW) / 2;
          const ex = extX + extW / 2;
          // Straight down from the last capability; otherwise route down the
          // right-hand channel so it can't be mistaken for another link.
          const d =
            from === lastMod
              ? `M${ex} ${from.y + NODE_H} V${extY}`
              : `M${modX + modW} ${from.y + NODE_H / 2} H${NW - 8} V${outerBottom + 16} H${ex} V${extY}`;
          return (
            <g key={ext.id}>
              <Wire id={`${from.id}-${ext.id}`} d={d} />
              <Junction x={ex} y={outerBottom} id="interface" />
              <Terminal x={ex} y={extY} />
              <SvgNode id={ext.id} x={extX} y={extY} w={extW} label={ext.label} variant="external" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}

export function ExpansionDiagram({ diagram }: { diagram: SystemDiagram }) {
  const swap = layoutSwitch(W);
  return (
    <figure className="@container w-full">
      <div className={swap.wide}>
        <Wide diagram={diagram} />
      </div>
      <div className={swap.narrow}>
        <Narrow diagram={diagram} />
      </div>
      <figcaption className="sr-only">
        {diagram.title}. {describeDiagram(diagram)}
      </figcaption>
    </figure>
  );
}
