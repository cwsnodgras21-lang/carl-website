import type { Metadata } from "next";
import Link from "next/link";
import { getMetric } from "@/content/metrics";
import { projectHref, projects } from "@/content/projects";
import type { Project } from "@/content/types";
import { MetricFigure } from "@/components/system/metric";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Body, Label } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Work",
  description: "Systems Carl Snodgrass has built — enterprise, manufacturing, customer operations, and NolTurn products.",
};

const groups: { id: string; label: string; note: string; owner: Project["owner"] }[] = [
  {
    id: "systems",
    label: "Enterprise & operations systems",
    note: "Shown as sanitized, conceptual architecture.",
    owner: "employer",
  },
  {
    id: "nolturn",
    label: "NolTurn",
    note: "Products I own and build outside of work.",
    owner: "nolturn",
  },
];

function ProjectRow({ project }: { project: Project }) {
  return (
    <li className="border-t border-border">
      <Link
        href={projectHref(project.slug)}
        className="group grid gap-4 py-10 md:grid-cols-[12rem_minmax(0,1fr)_auto] md:gap-10"
      >
        <span className="font-mono text-label uppercase text-technical md:pt-2">
          {project.category}
        </span>
        <span>
          <span className="block font-display text-display-md font-semibold transition-colors [font-stretch:112%] group-hover:text-accent">
            {project.title}
          </span>
          <span className="mt-3 block max-w-2xl text-base leading-relaxed text-muted">
            {project.summary}
          </span>
          {project.metrics.length > 0 && (
            <span className="mt-5 flex flex-wrap gap-x-8 gap-y-2 font-mono text-label uppercase text-muted">
              {project.metrics.map((id) => {
                const metric = getMetric(id);
                return metric ? (
                  <span key={id}>
                    <MetricFigure metric={metric} className="text-foreground" /> {metric.label}
                  </span>
                ) : null;
              })}
            </span>
          )}
        </span>
        <span aria-hidden="true" className="font-mono text-accent transition-transform group-hover:translate-x-1 md:pt-2">
          →
        </span>
      </Link>
    </li>
  );
}

export default function WorkPage() {
  return (
    <>
      <PageHeader label="Work" title="Systems I've built.">
        <Body className="mt-8">
          Employer work is shown as conceptual architecture with measured outcomes. NolTurn work is
          mine, so it can show the real thing.
        </Body>
      </PageHeader>
      <Container className="pb-32">
        {groups.map((group) => (
          <section key={group.id} id={group.id} aria-labelledby={`${group.id}-title`} className="mb-24">
            <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4">
              <Label as="h2" id={`${group.id}-title`} className="text-foreground">
                {group.label}
              </Label>
              <p className="font-mono text-label text-technical">{group.note}</p>
            </div>
            <ul>
              {projects
                .filter((project) => project.owner === group.owner)
                .map((project) => (
                  <ProjectRow key={project.slug} project={project} />
                ))}
            </ul>
          </section>
        ))}
      </Container>
    </>
  );
}
