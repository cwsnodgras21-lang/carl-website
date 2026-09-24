import { milestones } from "@/content/career";
import { journey } from "@/content/home";
import type { Milestone } from "@/content/types";
import { glyphLayers, hasGlyph, LayerGlyph, LayerStrip } from "@/components/system/layer-glyphs";
import { RailNode, RailSegment, SceneShell } from "@/components/system/scene-shell";
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

/**
 * The rail itself changes as the layers accumulate: copper conductor →
 * dimension line → signal dashes → data dots. On desktop the scene's rail is
 * split into four segments; on phones each milestone draws its own segment.
 *
 * Motion hooks: [data-layer-strip] glyphs carry [data-signal] wires;
 * milestones are [data-milestone][data-layer] so they can reveal as the
 * signal reaches their layer.
 */
export function JourneyScene() {
  const lastLayer = milestones[milestones.length - 1].layer;

  return (
    <SceneShell
      id="journey"
      index="02"
      layer="electrical"
      railLabel="Layers"
      labelledBy="journey-title"
      segments={["electrical", "mechanical", "controls", "software"]}
      mobileRail="self"
    >
      <div className="relative pt-20 md:pt-32">
        <RailSegment layer="electrical" className="inset-y-0 md:hidden" />
        <Display id="journey-title">{journey.heading}</Display>
      </div>

      {/* Desktop: one wire through four technical drawings, each milestone
          filed under the layer it added. */}
      <div className="mt-20 hidden lg:block">
        <LayerStrip className="h-auto w-full" />
        <div className="mt-6 grid grid-cols-4 gap-8 border-t border-border pt-6">
          {glyphLayers.map((layer) => (
            <div key={layer} data-layer-column={layer}>
              <Label className="mb-10">{layerTitle[layer]}</Label>
              <ol className="flex flex-col gap-12">
                {milestones
                  .filter((m) => m.layer === layer)
                  .map((m) => (
                    <li key={m.period} data-milestone data-layer={m.layer}>
                      <MilestoneText milestone={m} />
                    </li>
                  ))}
              </ol>
            </div>
          ))}
        </div>
      </div>

      {/* Phones + tablet: the rail is the wire; its style and the drawing
          change as each new layer starts. */}
      <ol className="relative pt-14 lg:hidden">
        {milestones.map((m, i) => {
          const newLayer = i === 0 || milestones[i - 1].layer !== m.layer;
          return (
            <li key={m.period} className="relative pb-14" data-milestone data-layer={m.layer}>
              <RailSegment layer={m.layer} mask className="inset-y-0 md:hidden" />
              <RailNode className="top-1" accent={newLayer} />
              {newLayer && hasGlyph(m.layer) && (
                <LayerGlyph layer={m.layer} className="mb-6 h-auto w-40" />
              )}
              <MilestoneText milestone={m} />
            </li>
          );
        })}
      </ol>

      <div className="relative py-32 md:py-56" data-journey-closing>
        <RailSegment layer={lastLayer} className="inset-y-0 md:hidden" />
        <Display as="p" size="xl" className="max-w-[16ch]">
          {journey.closing[0]}
          <br />
          <span className="text-muted">{journey.closing[1]}</span>
        </Display>
      </div>
    </SceneShell>
  );
}
