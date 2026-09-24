import type { Ref } from "react";
import { cn } from "@/lib/cn";

/**
 * INPUT → SYSTEM → OUTPUT as a line of stage nodes. Left → right from md,
 * top → bottom on phones. `reached` is the latest stage the run has got to
 * (-1 before it starts). The copper [data-signal] is moved between the
 * [data-stage-node] markers by the demo motion while a run is live.
 */
export function Pipeline({
  stages,
  reached,
  running,
  label,
  ref,
}: {
  stages: readonly string[];
  reached: number;
  running: boolean;
  label: string;
  ref?: Ref<HTMLOListElement>;
}) {
  return (
    <ol
      ref={ref}
      aria-label={label}
      className="relative flex flex-col gap-3 md:grid md:gap-0"
      style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}
    >
      <span
        aria-hidden="true"
        data-signal
        className={cn(
          "pointer-events-none absolute left-0 top-0 z-[2] size-[9px] bg-accent",
          running ? "opacity-100" : "opacity-0",
        )}
      />
      {stages.map((stage, i) => {
        const status = i < reached ? "done" : i === reached ? "active" : "pending";
        const last = i === stages.length - 1;
        return (
          <li
            key={stage}
            data-status={status}
            aria-current={status === "active" ? "step" : undefined}
            className="group relative pl-6 md:pl-0 md:pr-3 md:pt-6"
          >
            {!last && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-[4px] top-1/2 h-[calc(100%+0.75rem)] w-px transition-colors duration-300",
                  "md:left-[9px] md:right-0 md:top-[4px] md:h-px md:w-auto",
                  i < reached ? "bg-accent" : "bg-border",
                )}
              />
            )}
            <span
              aria-hidden="true"
              data-stage-node
              className={cn(
                "absolute left-0 top-1/2 z-[1] size-[9px] -translate-y-1/2 border transition-colors duration-300 md:top-0 md:translate-y-0",
                status === "pending" && "border-technical bg-background",
                status === "done" && "border-accent bg-background",
                status === "active" && "border-accent bg-accent",
              )}
            />
            <span className="flex items-baseline gap-2 md:flex-col md:gap-1">
              <span className="font-mono text-label-sm text-muted">{String(i + 1).padStart(2, "0")}</span>
              <span
                className={cn(
                  "font-mono text-label uppercase transition-colors duration-300",
                  status === "pending" ? "text-muted" : status === "active" ? "text-accent" : "text-foreground",
                )}
              >
                {stage}
              </span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
