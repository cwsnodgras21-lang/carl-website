import { cn } from "@/lib/cn";

/**
 * The original connection: one node, one wire. Opens the homepage and
 * closes it. The wire turns into the system rail — downward out of the hero,
 * upward into the closing scene — on every breakpoint. Place inside a
 * SceneShell with `rail="none"`; the scene must clip overflow.
 *
 * Motion hooks: [data-wire] draws from the origin; [data-drop] is the turn
 * into the rail; [data-terminal] is where the wire ends.
 */
export function Connection({
  direction,
  className,
}: {
  direction: "down" | "up";
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("relative h-px w-full", className)} data-connection={direction}>
      {/* Rail continuation */}
      <span
        data-drop
        className={cn(
          "absolute left-[var(--rail-offset)] w-px -translate-x-1/2 bg-muted/70",
          direction === "down" ? "top-0 h-[200svh]" : "bottom-0 h-[200svh]",
        )}
      />
      {/* Wire */}
      <span
        data-wire
        className="absolute left-[var(--rail-offset)] right-[18%] top-0 h-px bg-muted/70"
      />
      {/* Origin node */}
      <span
        data-origin
        className="absolute left-[var(--rail-offset)] top-0 size-[9px] -translate-x-1/2 -translate-y-1/2 bg-accent"
      />
      {/* Terminal */}
      <span
        data-terminal
        className="absolute right-[18%] top-0 size-[11px] translate-x-1/2 -translate-y-1/2 rounded-full border border-muted bg-background"
      />
    </div>
  );
}
