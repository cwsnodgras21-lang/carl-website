import { nolturn as copy } from "@/content/home";
import { getProject, projectHref } from "@/content/projects";
import { SceneShell } from "@/components/system/scene-shell";
import { ScreenshotSlot } from "@/components/system/screenshot-slot";
import { SystemDiagram } from "@/components/system/system-diagram";
import { ActionLink } from "@/components/ui/action-link";
import { Body, Display, Label } from "@/components/ui/typography";

/**
 * The portfolio's commercial turn. Visual language moves from abstracted
 * architecture (employer work) to real product surfaces (owned work).
 */
export function NolTurnScene() {
  const inventory = getProject(copy.inventory.slug);
  const factory = getProject(copy.factory.slug);

  return (
    <>
      <SceneShell id="nolturn" index="08" layer="products" labelledBy="nolturn-title">
        <div className="pb-20 pt-32 md:pb-32 md:pt-48">
          <Display id="nolturn-title" size="2xl" className="uppercase">
            {copy.label}
          </Display>
          <Display as="p" size="md" className="mt-10 max-w-[22ch]">
            {copy.statement}
          </Display>
          <Body className="mt-6">{copy.body}</Body>

          {inventory && (
            <article
              aria-labelledby="nolturn-inventory"
              className="mt-24 grid gap-10 border-t border-border pt-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16"
            >
              <div>
                <Label>Product · {inventory.title}</Label>
                <h3
                  id="nolturn-inventory"
                  className="mt-5 font-display text-display-md font-semibold [font-stretch:112%]"
                >
                  {copy.inventory.headline}
                </h3>
                <p className="mt-5 text-lg leading-relaxed text-muted">{inventory.summary}</p>
                {inventory.capabilities && (
                  <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2 font-mono text-label uppercase text-technical">
                    {inventory.capabilities.map((capability) => (
                      <li key={capability} className="border-t border-border pt-2">
                        {capability}
                      </li>
                    ))}
                  </ul>
                )}
                <ActionLink href={projectHref(inventory.slug)} className="mt-10">
                  See how it works
                </ActionLink>
              </div>
              {inventory.images[0] && <ScreenshotSlot image={inventory.images[0]} />}
            </article>
          )}
        </div>
      </SceneShell>

      {factory && (
        <SceneShell
          id="software-factory"
          index="08.2"
          layer="ai"
          labelledBy="factory-title"
        >
          <article className="pb-24 pt-16 md:pb-40 md:pt-24">
            <Label>Product · {factory.title}</Label>
            <h3
              id="factory-title"
              className="mt-6 font-display text-display-lg font-semibold [font-stretch:112%]"
            >
              {copy.factory.statement[0]}
              <br />
              <span className="text-accent">{copy.factory.statement[1]}</span>
            </h3>
            <Body className="mt-10">{copy.factory.body}</Body>

            {factory.workflow && (
              <SystemDiagram diagram={factory.workflow} className="mt-16 md:mt-20" />
            )}

            {factory.capabilities && (
              <div className="mt-10 border-t border-dashed border-technical/50 pt-6">
                <Label>Around every stage</Label>
                <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2 font-mono text-sm text-muted">
                  {factory.capabilities.map((capability) => (
                    <li key={capability}>{capability}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-16 flex flex-wrap gap-x-10 gap-y-5">
              <ActionLink href={copy.cta.href} variant="primary">
                {copy.cta.label}
              </ActionLink>
              <ActionLink href={projectHref(factory.slug)}>About the Software Factory</ActionLink>
            </div>
          </article>
        </SceneShell>
      )}
    </>
  );
}
