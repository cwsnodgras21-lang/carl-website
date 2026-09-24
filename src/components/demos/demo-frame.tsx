import type { ReactNode } from "react";
import type { Demo } from "@/content/demos";
import { getMetric } from "@/content/metrics";
import { MetricFigure } from "@/components/system/metric";

/** One demo on /demos: name, the problem in three lines, then the instrument. */
export function DemoFrame({ demo, children }: { demo: Demo; children: ReactNode }) {
  const metric = demo.metric ? getMetric(demo.metric) : undefined;
  const titleId = `${demo.id}-title`;
  return (
    <section id={demo.id} aria-labelledby={titleId} className="border-t border-border pb-28 pt-12 md:pb-40 md:pt-16">
      <div className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4">
        <h2 id={titleId} className="flex items-baseline gap-4 font-display text-display-md font-semibold [font-stretch:112%]">
          <span className="font-mono text-label text-accent">{demo.index}</span>
          {demo.name}
        </h2>
        {metric && (
          <p className="flex flex-wrap items-baseline gap-x-3 text-base">
            <MetricFigure metric={metric} className="font-semibold text-foreground" />
            <span className="text-sm text-muted">The real system</span>
          </p>
        )}
      </div>

      <dl className="mt-10 grid gap-6 md:grid-cols-3 md:gap-10">
        {(
          [
            ["The problem", demo.problem],
            ["The system", demo.system],
            ["The result", demo.result],
          ] as const
        ).map(([term, text]) => (
          <div key={term} className="border-t border-border/60 pt-4">
            <dt className="font-mono text-label uppercase text-technical">{term}</dt>
            <dd className="mt-2 text-base leading-relaxed text-foreground/85">{text}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-14">{children}</div>
    </section>
  );
}
