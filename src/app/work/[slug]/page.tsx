import type { Metadata } from "next";
import { pageMetadata } from "@/lib/page-metadata";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { getMetric } from "@/content/metrics";
import { getProject, projectHref, projects } from "@/content/projects";
import { isPending } from "@/content/types";
import { MetricInline } from "@/components/system/metric";
import { ScreenshotSlot, suppliedImages } from "@/components/system/screenshot-slot";
import { SystemDiagram } from "@/components/system/system-diagram";
import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";
import { MaybeText } from "@/components/ui/maybe-text";
import { PageHeader } from "@/components/ui/page-header";
import { Body, Label } from "@/components/ui/typography";
import { cn } from "@/lib/cn";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata(props: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProject(slug);
  return project
    ? pageMetadata({ title: project.title, description: project.summary, path: projectHref(project.slug) })
    : {};
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
  const images = project.visualMode === "public-ui" ? suppliedImages(project.images) : [];
  const technologies = isPending(project.technologies) ? null : project.technologies;

  // Only sections with supplied content are shown; numbering follows what's
  // actually on the page. Pending fields stay in the content model.
  const sections: { title: string; body: ReactNode }[] = [];
  const add = (title: string, show: unknown, body: ReactNode) => {
    if (show) sections.push({ title, body });
  };

  add("Problem", !isPending(project.problem), <MaybeText value={project.problem} />);
  add("Context", !isPending(project.context), <MaybeText value={project.context} />);
  add(
    "System",
    !isPending(project.system) || project.capabilities?.length,
    <>
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
    </>,
  );
  add(
    "How it works",
    project.workflow || images.length,
    <>
      {project.workflow && <SystemDiagram diagram={project.workflow} />}
      {images.length > 0 && (
        <div className={cn("grid gap-8", project.workflow && "mt-10")}>
          {images.map((image) => (
            <ScreenshotSlot key={image.alt} image={image} />
          ))}
        </div>
      )}
    </>,
  );
  add(
    "Impact",
    metrics.length || !isPending(project.outcome),
    <>
      {metrics.length > 0 && (
        <div className="grid gap-8 sm:grid-cols-2">
          {metrics.map((metric) => (
            <MetricInline key={metric.id} metric={metric} />
          ))}
        </div>
      )}
      <MaybeText value={project.outcome} className={cn(metrics.length > 0 && "mt-8")} />
    </>,
  );
  add(
    "Technical details",
    technologies || !isPending(project.technicalNotes),
    <details className="group">
      <summary className="cursor-pointer list-none font-mono text-label uppercase text-foreground hover:text-accent">
        <span className="group-open:hidden">Show technical details +</span>
        <span className="hidden group-open:inline">Hide technical details −</span>
      </summary>
      <div className="mt-6 flex flex-col gap-6">
        {technologies && (
          <div>
            <Label className="mb-2">Technologies</Label>
            <p>{technologies.join(" · ")}</p>
          </div>
        )}
        <MaybeText value={project.technicalNotes} />
      </div>
    </details>,
  );
  add("What I learned", !isPending(project.learned), <MaybeText value={project.learned} />);

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
        {sections.map((section, i) => (
          <Section key={section.title} index={String(i + 1).padStart(2, "0")} title={section.title}>
            {section.body}
          </Section>
        ))}

        <div className="border-t border-border pt-14">
          <ActionLink href="/work">All work</ActionLink>
        </div>
      </Container>
    </article>
  );
}
