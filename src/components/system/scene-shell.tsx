import type { ReactNode } from "react";
import type { SystemLayer } from "@/content/types";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/container";

/**
 * Every homepage scene sits on the same vertical "rail" in the left gutter.
 * Each scene draws only its own segment, styled for the technical layer it
 * represents, so the page reads as one continuous system without one giant
 * SVG. Hidden on small screens, where scenes carry their own geometry.
 */

const railStyles: Record<SystemLayer, string> = {
  connection: "border-l border-muted/60",
  electrical: "border-l-2 border-accent",
  mechanical: "rail-ticks",
  controls: "border-l border-dashed border-technical",
  software: "border-l-2 border-dotted border-technical",
  enterprise: "border-l-2 border-dotted border-technical",
  products: "border-l border-accent/70",
  ai: "border-l border-dashed border-accent/70",
};

const layerNames: Record<SystemLayer, string> = {
  connection: "Connection",
  electrical: "Electrical",
  mechanical: "Mechanical",
  controls: "Controls",
  software: "Software",
  enterprise: "Enterprise",
  products: "Products",
  ai: "AI",
};

type Props = {
  id: string;
  index: string;
  layer: SystemLayer;
  labelledBy: string;
  children: ReactNode;
  className?: string;
  /** Override the layer name printed on the rail. */
  railLabel?: string;
  /** "none": the scene draws its own section of the rail (hero, closing). */
  rail?: "default" | "none";
};

export function SceneShell({
  id,
  index,
  layer,
  labelledBy,
  children,
  className,
  railLabel,
  rail = "default",
}: Props) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-layer={layer}
      className={cn("relative", className)}
    >
      <Container className="md:grid md:grid-cols-[var(--rail)_minmax(0,1fr)]">
        <div aria-hidden="true" className="relative hidden md:block">
          {rail === "default" && (
            <div className={cn("absolute inset-y-0 left-3", railStyles[layer])} />
          )}
          {rail === "default" && (
            <div className="sticky top-24 h-0">
              <span className="absolute left-3 top-0 size-[9px] -translate-x-1/2 border border-foreground bg-background" />
              <div className="flex flex-col gap-3 pl-7">
                <span className="font-mono text-label leading-none text-muted">{index}</span>
                <span className="font-mono text-label uppercase text-technical [writing-mode:vertical-rl]">
                  {railLabel ?? layerNames[layer]}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="min-w-0">{children}</div>
      </Container>
    </section>
  );
}
