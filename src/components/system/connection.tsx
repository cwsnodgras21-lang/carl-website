import { cn } from "@/lib/cn";

/**
 * The original connection: one node, one wire. Opens the homepage and
 * closes it. On desktop the wire turns into the page rail — downward from
 * the hero, upward into the closing scene. Place inside a SceneShell content
 * column with `rail="none"`; the scene must clip overflow.
 */
export function Connection({
  direction,
  className,
}: {
  direction: "down" | "up";
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("relative h-px w-full", className)} data-connection>
      {/* Rail continuation (desktop) */}
      <span
        className={cn(
          "absolute hidden w-px bg-muted/60 md:block",
          "left-[calc(-1*var(--rail)+0.75rem)]",
          direction === "down" ? "top-0 h-[200svh]" : "bottom-0 h-[200svh]",
        )}
      />
      {/* Wire */}
      <span
        className="absolute left-0 right-[18%] top-0 h-px bg-muted/60 md:left-[calc(-1*var(--rail)+0.75rem)]"
        data-wire
      />
      {/* Origin node */}
      <span className="absolute left-0 top-0 size-[9px] -translate-x-1/2 -translate-y-1/2 bg-accent md:left-[calc(-1*var(--rail)+0.75rem)]" />
      {/* Terminal */}
      <span className="absolute right-[18%] top-0 size-[11px] translate-x-1/2 -translate-y-1/2 rounded-full border border-muted bg-background" />
    </div>
  );
}
