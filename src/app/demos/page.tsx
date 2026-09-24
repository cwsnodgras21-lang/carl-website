import type { Metadata } from "next";
import type { ReactNode } from "react";
import { demos, demosIntro, type DemoId } from "@/content/demos";
import { BomProcessor } from "@/components/demos/bom-processor";
import { DemoFrame } from "@/components/demos/demo-frame";
import { PoBuilder } from "@/components/demos/po-builder";
import { SystemDesigner } from "@/components/demos/system-designer";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { Body } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Demos",
  description: "Small, synthetic, interactive versions of the kinds of problems Carl Snodgrass solves.",
};

const instruments: Record<DemoId, ReactNode> = {
  bom: <BomProcessor />,
  po: <PoBuilder />,
  system: <SystemDesigner />,
};

export default function DemosPage() {
  return (
    <>
      <PageHeader label={demosIntro.label} title={demosIntro.heading}>
        <Body className="mt-8">{demosIntro.pageBody}</Body>
        <p className="mt-6 font-mono text-label-sm uppercase text-technical">{demosIntro.note}</p>
        <nav aria-label="Demos" className="mt-12">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {demos.map((demo) => (
              <li key={demo.id}>
                <a href={`#${demo.id}`} className="nav-link font-mono text-label uppercase text-foreground/85 hover:text-foreground">
                  <span className="text-accent">{demo.index}</span> {demo.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>
      <Container>
        {demos.map((demo) => (
          <DemoFrame key={demo.id} demo={demo}>
            {instruments[demo.id]}
          </DemoFrame>
        ))}
      </Container>
    </>
  );
}
