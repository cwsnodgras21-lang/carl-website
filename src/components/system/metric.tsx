import type { Metric } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * Before → after as a connection, not a correction: the old value sits in the
 * muted voice, a drawn connector carries it to the new value. Each value is
 * unbreakable so the arrow can never be stranded at a line end.
 *
 * Motion hooks: [data-before], [data-connector], [data-after].
 */
export function Transformation({
  before,
  after,
  className,
  connector = "w-[1.4em]",
}: {
  before: string;
  after: string;
  className?: string;
  /** Width of the connector (em scales it with the type). */
  connector?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-[0.28em]", className)} data-transformation>
      <span data-before className="whitespace-nowrap text-muted">
        {before}
      </span>
      <span data-connector aria-hidden="true" className={cn("relative h-[0.06em] min-h-px shrink-0 bg-accent", connector)}>
        <span className="absolute -right-px top-1/2 size-0 -translate-y-1/2 border-y-[0.16em] border-l-[0.26em] border-y-transparent border-l-accent" />
      </span>
      <span className="sr-only">to</span>
      <span data-after className="whitespace-nowrap">
        {after}
      </span>
    </span>
  );
}

/** A metric's headline figure: a value, or a before → after transformation. */
export function MetricFigure({
  metric,
  className,
}: {
  metric: Metric;
  className?: string;
}) {
  if (metric.before && metric.after) {
    return <Transformation before={metric.before} after={metric.after} className={className} />;
  }
  return <span className={className}>{metric.value}</span>;
}

/** Figure + readable label. Used on case studies and supporting positions. */
export function MetricInline({ metric }: { metric: Metric }) {
  return (
    <div className="flex flex-col gap-2 border-t border-border pt-4">
      <MetricFigure
        metric={metric}
        className="font-display text-display-md font-semibold text-foreground [font-stretch:112%]"
      />
      <span className="text-base text-muted">
        {metric.label}
        {metric.qualifier && (
          <span className="ml-2 font-mono text-label uppercase text-accent">{metric.qualifier}</span>
        )}
      </span>
    </div>
  );
}

/**
 * Quiet reference to a number whose primary reveal happened elsewhere
 * (the Scale scene). Deliberately small: value + label on one line.
 */
export function MetricMeta({ metric, className }: { metric: Metric; className?: string }) {
  return (
    <p data-meta className={cn("flex flex-wrap items-baseline gap-x-2 text-base", className)}>
      <span className="font-semibold text-foreground">
        <MetricFigure metric={metric} />
      </span>
      <span className="text-muted">{metric.label}</span>
    </p>
  );
}
