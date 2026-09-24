import { hero } from "@/content/home";
import { site } from "@/content/site";
import { Connection } from "@/components/system/connection";
import { SceneShell } from "@/components/system/scene-shell";
import { ActionLink } from "@/components/ui/action-link";
import { Body, Display, Label } from "@/components/ui/typography";

export function HeroScene() {
  return (
    <SceneShell
      id="top"
      index="01"
      layer="connection"
      labelledBy="hero-title"
      rail="none"
      className="overflow-hidden"
    >
      <div className="flex min-h-svh flex-col justify-center pb-16 pt-32 md:pb-24">
        <Label>{hero.eyebrow}</Label>
        <Connection direction="down" className="mb-10 mt-6 md:mb-14" />
        <Display as="h1" id="hero-title" size="xl" className="max-w-[14ch]">
          {site.statement}
        </Display>
        <Body className="mt-8 md:mt-10">{site.summary}</Body>
        <div className="mt-12 flex flex-wrap items-baseline gap-x-10 gap-y-5">
          <ActionLink href={hero.primaryCta.href} arrow="down" variant="primary">
            {hero.primaryCta.label}
          </ActionLink>
          <ActionLink href={hero.secondaryCta.href} arrow="out">
            {hero.secondaryCta.label}
          </ActionLink>
        </div>
      </div>
    </SceneShell>
  );
}
