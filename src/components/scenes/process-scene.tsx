import { process } from "@/content/home";
import { SceneShell } from "@/components/system/scene-shell";
import { Display } from "@/components/ui/typography";

export function ProcessScene() {
  return (
    <SceneShell
      id="process"
      index="09"
      layer="controls"
      railLabel="Method"
      labelledBy="process-title"
    >
      <div className="pt-24 md:pt-32">
        <Display id="process-title">{process.heading}</Display>

        {/* Four stages on one signal line: horizontal on desktop, vertical
            on small screens. */}
        <ol className="relative mt-16 grid gap-12 border-l border-technical pl-8 md:mt-24 md:grid-cols-4 md:gap-8 md:border-l-0 md:border-t md:pl-0 md:pt-0">
          {process.stages.map((stage) => (
            <li key={stage.index} className="relative md:pt-10">
              <span
                aria-hidden="true"
                className="absolute -left-[calc(2rem+5px)] top-1 size-[9px] border border-foreground bg-background md:-top-[5px] md:left-0"
              />
              <p className="font-mono text-label text-accent">{stage.index}</p>
              <h3 className="mt-3 font-display text-3xl font-semibold [font-stretch:112%]">
                {stage.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted">{stage.body}</p>
            </li>
          ))}
        </ol>

        <div className="py-40 md:py-64">
          <Display as="p" size="xl" className="max-w-[18ch]">
            {process.principle}
          </Display>
        </div>
      </div>
    </SceneShell>
  );
}
