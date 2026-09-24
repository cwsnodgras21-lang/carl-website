import type { SystemDiagram } from "@/content/types";
import { describeDiagram } from "@/components/system/system-diagram";
import { cn } from "@/lib/cn";

/**
 * FLOW — work moving through an operation.
 *
 * A production line: a conveyor band with rollers, one gate per station
 * (from content, in order), direction marks between stations, and a single
 * part waiting at the start of the line.
 *
 * Built in HTML/CSS so the band can span any width while labels stay a
 * fixed, readable size. Wide on containers ≥ 48rem, vertical below.
 *
 * Motion hooks: [data-part] travels the band; [data-station] gates light as
 * it passes; [data-direction] marks can pulse along the flow.
 */

const band =
  "bg-[repeating-linear-gradient(to_right,var(--technical)_0_1px,transparent_1px_16px)] bg-[length:100%_60%] bg-center bg-no-repeat";
const bandVertical =
  "bg-[repeating-linear-gradient(to_bottom,var(--technical)_0_1px,transparent_1px_16px)] bg-[length:60%_100%] bg-center bg-no-repeat";

export function FlowDiagram({ diagram }: { diagram: SystemDiagram }) {
  const stations = diagram.columns.flat();

  return (
    <figure className="@container w-full" data-flow>
      {/* Wide: left → right */}
      <div className="hidden @3xl:block">
        <div className="relative pb-2 pt-1">
          <ol
            className="grid"
            style={{ gridTemplateColumns: `repeat(${stations.length}, minmax(0, 1fr))` }}
          >
            {stations.map((station, i) => (
              <li key={station.id} className="flex flex-col items-center text-center" data-station={station.id}>
                <span className="font-mono text-label-sm text-technical">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "mt-2 min-h-[2.8em] px-2 font-mono text-label uppercase",
                    station.core ? "text-foreground" : "text-foreground/80",
                  )}
                >
                  {station.label}
                </span>
                {/* Gate straddling the band */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative z-[1] mt-3 h-11 w-6 border bg-background",
                    station.core ? "border-accent" : "border-technical",
                  )}
                >
                  <span className={cn("absolute inset-x-1 top-1/2 h-px", station.core ? "bg-accent" : "bg-technical")} />
                </span>
              </li>
            ))}
          </ol>

          {/* Conveyor band: rails + rollers, full width, ending in an arrow. */}
          <div aria-hidden="true" className="absolute inset-x-0 bottom-[calc(0.5rem+1.375rem-7px)] h-[14px]">
            <div className={cn("absolute inset-y-0 left-0 right-3 border-y border-technical", band)} />
            <span className="absolute right-0 top-1/2 size-0 -translate-y-1/2 border-y-[9px] border-l-[13px] border-y-transparent border-l-technical" />
            {/* Direction marks between stations */}
            {stations.slice(0, -1).map((station, i) => (
              <span
                key={station.id}
                data-direction
                className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-1 font-mono text-sm leading-none text-accent"
                style={{ left: `${((i + 1) / stations.length) * 100}%` }}
              >
                ›
              </span>
            ))}
            {/* The part, waiting at the start of the line. */}
            <span
              data-part
              className="absolute left-2 top-1/2 size-3 -translate-y-1/2 bg-accent"
            />
          </div>
        </div>
      </div>

      {/* Narrow: top → bottom */}
      <div className="@3xl:hidden">
        <div className="relative pl-12">
          <div aria-hidden="true" className="absolute bottom-0 left-4 top-0 w-[14px]">
            <div className={cn("absolute inset-x-0 bottom-3 top-0 border-x border-technical", bandVertical)} />
            <span className="absolute bottom-0 left-1/2 size-0 -translate-x-1/2 border-x-[9px] border-t-[13px] border-x-transparent border-t-technical" />
            <span data-part className="absolute left-1/2 top-1 size-3 -translate-x-1/2 bg-accent" />
          </div>
          <ol className="flex flex-col gap-5 pb-8 pt-8">
            {stations.map((station, i) => (
              <li key={station.id} className="relative flex items-baseline gap-3" data-station={station.id}>
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute -left-[45px] top-1/2 z-[1] h-6 w-10 -translate-y-1/2 border bg-background",
                    station.core ? "border-accent" : "border-technical",
                  )}
                />
                <span className="font-mono text-label-sm text-technical">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "font-mono text-label uppercase",
                    station.core ? "text-foreground" : "text-foreground/80",
                  )}
                >
                  {station.label}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <figcaption className="sr-only">
        {diagram.title}. {describeDiagram(diagram)}
      </figcaption>
    </figure>
  );
}
