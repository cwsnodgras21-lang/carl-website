import { milestones } from "@/content/career";
import { journey } from "@/content/home";
import type { Milestone } from "@/content/types";
import { glyphLayers, hasGlyph, LayerGlyph, LayerStrip } from "@/components/system/layer-glyphs";
import { SceneShell } from "@/components/system/scene-shell";
import { Display, Label } from "@/components/ui/typography";

const layerTitle: Record<string, string> = {
  electrical: "Electrical",
  mechanical: "Mechanical",
  controls: "Controls",
  software: "Software",
};

function MilestoneText({ milestone }: { milestone: Milestone }) {
  return (
    <>
      <p className="font-mono text-label uppercase text-accent">{milestone.period}</p>
      <h3 className="mt-3 font-display text-2xl font-semibold leading-tight [font-stretch:112%]">
        {milestone.title}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-muted text-pretty">{milestone.body}</p>
    </>
  );
}

export function JourneyScene() {
  return (
    <SceneShell id="journey" index="02" layer="electrical" labelledBy="journey-title">
      <div className="pt-24 md:pt-32">
        <Display id="journey-title">{journey.heading}</Display>

        {/* Desktop: one wire running through four technical drawings, with
            each milestone filed under the layer it added. */}
        <div className="mt-20 hidden lg:block">
          <LayerStrip className="h-auto w-full" />
          <div className="mt-6 grid grid-cols-4 gap-8 border-t border-border pt-6">
            {glyphLayers.map((layer) => (
              <div key={layer}>
                <Label className="mb-10">{layerTitle[layer]}</Label>
                <ol className="flex flex-col gap-12">
                  {milestones
                    .filter((m) => m.layer === layer)
                    .map((m) => (
                      <li key={m.period}>
                        <MilestoneText milestone={m} />
                      </li>
                    ))}
                </ol>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile + tablet: a vertical wire; the drawing changes as the
            layers accumulate. */}
        <ol className="relative mt-16 border-l-2 border-accent pl-8 lg:hidden">
          {milestones.map((m, i) => {
            const newLayer = i === 0 || milestones[i - 1].layer !== m.layer;
            return (
              <li key={m.period} className="relative pb-14 last:pb-0">
                <span
                  aria-hidden="true"
                  className="absolute -left-[calc(2rem+6px)] top-1 size-[10px] border border-foreground bg-background"
                />
                {newLayer && hasGlyph(m.layer) && (
                  <LayerGlyph layer={m.layer} className="mb-6 h-auto w-40" />
                )}
                <MilestoneText milestone={m} />
              </li>
            );
          })}
        </ol>

        <div className="py-40 md:py-56">
          <Display as="p" size="xl" className="max-w-[16ch]">
            {journey.closing[0]}
            <br />
            <span className="text-muted">{journey.closing[1]}</span>
          </Display>
        </div>
      </div>
    </SceneShell>
  );
}
