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
      railLabel="Connection"
      labelledBy="hero-title"
      rail="none"
      className="overflow-hidden"
    >
      {/* Phones: content-height so the next scene's heading shows below the
          fold. Desktop: a full, centred first viewport. */}
      <div className="flex flex-col pb-20 pt-28 md:min-h-svh md:justify-center md:pb-24 md:pt-32">
        <Label>{hero.eyebrow}</Label>
        <Connection direction="down" className="mb-10 mt-6 md:mb-14" />
        <Display as="h1" id="hero-title" size="xl" className="max-w-[14ch]">
          {site.statement}
        </Display>
        <div data-hero-reveal>
          <Body className="mt-8 md:mt-10">{site.summary}</Body>
          <div className="mt-10 flex flex-wrap items-baseline gap-x-10 gap-y-5 md:mt-12">
            <ActionLink href={hero.primaryCta.href} variant="primary">
              {hero.primaryCta.label}
            </ActionLink>
            <ActionLink href={hero.secondaryCta.href}>{hero.secondaryCta.label}</ActionLink>
          </div>
        </div>
      </div>
    </SceneShell>
  );
}
