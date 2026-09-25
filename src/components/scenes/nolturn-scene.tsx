import { nolturn as copy } from "@/content/home";
import { getProject, projectHref } from "@/content/projects";
import { SceneShell } from "@/components/system/scene-shell";
import { ScreenshotSlot, suppliedImages } from "@/components/system/screenshot-slot";
import { ActionLink } from "@/components/ui/action-link";
import { Body, Display, Label } from "@/components/ui/typography";
import { cn } from "@/lib/cn";
import { GovernedPipeline } from "./software-factory-visual";

/**
 * The portfolio's commercial turn. Visual language moves from abstracted
 * architecture (employer work) to real product surfaces (owned work).
 */
export function NolTurnScene() {
  const inventory = getProject(copy.inventory.slug);
  const factory = getProject(copy.factory.slug);
  const screenshot = inventory ? suppliedImages(inventory.images)[0] : undefined;

  return (
    <>
      <SceneShell
        id="nolturn"
        index="08"
        layer="products"
        railLabel="Products"
        labelledBy="nolturn-title"
      >
        <div className="pb-20 pt-28 md:pb-28 md:pt-44">
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
              className={cn(
                "mt-20 grid gap-10 border-t border-border pt-10 lg:gap-16",
                screenshot && "lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]",
              )}
            >
              <div className={cn(!screenshot && "max-w-3xl")}>
                <Label>Product · {inventory.title}</Label>
                <h3
                  id="nolturn-inventory"
                  className="mt-5 font-display text-display-md font-semibold [font-stretch:112%]"
                >
                  {copy.inventory.headline}
                </h3>
                <p className="mt-5 text-lg leading-relaxed text-muted">{inventory.summary}</p>
                {inventory.capabilities && (
                  <ul data-capabilities className="mt-8 grid grid-cols-2 gap-x-6 text-base text-foreground/85">
                    {inventory.capabilities.map((capability) => (
                      <li key={capability} className="relative py-2.5">
                        <span aria-hidden="true" data-cap-line className="absolute inset-x-0 top-0 h-px bg-border" />
                        {capability}
                      </li>
                    ))}
                  </ul>
                )}
                <ActionLink href={projectHref(inventory.slug)} className="mt-10">
                  See how it works
                </ActionLink>
              </div>
              {screenshot && <ScreenshotSlot image={screenshot} className="lg:justify-self-center" />}
            </article>
          )}
        </div>
      </SceneShell>

      {factory?.workflow && (
        <SceneShell
          id="software-factory"
          index="08.2"
          layer="ai"
          railLabel="AI"
          labelledBy="factory-title"
        >
          <article className="pb-24 pt-16 md:pb-36 md:pt-24">
            <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <Label>Product · {factory.title}</Label>
                <h3
                  id="factory-title"
                  className="mt-6 font-display text-display-lg font-semibold [font-stretch:112%]"
                >
                  {copy.factory.statement[0]}
                  <br />
                  <span className="text-accent">{copy.factory.statement[1]}</span>
                </h3>
              </div>
              <Body className="text-lg md:text-lg lg:col-span-4 lg:col-start-9">{copy.factory.body}</Body>
            </div>

            <div className="mt-14 md:mt-20">
              <GovernedPipeline
                stages={factory.workflow.columns.flat()}
                governance={factory.capabilities ?? []}
                title={factory.workflow.title}
              />
            </div>

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
