import { projectExecution as copy } from "@/content/home";
import { metrics } from "@/content/metrics";
import { getProject, projectHref } from "@/content/projects";
import { MetricMeta } from "@/components/system/metric";
import { SceneShell } from "@/components/system/scene-shell";
import { ActionLink } from "@/components/ui/action-link";
import { Body, Display, Label } from "@/components/ui/typography";
import { ExpansionDiagram } from "./project-execution-visual";

/**
 * EXPANSION. Reads left → right: the small original scope (the opening
 * statement, the dashed "started here" boundary) fans out into the platform,
 * and the turn — "It didn't stay that way." — sits where the system ended up.
 */
export function ProjectExecutionScene() {
  const project = getProject(copy.slug);
  if (!project?.workflow) return null;
  const saved = metrics.softwareCost;

  return (
    <SceneShell
      id="work"
      index="04"
      layer="enterprise"
      railLabel="Expansion"
      labelledBy="pe-title"
    >
      <div className="pb-24 pt-28 md:pb-36 md:pt-40">
        <Label>{copy.category}</Label>
        <Display id="pe-title" size="md" className="mt-5 max-w-[20ch]">
          {copy.statement}
        </Display>

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:items-center lg:gap-10">
          <div className="lg:col-span-8">
            <ExpansionDiagram diagram={project.workflow} />
          </div>

          <div className="lg:col-span-4">
            <Display as="p" className="max-w-[12ch] text-accent">
              {copy.turn}
            </Display>
            <Body className="mt-6 text-lg md:text-lg">{copy.body}</Body>

            <div className="mt-10 border-t border-border pt-6" data-metric={saved.id}>
              <p className="font-display text-display-md font-semibold [font-stretch:112%]">
                {saved.value}
              </p>
              <p className="mt-1 text-base text-muted">{saved.label}</p>
            </div>
            <MetricMeta metric={metrics.projectWork} className="mt-4" />

            <ActionLink href={projectHref(project.slug)} className="mt-10">
              Explore the system
            </ActionLink>
          </div>
        </div>
      </div>
    </SceneShell>
  );
}
