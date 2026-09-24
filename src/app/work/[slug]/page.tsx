import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getMetric } from "@/content/metrics";
import { getProject, projects } from "@/content/projects";
import { isPending } from "@/content/types";
import { MetricInline } from "@/components/system/metric";
import { ScreenshotSlot } from "@/components/system/screenshot-slot";
import { SystemDiagram } from "@/components/system/system-diagram";
import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";
import { MaybeText } from "@/components/ui/maybe-text";
import { PageHeader } from "@/components/ui/page-header";
import { PendingNote } from "@/components/ui/pending-note";
import { Body, Label } from "@/components/ui/typography";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  return project ? { title: project.title, description: project.summary } : {};
}

/** Case-study section: numbered, labelled, business story first. */
function Section({ index, title, children }: { index: string; title: string; children: ReactNode }) {
  const id = title.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <section
      aria-labelledby={id}
      className="grid gap-6 border-t border-border py-14 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-10 md:py-20"
    >
      <div className="flex gap-4 md:flex-col md:gap-2">
        <span className="font-mono text-label text-accent">{index}</span>
        <Label as="h2" id={id} className="text-foreground">
          {title}
        </Label>
      </div>
      <div className="min-w-0 text-lg leading-relaxed text-muted [&_p]:max-w-2xl">{children}</div>
    </section>
  );
}

export default async function ProjectPage(props: PageProps<"/work/[slug]">) {
  const { slug } = await props.params;
  const project = getProject(slug);
  if (!project) notFound();

  const metrics = project.metrics.flatMap((id) => getMetric(id) ?? []);
  const showImages = project.visualMode === "public-ui" && project.images.length > 0;

  return (
    <article>
      <PageHeader label={project.category} title={project.title}>
        <Body className="mt-8">{project.summary}</Body>
        <p className="mt-8 font-mono text-label uppercase text-technical">
          {project.visualMode === "abstracted"
            ? "Employer work · sanitized conceptual view"
            : "NolTurn product"}
        </p>
      </PageHeader>

      <Container className="pb-24">
        <Section index="01" title="Problem">
          <MaybeText value={project.problem} />
        </Section>
        <Section index="02" title="Context">
          <MaybeText value={project.context} />
        </Section>
        <Section index="03" title="System">
          <MaybeText value={project.system} />
          {project.capabilities && (
            <ul className="mt-8 grid gap-x-8 gap-y-2 font-mono text-label uppercase text-technical sm:grid-cols-2 lg:grid-cols-3">
              {project.capabilities.map((capability) => (
                <li key={capability} className="border-t border-border pt-2">
                  {capability}
                </li>
              ))}
            </ul>
          )}
        </Section>
        <Section index="04" title="How it works">
          {project.workflow ? (
            <SystemDiagram diagram={project.workflow} />
          ) : (
            <PendingNote>Workflow diagram</PendingNote>
          )}
          {showImages && (
            <div className="mt-10 grid gap-8">
              {project.images.map((image) => (
                <ScreenshotSlot key={image.alt} image={image} />
              ))}
            </div>
          )}
        </Section>
        <Section index="05" title="Impact">
          {metrics.length > 0 && (
            <div className="mb-8 grid gap-8 sm:grid-cols-2">
              {metrics.map((metric) => (
                <MetricInline key={metric.id} metric={metric} />
              ))}
            </div>
          )}
          <MaybeText value={project.outcome} />
        </Section>
        <Section index="06" title="Technical details">
          <details className="group">
            <summary className="cursor-pointer list-none font-mono text-label uppercase text-foreground hover:text-accent">
              <span className="group-open:hidden">Show technical details +</span>
              <span className="hidden group-open:inline">Hide technical details −</span>
            </summary>
            <div className="mt-6 flex flex-col gap-6">
              <div>
                <Label className="mb-2">Technologies</Label>
                {isPending(project.technologies) ? (
                  <PendingNote>{project.technologies.pending}</PendingNote>
                ) : (
                  <p>{project.technologies.join(" · ")}</p>
                )}
              </div>
              <MaybeText value={project.technicalNotes} />
            </div>
          </details>
        </Section>
        <Section index="07" title="What I learned">
          <MaybeText value={project.learned} />
        </Section>

        <div className="border-t border-border pt-14">
          <ActionLink href="/work">All work</ActionLink>
        </div>
      </Container>
    </article>
  );
}
