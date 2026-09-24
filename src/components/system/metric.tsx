import type { Metric } from "@/content/types";
import { cn } from "@/lib/cn";

/** A metric's headline figure: a value, or a before → after transformation. */
export function MetricFigure({
  metric,
  className,
}: {
  metric: Metric;
  className?: string;
}) {
  if (metric.before && metric.after) {
    return (
      <span className={cn("inline-flex flex-wrap items-baseline gap-x-[0.3em]", className)}>
        <span className="text-muted line-through decoration-accent decoration-[0.04em]">
          {metric.before}
        </span>
        <span aria-hidden="true" className="font-mono text-[0.5em] text-accent">
          →
        </span>
        <span className="sr-only">reduced to</span>
        <span>{metric.after}</span>
      </span>
    );
  }
  return <span className={className}>{metric.value}</span>;
}

/** Compact inline metric: figure + mono label. */
export function MetricInline({ metric }: { metric: Metric }) {
  return (
    <div className="flex flex-col gap-2 border-t border-border pt-4">
      <MetricFigure
        metric={metric}
        className="font-display text-display-md font-semibold text-foreground [font-stretch:112%]"
      />
      <span className="font-mono text-label uppercase text-technical">
        {metric.label}
        {metric.qualifier && <span className="text-accent"> · {metric.qualifier}</span>}
      </span>
    </div>
  );
}
