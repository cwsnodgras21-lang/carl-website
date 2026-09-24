import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { about } from "@/content/about";
import { layers, milestones } from "@/content/career";
import { hasContact } from "@/content/site";
import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Label } from "@/components/ui/typography";

export const metadata: Metadata = pageMetadata({
  title: "About",
  description: "Electrical, mechanical, operations, controls, software, AI — how Carl Snodgrass came to build systems.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader label="About" title={about.title} />
      <Container className="pb-32">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-24">
          <div className="flex max-w-2xl flex-col gap-6 text-lg leading-relaxed text-muted md:text-xl">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
            <p
              aria-label={`Layers: ${layers.join(", ")}`}
              className="mt-4 font-mono text-sm uppercase tracking-[0.12em] text-technical"
            >
              {layers.join(" → ")}
            </p>
          </div>

          <section aria-labelledby="timeline-title">
            <Label as="h2" id="timeline-title" className="text-foreground">
              Timeline
            </Label>
            <ol className="mt-8 border-l-2 border-accent pl-8">
              {milestones.map((milestone) => (
                <li key={milestone.period} className="relative pb-10 last:pb-0">
                  <span
                    aria-hidden="true"
                    className="absolute -left-[calc(2rem+6px)] top-1 size-[10px] border border-foreground bg-background"
                  />
                  <p className="font-mono text-label uppercase text-accent">{milestone.period}</p>
                  <h3 className="mt-2 text-lg font-semibold">{milestone.title}</h3>
                  <p className="mt-1 text-base text-muted">{milestone.body}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <div className="mt-24 flex flex-wrap gap-x-10 gap-y-5 border-t border-border pt-14">
          <ActionLink href="/work" variant="primary">
            See the work
          </ActionLink>
          {hasContact && <ActionLink href="/#contact">Let&apos;s talk</ActionLink>}
        </div>
      </Container>
    </>
  );
}
