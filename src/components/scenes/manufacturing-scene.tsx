import { manufacturing as copy } from "@/content/home";
import { getMetric } from "@/content/metrics";
import { getProject, projectHref } from "@/content/projects";
import { MetricInline } from "@/components/system/metric";
import { SceneShell } from "@/components/system/scene-shell";
import { SystemDiagram } from "@/components/system/system-diagram";
import { ActionLink } from "@/components/ui/action-link";
import { Body, Display, Label } from "@/components/ui/typography";

export function ManufacturingScene() {
  const project = getProject(copy.slug);
  if (!project) return null;

  return (
    <SceneShell id="manufacturing" index="05" layer="enterprise" labelledBy="mfg-title">
      <div className="pb-24 pt-24 md:pb-40 md:pt-32">
        <Label>{copy.category}</Label>
        <Display id="mfg-title" className="mt-6 max-w-[18ch]">
          {copy.statement}
        </Display>
        {/* The pause: deliberate empty space before the answer. */}
        <Display as="p" className="mt-24 max-w-[18ch] text-accent md:mt-40">
          {copy.turn}
        </Display>
        <Body className="mt-10">{copy.body}</Body>

        {project.workflow && (
          <SystemDiagram diagram={project.workflow} className="mt-16 md:mt-24" />
        )}

        <div className="mt-16 grid gap-8 sm:grid-cols-2 md:mt-20 lg:max-w-3xl">
          {project.metrics.map((id) => {
            const metric = getMetric(id);
            return metric ? <MetricInline key={id} metric={metric} /> : null;
          })}
        </div>

        <ActionLink href={projectHref(project.slug)} className="mt-14">
          Explore the system
        </ActionLink>
      </div>
    </SceneShell>
  );
}
