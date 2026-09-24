import type { DiagramNode, SystemDiagram as Diagram } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * Renders a conceptual system diagram from content.
 *
 * Desktop: an SVG schematic with orthogonal connectors.
 * Mobile:  the same columns re-flowed as top→bottom rows in HTML — a
 *          different geometry, not a shrunken SVG.
 * Screen readers get one plain-language description; both visual variants
 * are hidden from assistive tech.
 */

const NODE_H = 44;
const ROW_GAP = 18;
const PAD = 12;

type Placed = DiagramNode & { x: number; y: number; w: number };

function layout(diagram: Diagram) {
  const dense = diagram.columns.length > 5;
  const nodeW = dense ? 118 : 176;
  const colGap = dense ? 34 : 84;
  const tallest = Math.max(...diagram.columns.map((c) => c.length));
  const height = tallest * NODE_H + (tallest - 1) * ROW_GAP + PAD * 2;
  const width = diagram.columns.length * nodeW + (diagram.columns.length - 1) * colGap + PAD * 2;

  const nodes = new Map<string, Placed>();
  diagram.columns.forEach((column, c) => {
    const colHeight = column.length * NODE_H + (column.length - 1) * ROW_GAP;
    const top = (height - colHeight) / 2;
    column.forEach((node, r) => {
      nodes.set(node.id, {
        ...node,
        x: PAD + c * (nodeW + colGap),
        y: top + r * (NODE_H + ROW_GAP),
        w: nodeW,
      });
    });
  });

  return { nodes, width, height, colGap };
}

/** Orthogonal "schematic" connector from the right of a to the left of b. */
function connector(a: Placed, b: Placed, colGap: number) {
  const x1 = a.x + a.w;
  const y1 = a.y + NODE_H / 2;
  const x2 = b.x;
  const y2 = b.y + NODE_H / 2;
  const mid = x1 + colGap / 2;
  return {
    d: y1 === y2 ? `M${x1} ${y1} H${x2}` : `M${x1} ${y1} H${mid} V${y2} H${x2}`,
    x1,
    y1,
    x2,
    y2,
    mid,
  };
}

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
  const { nodes, width, height, colGap } = layout(diagram);

  return (
    <figure className={cn("w-full", className)}>
      {/* Desktop schematic */}
      <svg
        aria-hidden="true"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMinYMid meet"
        className="hidden h-auto w-full md:block"
        style={{ maxHeight: `${height * 1.4}px` }}
        data-diagram
      >
        <g fill="none" strokeWidth={1.25} className="stroke-technical">
          {diagram.edges.map(([from, to]) => {
            const a = nodes.get(from);
            const b = nodes.get(to);
            if (!a || !b) return null;
            const c = connector(a, b, colGap);
            return (
              <g key={`${from}-${to}`} data-edge={`${from}-${to}`}>
                <path d={c.d} />
                <circle cx={c.x2} cy={c.y2} r={2.5} className="fill-technical" stroke="none" />
                {diagram.flow && (
                  <rect
                    x={c.x1 + (c.x2 - c.x1) / 2 - 4}
                    y={c.y1 - 4}
                    width={8}
                    height={8}
                    className="fill-accent"
                    stroke="none"
                    data-part
                  />
                )}
              </g>
            );
          })}
        </g>
        {[...nodes.values()].map((node) => (
          <g key={node.id} data-node={node.id}>
            <rect
              x={node.x}
              y={node.y}
              width={node.w}
              height={NODE_H}
              className={cn(
                "fill-surface",
                node.core ? "stroke-accent" : "stroke-technical",
              )}
              strokeWidth={node.core ? 1.75 : 1}
            />
            <text
              x={node.x + node.w / 2}
              y={node.y + NODE_H / 2}
              dominantBaseline="central"
              textAnchor="middle"
              className={cn(
                "font-mono uppercase",
                node.core ? "fill-foreground" : "fill-muted",
              )}
              style={{ fontSize: 12, letterSpacing: "0.08em" }}
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>

      {/* Mobile flow: columns become rows */}
      <ol aria-hidden="true" className="flex flex-col items-center md:hidden">
        {diagram.columns.map((column, i) => (
          <li key={i} className="flex flex-col items-center">
            {i > 0 && (
              <span className="flex h-7 w-px flex-col items-center bg-technical">
                <span className="mt-auto size-1.5 translate-y-1 rounded-full bg-technical" />
              </span>
            )}
            <span className="flex flex-wrap justify-center gap-2">
              {column.map((node) => (
                <span
                  key={node.id}
                  className={cn(
                    "border bg-surface px-3 py-2 font-mono text-label uppercase",
                    node.core ? "border-accent text-foreground" : "border-technical/60 text-muted",
                  )}
                >
                  {node.label}
                </span>
              ))}
            </span>
          </li>
        ))}
      </ol>

      <figcaption className="sr-only">
        {diagram.title}. {describeDiagram(diagram)}
      </figcaption>
    </figure>
  );
}
