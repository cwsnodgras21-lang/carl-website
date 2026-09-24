import { process } from "@/content/home";
import { RailNode, SceneShell } from "@/components/system/scene-shell";
import { Display } from "@/components/ui/typography";

export function ProcessScene() {
  return (
    <SceneShell
      id="process"
      index="09"
      layer="method"
      railLabel="Method"
      labelledBy="process-title"
    >
      <div className="pt-24 md:pt-32">
        <Display id="process-title">{process.heading}</Display>

        {/* Four stages on one signal line: horizontal on desktop; on phones
            the page rail itself is the line. Motion hook: [data-signal]
            travels the line, [data-process-stage] nodes light in turn. */}
        <ol className="relative mt-16 grid gap-12 md:mt-24 md:grid-cols-4 md:gap-8 md:border-t md:border-technical">
          <span
            aria-hidden="true"
            data-signal
            className="absolute -top-[4px] left-0 hidden size-[7px] -translate-x-[calc(100%+6px)] bg-accent md:block"
          />
          {process.stages.map((stage) => (
            <li key={stage.index} className="relative md:pt-10" data-process-stage={stage.index}>
              <RailNode className="top-1 md:hidden" />
              <span
                aria-hidden="true"
                className="absolute -top-[5px] left-0 hidden size-[9px] border border-foreground bg-background md:block"
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
