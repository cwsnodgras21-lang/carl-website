import { quickWins, type QuickWin } from "@/content/home";
import { getMetric } from "@/content/metrics";
import type { Metric } from "@/content/types";
import { SceneShell } from "@/components/system/scene-shell";
import { Display } from "@/components/ui/typography";
import { cn } from "@/lib/cn";

/**
 * Fast, compact transformations: OLD PROCESS → INTERVENTION → NEW PROCESS.
 * Same three-stage grammar on every row so the eye can scan down it quickly;
 * the connector between stages is the system line doing the work.
 *
 * Motion hooks: [data-quick-win] rows; [data-before], [data-via] (connector
 * draws), [data-after] resolves. Meant to run fast, row after row.
 */

function values(item: QuickWin, metric?: Metric) {
  return {
    before: item.before.value ?? metric?.before,
    after: item.after.value ?? metric?.after ?? metric?.value,
    qualifier: metric?.qualifier,
  };
}

function Stage({
  value,
  text,
  tone,
  qualifier,
  className,
}: {
  value?: string;
  text?: string;
  tone: "before" | "after";
  qualifier?: string;
  className?: string;
}) {
  return (
    <div className={className} data-before={tone === "before" || undefined} data-after={tone === "after" || undefined}>
      {value && (
        <p
          className={cn(
            "font-display text-[1.6rem] font-semibold leading-tight tracking-[-0.02em] [font-stretch:112%] lg:text-[1.9rem]",
            tone === "before" ? "text-muted" : "text-foreground",
          )}
        >
          {value}
        </p>
      )}
      {qualifier && (
        <p className="mt-1 font-mono text-label uppercase text-accent">{qualifier}</p>
      )}
      {text && (
        <p className={cn("text-base leading-snug", tone === "before" ? "text-muted" : "text-foreground/85", value && "mt-1")}>
          {text}
        </p>
      )}
    </div>
  );
}

/** Horizontal connector carrying the intervention label. */
function Via({ text }: { text: string }) {
  return (
    <div data-via className="relative flex flex-col justify-center">
      <p className="mb-3 text-sm leading-snug text-foreground/85">{text}</p>
      <span aria-hidden="true" data-via-line className="relative block h-px bg-accent">
        <span className="absolute -left-[3px] top-1/2 size-[7px] -translate-y-1/2 border border-accent bg-background" />
        <span className="absolute -right-px top-1/2 size-0 -translate-y-1/2 border-y-[5px] border-l-[8px] border-y-transparent border-l-accent" />
      </span>
    </div>
  );
}

export function QuickWinsScene() {
  return (
    <SceneShell
      id="quick-wins"
      index="07"
      layer="software"
      railLabel="Automation"
      labelledBy="qw-title"
    >
      <div className="pb-24 pt-24 md:pb-32 md:pt-32">
        <Display id="qw-title" className="max-w-[20ch]">
          {quickWins.heading}
        </Display>

        <ul className="mt-14 md:mt-16">
          {quickWins.items.map((item) => {
            const metric = item.metric ? getMetric(item.metric) : undefined;
            const v = values(item, metric);
            return (
              <li
                key={item.id}
                data-quick-win={item.id}
                className="border-t border-border py-7 lg:grid lg:grid-cols-[10rem_minmax(0,1fr)_minmax(13rem,1fr)_minmax(0,1fr)] lg:items-center lg:gap-x-10"
              >
                <h3 className="font-mono text-label uppercase text-technical">{item.label}</h3>

                {/* Phones/tablet: the three stages stacked on a short wire. */}
                <div className="relative mt-4 flex flex-col gap-3 border-l border-accent/80 pl-5 lg:hidden">
                  <Stage value={v.before} text={item.before.text} tone="before" />
                  <p data-via className="relative text-sm leading-snug text-foreground/85">
                    <span aria-hidden="true" className="absolute -left-[calc(1.25rem+4px)] top-[0.45em] size-[7px] border border-accent bg-background" />
                    <span aria-hidden="true" className="mr-2 font-mono text-accent">↳</span>
                    {item.via}
                  </p>
                  <Stage value={v.after} text={item.after.text} tone="after" qualifier={v.qualifier} />
                </div>

                {/* Desktop: left → right. */}
                <Stage value={v.before} text={item.before.text} tone="before" className="hidden lg:block" />
                <div className="hidden lg:block">
                  <Via text={item.via} />
                </div>
                <Stage value={v.after} text={item.after.text} tone="after" qualifier={v.qualifier} className="hidden lg:block" />
              </li>
            );
          })}
        </ul>
      </div>
    </SceneShell>
  );
}
