import { customerOperations as copy } from "@/content/home";
import { metrics } from "@/content/metrics";
import { getProject, projectHref } from "@/content/projects";
import { SceneShell } from "@/components/system/scene-shell";
import { ActionLink } from "@/components/ui/action-link";
import { Body, Display, Label } from "@/components/ui/typography";
import { ConvergenceDiagram } from "./customer-operations-visual";

/**
 * CONVERGENCE. Statement and explanation sit on either side of the page —
 * scattered — and the diagram below pulls everything onto one person.
 */
export function CustomerOperationsScene() {
  const project = getProject(copy.slug);
  if (!project?.workflow) return null;

  return (
    <SceneShell
      id="customer-operations"
      index="06"
      layer="enterprise"
      railLabel="Convergence"
      labelledBy="cx-title"
    >
      <div className="pb-24 pt-24 md:pb-36 md:pt-32">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Label>{copy.category}</Label>
            <Display id="cx-title" className="mt-5 max-w-[15ch]">
              {copy.statement}
            </Display>
          </div>
          <Body className="text-lg md:text-lg lg:col-span-4 lg:col-start-9">{copy.body}</Body>
        </div>

        <div className="mt-16 md:mt-24">
          <ConvergenceDiagram
            diagram={project.workflow}
            metric={metrics.spareParts}
            attachTo="spares"
          />
        </div>

        <ActionLink href={projectHref(project.slug)} className="mt-12">
          Explore the system
        </ActionLink>
      </div>
    </SceneShell>
  );
}
