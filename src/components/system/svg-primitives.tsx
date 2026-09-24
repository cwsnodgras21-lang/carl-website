import { cn } from "@/lib/cn";

/**
 * Shared vocabulary for every system drawing: nodes, wires, junctions.
 *
 * Diagrams render at their natural pixel size (never scaled up), so labels
 * are the same size in every diagram. When a container is too narrow for a
 * diagram's wide geometry, the diagram switches to its narrow geometry via a
 * container query instead of shrinking.
 *
 * Motion hooks (Phase 4): nodes carry [data-node], wires carry [data-wire].
 * Solid wires get pathLength=1 so they can be drawn with one dash offset.
 * Dashed wires can't (pathLength rescales the dash pattern too); draw those
 * through a mask instead.
 */

export const LABEL_PX = 12.5;
/** JetBrains Mono advance (0.6em) + 0.08em tracking. */
const CHAR_PX = LABEL_PX * 0.68;
export const NODE_H = 42;

export const labelWidth = (label: string, min = 96) =>
  Math.max(min, Math.ceil(label.length * CHAR_PX + 30));

export type NodeVariant = "default" | "core" | "external" | "source";

export function SvgNode({
  id,
  x,
  y,
  w,
  h = NODE_H,
  label,
  variant = "default",
}: {
  id: string;
  x: number;
  y: number;
  w: number;
  h?: number;
  label: string;
  variant?: NodeVariant;
}) {
  return (
    <g data-node={id} data-variant={variant}>
      {variant === "source" && (
        <rect
          x={x + 5}
          y={y - 5}
          width={w}
          height={h}
          className="fill-background stroke-technical/60"
          strokeWidth={1}
        />
      )}
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        className={cn(
          "fill-surface",
          variant === "core" ? "stroke-accent" : "stroke-technical",
        )}
        strokeWidth={variant === "core" ? 1.75 : 1.1}
        strokeDasharray={variant === "external" ? "5 4" : undefined}
      />
      <text
        x={x + w / 2}
        y={y + h / 2}
        dominantBaseline="central"
        textAnchor="middle"
        className={cn(
          "font-mono uppercase",
          variant === "core" ? "fill-foreground" : "fill-foreground/80",
        )}
        style={{ fontSize: LABEL_PX, letterSpacing: "0.08em" }}
      >
        {label}
      </text>
    </g>
  );
}

export function Wire({
  id,
  d,
  className,
  dash,
  width = 1.25,
}: {
  id: string;
  d: string;
  className?: string;
  dash?: string;
  width?: number;
}) {
  return (
    <path
      d={d}
      data-wire={id}
      pathLength={dash ? undefined : 1}
      fill="none"
      strokeWidth={width}
      strokeDasharray={dash}
      className={cn("stroke-technical", className)}
    />
  );
}

/** A small filled dot where a wire lands on something. */
export function Terminal({ x, y, className }: { x: number; y: number; className?: string }) {
  return <circle cx={x} cy={y} r={2.75} className={cn("fill-technical", className)} />;
}

/** A small square node where wires meet. */
export function Junction({
  x,
  y,
  id,
  className,
}: {
  x: number;
  y: number;
  id: string;
  className?: string;
}) {
  return (
    <rect
      data-junction={id}
      x={x - 4.5}
      y={y - 4.5}
      width={9}
      height={9}
      className={cn("fill-background stroke-foreground", className)}
      strokeWidth={1}
    />
  );
}

/**
 * Container-query switch between a wide and a narrow geometry. Thresholds
 * are fixed class names (Tailwind needs them literally) chosen from the
 * wide drawing's natural width.
 */
const switches = [
  { max: 576, wide: "hidden @xl:block", narrow: "@xl:hidden" },
  { max: 672, wide: "hidden @2xl:block", narrow: "@2xl:hidden" },
  { max: 768, wide: "hidden @3xl:block", narrow: "@3xl:hidden" },
  { max: 896, wide: "hidden @4xl:block", narrow: "@4xl:hidden" },
  { max: 1024, wide: "hidden @5xl:block", narrow: "@5xl:hidden" },
  { max: 1152, wide: "hidden @6xl:block", narrow: "@6xl:hidden" },
] as const;

/**
 * Pick the switch for a wide drawing of `width` px. Allows the wide drawing
 * to shrink by at most ~12% before falling back to the narrow geometry.
 */
export function layoutSwitch(width: number) {
  return (
    switches.find((s) => width * 0.88 <= s.max) ?? switches[switches.length - 1]
  );
}
