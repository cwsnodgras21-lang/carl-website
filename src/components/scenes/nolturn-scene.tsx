import { nolturn as copy } from "@/content/home";
import { getProject, projectHref } from "@/content/projects";
import { SceneShell } from "@/components/system/scene-shell";
import { ScreenshotSlot, suppliedImages } from "@/components/system/screenshot-slot";
import { ActionLink } from "@/components/ui/action-link";
import { Body, Display, Label } from "@/components/ui/typography";
import { cn } from "@/lib/cn";

/**
 * Independent NolTurn work, kept visibly separate from employment.
 */
export function NolTurnScene() {
  const inventory = getProject(copy.inventory.slug);
  const screenshot = inventory ? suppliedImages(inventory.images)[0] : undefined;

  return (
    <>
      <SceneShell
        id="nolturn"
        index="04"
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

    </>
  );
}
