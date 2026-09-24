import { quickWins } from "@/content/home";
import { getMetric } from "@/content/metrics";
import { MetricFigure } from "@/components/system/metric";
import { SceneShell } from "@/components/system/scene-shell";
import { Display } from "@/components/ui/typography";

/** Faster pacing than the flagship scenes: tight rows, before → after. */
export function QuickWinsScene() {
  return (
    <SceneShell id="quick-wins" index="07" layer="software" labelledBy="qw-title">
      <div className="pb-24 pt-24 md:pb-32 md:pt-32">
        <Display id="qw-title" className="max-w-[20ch]">
          {quickWins.heading}
        </Display>

        <ul className="mt-16 md:mt-20">
          {quickWins.items.map((item) => {
            const metric = item.metric ? getMetric(item.metric) : undefined;
            return (
              <li
                key={item.id}
                className="grid gap-4 border-t border-border py-10 md:grid-cols-[11rem_minmax(0,1fr)] lg:grid-cols-[11rem_minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-10"
              >
                <h3 className="font-mono text-label uppercase text-technical md:pt-3">
                  {item.label}
                </h3>
                <div>
                  <p className="font-display text-display-md font-semibold [font-stretch:112%]">
                    {metric ? <MetricFigure metric={metric} /> : item.headline}
                  </p>
                  {metric?.qualifier && (
                    <p className="mt-2 font-mono text-label uppercase text-accent">
                      {metric.qualifier}
                    </p>
                  )}
                  {metric && item.body.length === 0 && (
                    <p className="mt-2 font-mono text-label uppercase text-muted">
                      {metric.label}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-3 text-base leading-relaxed text-muted md:col-start-2 lg:col-start-auto lg:pt-2">
                  {item.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                  {item.list && (
                    <ul className="flex flex-col gap-1">
                      {item.list.map((entry) => (
                        <li key={entry} className="flex gap-3">
                          <span aria-hidden="true" className="font-mono text-technical">
                            ─
                          </span>
                          {entry}
                        </li>
                      ))}
                    </ul>
                  )}
                  {item.footnote && <p className="text-sm">{item.footnote}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </SceneShell>
  );
}
