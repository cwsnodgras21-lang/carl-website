import { scale } from "@/content/home";
import { metrics, scaleSequence } from "@/content/metrics";
import { MetricFigure } from "@/components/system/metric";
import { SceneShell } from "@/components/system/scene-shell";
import { Label } from "@/components/ui/typography";
import { cn } from "@/lib/cn";

/**
 * Six numbers, each given its own space. Values come from content; the
 * narrative animation (Phase 4) only animates how they arrive.
 */
export function ScaleScene() {
  const total = String(scaleSequence.length).padStart(2, "0");

  return (
    <SceneShell id="scale" index="03" layer="mechanical" railLabel="Scale" labelledBy="scale-title">
      <div className="pt-8">
        <Label as="h2" id="scale-title">
          {scale.label}
        </Label>
        <ol className="mt-10">
          {scaleSequence.map((id, i) => {
            const metric = metrics[id];
            const transformation = "before" in metric;
            return (
              <li
                key={id}
                className="grid gap-6 border-t border-border py-16 md:min-h-[46svh] md:content-center md:py-24"
              >
                <span className="font-mono text-label text-technical">
                  {String(i + 1).padStart(2, "0")} / {total}
                </span>
                <MetricFigure
                  metric={metric}
                  className={cn(
                    "font-display font-semibold uppercase [font-stretch:112%]",
                    transformation ? "text-display-xl" : "text-display-2xl",
                  )}
                />
                <p className="font-mono text-sm uppercase tracking-[0.12em] text-muted md:text-base">
                  {metric.label}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </SceneShell>
  );
}
