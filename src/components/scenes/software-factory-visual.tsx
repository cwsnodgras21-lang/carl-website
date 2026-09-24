import type { DiagramNode } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * FAST, BUT CONTROLLED — the AI-assisted pipeline runs inside a governed
 * enclosure. Governance is the structure, not a footnote: copper guardrails
 * above and below carry the rules, a post drops from each rail to every
 * stage, and only the final stage leaves the enclosure.
 *
 * Motion hooks: [data-stage] nodes activate in order; [data-guardrail]
 * rails and [data-post] checkpoints stay lit throughout; [data-exit] is the
 * shipped output leaving the system.
 */

function Rail({ items, side }: { items: string[]; side: "top" | "bottom" }) {
  return (
    <div data-guardrail={side} className="relative flex h-9 items-center justify-around">
      <span aria-hidden="true" className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-accent" />
      {items.map((item) => (
        <span
          key={item}
          className="relative flex items-center gap-2 bg-background px-3 font-mono text-label uppercase text-foreground"
        >
          <span aria-hidden="true" className="size-[7px] bg-accent" />
          {item}
        </span>
      ))}
    </div>
  );
}

function Posts({ count }: { count: number }) {
  return (
    <div aria-hidden="true" className="grid h-7" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
      {Array.from({ length: count }, (_, i) => (
        <span key={i} data-post className="mx-auto h-full w-px bg-[repeating-linear-gradient(to_bottom,var(--accent)_0_3px,transparent_3px_6px)]" />
      ))}
    </div>
  );
}

export function GovernedPipeline({
  stages,
  governance,
  title,
}: {
  stages: DiagramNode[];
  governance: string[];
  title: string;
}) {
  const half = Math.ceil(governance.length / 2);
  const above = governance.slice(0, half);
  const below = governance.slice(half);

  return (
    <figure className="@container w-full">
      {/* Wide */}
      <div className="hidden @3xl:block">
        <div className="relative border-l-2 border-accent pr-8">
          <Rail items={above} side="top" />
          <Posts count={stages.length} />
          <ol
            className="relative grid"
            style={{ gridTemplateColumns: `repeat(${stages.length}, minmax(0, 1fr))` }}
          >
            <span aria-hidden="true" className="absolute left-0 right-[-2.5rem] top-1/2 h-px bg-technical" />
            <span data-exit aria-hidden="true" className="absolute right-[-2.5rem] top-1/2 size-0 -translate-y-1/2 border-y-[6px] border-l-[10px] border-y-transparent border-l-accent" />
            {stages.map((stage) => (
              <li key={stage.id} className="relative flex justify-center" data-stage={stage.id}>
                <span
                  className={cn(
                    "relative border bg-background px-3 py-2.5 font-mono text-label uppercase",
                    stage.core ? "border-accent text-foreground" : "border-technical text-foreground/85",
                  )}
                >
                  {stage.label}
                </span>
              </li>
            ))}
          </ol>
          <Posts count={stages.length} />
          <Rail items={below} side="bottom" />
        </div>
      </div>

      {/* Narrow */}
      <div className="@3xl:hidden">
        <ul data-guardrail="top" className="flex flex-col gap-2 pb-3">
          {above.map((item) => (
            <li key={item} className="flex items-center gap-3 font-mono text-label uppercase text-foreground">
              <span aria-hidden="true" className="size-[7px] bg-accent" />
              {item}
            </li>
          ))}
        </ul>
        <div className="relative border-x-2 border-t-2 border-accent px-6 pb-10 pt-6">
          <span aria-hidden="true" className="absolute bottom-0 left-1/2 top-6 w-px -translate-x-1/2 bg-technical" />
          <span data-exit aria-hidden="true" className="absolute -bottom-2 left-1/2 size-0 -translate-x-1/2 border-x-[6px] border-t-[10px] border-x-transparent border-t-accent" />
          <ol className="relative flex flex-col items-center gap-4">
            {stages.map((stage) => (
              <li key={stage.id} data-stage={stage.id} className="relative flex w-full justify-center">
                <span aria-hidden="true" data-post className="absolute left-[-1.5rem] right-[-1.5rem] top-1/2 h-px bg-[repeating-linear-gradient(to_right,var(--accent)_0_3px,transparent_3px_6px)] opacity-60" />
                <span
                  className={cn(
                    "relative min-w-[8.5rem] border bg-background px-3 py-2 text-center font-mono text-label uppercase",
                    stage.core ? "border-accent text-foreground" : "border-technical text-foreground/85",
                  )}
                >
                  {stage.label}
                </span>
              </li>
            ))}
          </ol>
        </div>
        <ul data-guardrail="bottom" className="flex flex-col gap-2 pt-5">
          {below.map((item) => (
            <li key={item} className="flex items-center gap-3 font-mono text-label uppercase text-foreground">
              <span aria-hidden="true" className="size-[7px] bg-accent" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <figcaption className="sr-only">
        {title}: {stages.map((s) => s.label).join(", then ")}. Every stage runs inside{" "}
        {governance.join(", ")}.
      </figcaption>
    </figure>
  );
}
