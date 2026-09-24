import Link from "next/link";
import { demoHref, demos, demosIntro } from "@/content/demos";
import { SceneShell } from "@/components/system/scene-shell";
import { ActionLink } from "@/components/ui/action-link";
import { Body, Display } from "@/components/ui/typography";

/**
 * The payoff: after the story, something to use. Each row names the demo
 * and its input → output; the demos themselves live on /demos.
 */
export function DemosScene() {
  return (
    <SceneShell id="demos" index="10" layer="connection" railLabel="Demos" labelledBy="demos-title">
      <div className="pb-24 pt-8 md:pb-40">
        <Display id="demos-title" className="max-w-[16ch]">
          {demosIntro.heading}
        </Display>
        <Body className="mt-6">{demosIntro.lede}</Body>

        <ul className="mt-16 md:mt-20">
          {demos.map((demo) => (
            <li key={demo.id} className="border-t border-border">
              <Link
                href={demoHref(demo.id)}
                className="group grid gap-3 py-8 md:grid-cols-[4rem_minmax(0,1fr)_minmax(0,1.2fr)_auto] md:items-baseline md:gap-10"
              >
                <span className="font-mono text-label text-accent">{demo.index}</span>
                <span className="font-display text-display-md font-semibold transition-colors [font-stretch:112%] group-hover:text-accent">
                  {demo.name}
                </span>
                <span className="text-lg leading-snug text-muted">{demo.summary}</span>
                <span className="inline-flex items-baseline gap-2 font-mono text-label uppercase text-foreground/85 group-hover:text-accent">
                  Run it
                  <span aria-hidden="true" className="text-accent transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <ActionLink href="/demos" className="mt-12">
          All demos
        </ActionLink>
      </div>
    </SceneShell>
  );
}
