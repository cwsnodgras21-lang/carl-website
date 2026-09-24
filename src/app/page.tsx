import type { Metadata } from "next";
import { MotionRoot } from "@/components/motion/motion-root";
import { ClosingScene } from "@/components/scenes/closing-scene";
import { CustomerOperationsScene } from "@/components/scenes/customer-operations-scene";
import { DemosScene } from "@/components/scenes/demos-scene";
import { HeroScene } from "@/components/scenes/hero-scene";
import { JourneyScene } from "@/components/scenes/journey-scene";
import { ManufacturingScene } from "@/components/scenes/manufacturing-scene";
import { NolTurnScene } from "@/components/scenes/nolturn-scene";
import { ProcessScene } from "@/components/scenes/process-scene";
import { ProjectExecutionScene } from "@/components/scenes/project-execution-scene";
import { QuickWinsScene } from "@/components/scenes/quick-wins-scene";
import { ScaleScene } from "@/components/scenes/scale-scene";
import { contactLinks, site } from "@/content/site";
import { pageMetadata } from "@/lib/page-metadata";

export const metadata: Metadata = pageMetadata({ description: site.description, path: "/" });

/**
 * Structured data for search engines: who this site is about, and the
 * profiles that are the same person. Only real links (never pending ones).
 */
const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.name,
  url: site.url,
  description: site.description,
  sameAs: contactLinks.map((link) => link.href).filter((href) => href.startsWith("http")),
};

/**
 * One system, assembled scene by scene: a single connection becomes
 * electrical, mechanical, controls, software, enterprise, product and AI
 * layers — then simplifies back to the original connection.
 */
export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        // JSON-LD must be inline; "<" is escaped so the content can't close the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, "\\u003c") }}
      />
      <HeroScene />
      <JourneyScene />
      <ScaleScene />
      <ProjectExecutionScene />
      <ManufacturingScene />
      <CustomerOperationsScene />
      <QuickWinsScene />
      <NolTurnScene />
      <ProcessScene />
      <DemosScene />
      <ClosingScene />
      <MotionRoot />
    </>
  );
}
