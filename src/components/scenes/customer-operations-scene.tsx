import { customerOperations as copy } from "@/content/home";
import { metrics } from "@/content/metrics";
import { getProject, projectHref } from "@/content/projects";
import { MetricFigure } from "@/components/system/metric";
import { SceneShell } from "@/components/system/scene-shell";
import { SystemDiagram } from "@/components/system/system-diagram";
import { ActionLink } from "@/components/ui/action-link";
import { Body, Display, Label } from "@/components/ui/typography";

export function CustomerOperationsScene() {
  const project = getProject(copy.slug);
  if (!project) return null;
  const primary = metrics.spareParts;

  return (
    <SceneShell id="customer-operations" index="06" layer="enterprise" labelledBy="cx-title">
      <div className="pb-24 pt-24 md:pb-40 md:pt-32">
        <Label>{copy.category}</Label>
        <Display id="cx-title" className="mt-6 max-w-[16ch]">
          {copy.statement}
        </Display>
        <Body className="mt-10">{copy.body}</Body>

        {project.workflow && (
          <SystemDiagram diagram={project.workflow} className="mt-16 md:mt-24" />
        )}

        <div className="mt-20 grid gap-8 border-t border-border pt-10 md:mt-28 md:grid-cols-[auto_minmax(0,24rem)] md:items-end md:gap-16">
          <div>
            <MetricFigure
              metric={primary}
              className="font-display text-display-2xl font-semibold [font-stretch:112%]"
            />
            <p className="mt-4 font-mono text-sm uppercase tracking-[0.12em] text-muted">
              {primary.label}
            </p>
          </div>
          {primary.note && (
            <p className="text-base leading-relaxed text-muted">{primary.note}</p>
          )}
        </div>

        <ActionLink href={projectHref(project.slug)} className="mt-14">
          Explore the system
        </ActionLink>
      </div>
    </SceneShell>
  );
}
