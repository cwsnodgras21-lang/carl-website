import type { SystemDiagram as Diagram } from "@/content/types";
import { cn } from "@/lib/cn";
import {
  labelWidth,
  layoutSwitch,
  NODE_H,
  SvgNode,
  Terminal,
  Wire,
} from "./svg-primitives";

/**
 * Generic conceptual system diagram, driven entirely by content.
 *
 * Wide geometry: columns left→right with orthogonal connectors.
 * Narrow geometry: layers top→bottom; a layer too wide for one row becomes a
 *   stack on a spine. Every edge from the data is drawn in both geometries,
 *   so they always say the same thing.
 * Screen readers get one plain-language description.
 *
 * Homepage flagship scenes use bespoke compositions; this is used by case
 * studies and anywhere a diagram doesn't need its own composition.
 */

type Box = { id: string; label: string; core?: boolean; x: number; y: number; w: number };

/* ─── Wide (left → right) ───────────────────────────────────────────────── */

const COL_GAP = 64;
const ROW_GAP = 18;
const PAD = 8;

function wideLayout(diagram: Diagram) {
  const widths = diagram.columns.map((column) =>
    Math.max(...column.map((node) => labelWidth(node.label, 110))),
  );
  const tallest = Math.max(...diagram.columns.map((c) => c.length));
  const height = tallest * NODE_H + (tallest - 1) * ROW_GAP + PAD * 2;
  const width = widths.reduce((sum, w) => sum + w, 0) + COL_GAP * (widths.length - 1) + PAD * 2;

  const boxes = new Map<string, Box & { col: number }>();
  let x = PAD;
  diagram.columns.forEach((column, c) => {
    const colHeight = column.length * NODE_H + (column.length - 1) * ROW_GAP;
    const top = (height - colHeight) / 2;
    column.forEach((node, r) => {
      boxes.set(node.id, { ...node, x, y: top + r * (NODE_H + ROW_GAP), w: widths[c], col: c });
    });
    x += widths[c] + COL_GAP;
  });
  return { boxes, width, height };
}

function WideDiagram({ diagram }: { diagram: Diagram }) {
  const { boxes, width, height } = wideLayout(diagram);
  return (
    <svg
      aria-hidden="true"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto max-w-full"
      data-geometry="wide"
    >
      {diagram.edges.map(([from, to]) => {
        const a = boxes.get(from);
        const b = boxes.get(to);
        if (!a || !b) return null;
        const x1 = a.x + a.w;
        const y1 = a.y + NODE_H / 2;
        const x2 = b.x;
        const y2 = b.y + NODE_H / 2;
        const mid = x1 + COL_GAP / 2;
        const d = y1 === y2 ? `M${x1} ${y1} H${x2}` : `M${x1} ${y1} H${mid} V${y2} H${x2}`;
        return (
          <g key={`${from}-${to}`} data-edge={`${from}-${to}`}>
            <Wire id={`${from}-${to}`} d={d} />
            <Terminal x={x2} y={y2} />
            {diagram.flow && (
              <rect
                data-part
                x={x1 + (x2 - x1) / 2 - 4}
                y={y1 - 4}
                width={8}
                height={8}
                className="fill-accent"
              />
            )}
          </g>
        );
      })}
      {[...boxes.values()].map((box) => (
        <SvgNode
          key={box.id}
          id={box.id}
          x={box.x}
          y={box.y}
          w={box.w}
          label={box.label}
          variant={box.core ? "core" : "default"}
        />
      ))}
    </svg>
  );
}

/* ─── Narrow (top → bottom) ─────────────────────────────────────────────── */

const N_W = 340;
const N_GAP = 10;
const N_LAYER_GAP = 40;
const N_SPINE_X = 16;
const N_STACK_X = 36;
const N_CHANNEL_X = N_W - 10;

type Layer = { kind: "row" | "stack"; top: number; bottom: number; boxes: Box[] };

function narrowLayout(diagram: Diagram) {
  const layers: Layer[] = [];
  let y = 6;
  for (const column of diagram.columns) {
    const widths = column.map((n) => labelWidth(n.label, 84));
    const rowWidth = widths.reduce((s, w) => s + w, 0) + N_GAP * (column.length - 1);
    if (column.length <= 3 && rowWidth <= N_W - 12) {
      let x = (N_W - rowWidth) / 2;
      const boxes = column.map((n, i) => {
        const box = { ...n, x, y, w: widths[i] };
        x += widths[i] + N_GAP;
        return box;
      });
      layers.push({ kind: "row", top: y, bottom: y + NODE_H, boxes });
      y += NODE_H + N_LAYER_GAP;
    } else {
      const w = N_CHANNEL_X - 14 - N_STACK_X;
      const boxes = column.map((n, i) => ({ ...n, x: N_STACK_X, y: y + i * (NODE_H + N_GAP), w }));
      const bottom = y + column.length * (NODE_H + N_GAP) - N_GAP;
      layers.push({ kind: "stack", top: y, bottom, boxes });
      y = bottom + N_LAYER_GAP;
    }
  }
  const find = (id: string) => {
    for (let i = 0; i < layers.length; i++) {
      const box = layers[i].boxes.find((b) => b.id === id);
      if (box) return { box, layer: layers[i], index: i };
    }
  };
  return { layers, find, height: y - N_LAYER_GAP + 6 };
}

function NarrowDiagram({ diagram }: { diagram: Diagram }) {
  const { layers, find, height } = narrowLayout(diagram);
  const wires = diagram.edges.flatMap(([from, to]) => {
    const a = find(from);
    const b = find(to);
    if (!a || !b) return [];
    const channel = a.layer.bottom + N_LAYER_GAP / 2;
    const bx = b.box.x + b.box.w / 2;
    let d: string;
    let end: [number, number];
    if (a.layer.kind === "row" && b.layer.kind === "stack") {
      // Down from the source, onto the spine, branch into the target.
      const ax = a.box.x + a.box.w / 2;
      const ty = b.box.y + NODE_H / 2;
      d = `M${ax} ${a.box.y + NODE_H} V${channel} H${N_SPINE_X} V${ty} H${b.box.x}`;
      end = [b.box.x, ty];
    } else if (a.layer.kind === "stack") {
      // Out of the source's right side, down the channel, into the target.
      const ay = a.box.y + NODE_H / 2;
      const approach = b.layer.top - N_LAYER_GAP / 2;
      d = `M${a.box.x + a.box.w} ${ay} H${N_CHANNEL_X} V${approach} H${bx} V${b.box.y}`;
      end = [bx, b.box.y];
    } else {
      const ax = a.box.x + a.box.w / 2;
      d = `M${ax} ${a.box.y + NODE_H} V${channel} H${bx} V${b.box.y}`;
      end = [bx, b.box.y];
    }
    return [{ id: `${from}-${to}`, d, end }];
  });

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 ${N_W} ${height}`}
      className="h-auto w-full max-w-[30rem]"
      data-geometry="narrow"
    >
      {wires.map((wire) => (
        <g key={wire.id} data-edge={wire.id}>
          <Wire id={wire.id} d={wire.d} />
          <Terminal x={wire.end[0]} y={wire.end[1]} />
        </g>
      ))}
      {layers.flatMap((layer) =>
        layer.boxes.map((box) => (
          <SvgNode
            key={box.id}
            id={box.id}
            x={box.x}
            y={box.y}
            w={box.w}
            label={box.label}
            variant={box.core ? "core" : "default"}
          />
        )),
      )}
    </svg>
  );
}

/* ─── Public component ──────────────────────────────────────────────────── */

export function describeDiagram(diagram: Diagram) {
  const label = (id: string) =>
    diagram.columns.flat().find((n) => n.id === id)?.label ?? id;
  const bySource = new Map<string, string[]>();
  for (const [from, to] of diagram.edges) {
    bySource.set(from, [...(bySource.get(from) ?? []), label(to)]);
  }
  return [...bySource.entries()]
    .map(([from, targets]) => `${label(from)} connects to ${targets.join(", ")}.`)
    .join(" ");
}

export function SystemDiagram({
  diagram,
  className,
}: {
  diagram: Diagram;
  className?: string;
}) {
  const { width } = wideLayout(diagram);
  const swap = layoutSwitch(width);

  return (
    <figure className={cn("@container w-full", className)}>
      <div className={swap.wide}>
        <WideDiagram diagram={diagram} />
      </div>
      <div className={swap.narrow}>
        <NarrowDiagram diagram={diagram} />
      </div>
      <figcaption className="sr-only">
        {diagram.title}. {describeDiagram(diagram)}
      </figcaption>
    </figure>
  );
}
