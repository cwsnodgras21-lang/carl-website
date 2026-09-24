import { manufacturing as copy } from "@/content/home";
import { metrics } from "@/content/metrics";
import { getProject, projectHref } from "@/content/projects";
import { MetricMeta } from "@/components/system/metric";
import { SceneShell } from "@/components/system/scene-shell";
import { ActionLink } from "@/components/ui/action-link";
import { Body, Display, Label } from "@/components/ui/typography";
import { FlowDiagram } from "./manufacturing-visual";

/**
 * FLOW. The problem sits top-left, the answer lands lower-right after a
 * deliberate pause, and the production line runs the full width beneath —
 * the whole scene reads in the direction the work moves.
 */
export function ManufacturingScene() {
  const project = getProject(copy.slug);
  if (!project?.workflow) return null;

  return (
    <SceneShell
      id="manufacturing"
      index="05"
      layer="enterprise"
      railLabel="Flow"
      labelledBy="mfg-title"
    >
      <div className="pb-24 pt-24 md:pb-36 md:pt-32">
        <Label>{copy.category}</Label>
        <Display id="mfg-title" className="mt-5 max-w-[16ch]">
          {copy.statement}
        </Display>
        {/* The pause, then the answer — offset along the direction of flow. */}
        <Display as="p" className="mt-20 text-accent md:mt-28 lg:ml-[50%]">
          {copy.turn}
        </Display>

        <div className="mt-16 md:mt-20">
          <FlowDiagram diagram={project.workflow} />
        </div>

        <div className="mt-12 grid gap-10 md:mt-16 lg:grid-cols-12">
          <Body className="text-lg md:text-lg lg:col-span-6">{copy.body}</Body>
          <div className="flex flex-col gap-2 lg:col-span-5 lg:col-start-8">
            <MetricMeta metric={metrics.manufacturingOperation} />
            <MetricMeta metric={metrics.manufacturingUsers} />
            <ActionLink href={projectHref(project.slug)} className="mt-6 self-start">
              Explore the system
            </ActionLink>
          </div>
        </div>
      </div>
    </SceneShell>
  );
}
