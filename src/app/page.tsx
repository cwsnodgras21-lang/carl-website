import { ClosingScene } from "@/components/scenes/closing-scene";
import { CustomerOperationsScene } from "@/components/scenes/customer-operations-scene";
import { HeroScene } from "@/components/scenes/hero-scene";
import { JourneyScene } from "@/components/scenes/journey-scene";
import { ManufacturingScene } from "@/components/scenes/manufacturing-scene";
import { NolTurnScene } from "@/components/scenes/nolturn-scene";
import { ProcessScene } from "@/components/scenes/process-scene";
import { ProjectExecutionScene } from "@/components/scenes/project-execution-scene";
import { QuickWinsScene } from "@/components/scenes/quick-wins-scene";
import { ScaleScene } from "@/components/scenes/scale-scene";
import { ThinkingScene } from "@/components/scenes/thinking-scene";

/**
 * One system, assembled scene by scene: a single connection becomes
 * electrical, mechanical, controls, software, enterprise, product and AI
 * layers — then simplifies back to the original connection.
 */
export default function HomePage() {
  return (
    <>
      <HeroScene />
      <JourneyScene />
      <ScaleScene />
      <ProjectExecutionScene />
      <ManufacturingScene />
      <CustomerOperationsScene />
      <QuickWinsScene />
      <NolTurnScene />
      <ProcessScene />
      <ThinkingScene />
      <ClosingScene />
    </>
  );
}
