import type { ReactNode } from "react";
import type { SystemLayer } from "@/content/types";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/container";

/**
 * Every homepage scene sits on one continuous system rail. Each scene draws
 * only its own segment, styled for the technical layer it represents, so the
 * page reads as one connection without a single page-length SVG.
 *
 * The line lives in the content column at `--rail-offset` on every
 * breakpoint (left gutter on phones, inside the rail column on desktop).
 * Desktop adds a sticky index + layer name in the rail column; the column is
 * wide enough that those labels can never reach the content.
 */

export const railClass: Record<SystemLayer, string> = {
  connection: "rail-connection",
  electrical: "rail-electrical",
  mechanical: "rail-mechanical",
  controls: "rail-controls",
  software: "rail-software",
  enterprise: "rail-enterprise",
  products: "rail-products",
  ai: "rail-ai",
  method: "rail-method",
};

/** A rail segment positioned on the shared rail line. */
export function RailSegment({
  layer,
  className,
  mask = false,
}: {
  layer: SystemLayer;
  className?: string;
  /** Paint the background under the pattern to hide a line behind it. */
  mask?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      data-rail={layer}
      className={cn(
        "pointer-events-none absolute left-[var(--rail-offset)] -translate-x-1/2",
        railClass[layer],
        mask && "bg-background",
        className,
      )}
    />
  );
}

/** A node on the rail: where a scene (or a step inside one) begins. */
export function RailNode({ className, accent = false }: { className?: string; accent?: boolean }) {
  return (
    <span
      aria-hidden="true"
      data-rail-node
      className={cn(
        "pointer-events-none absolute left-[var(--rail-offset)] z-[1] size-[9px] -translate-x-1/2 border",
        accent ? "border-accent bg-accent" : "border-foreground bg-background",
        className,
      )}
    />
  );
}

type Props = {
  id: string;
  index: string;
  layer: SystemLayer;
  /** Name printed on the desktop rail. Should not repeat the scene's own label. */
  railLabel: string;
  labelledBy: string;
  children: ReactNode;
  className?: string;
  /**
   * default — the shell draws the rail.
   * none    — the scene draws its own section (hero, closing).
   */
  rail?: "default" | "none";
  /** Desktop only: stack several layer styles down the scene, top to bottom. */
  segments?: SystemLayer[];
  /** Mobile only: the scene draws its own rail geometry (e.g. the journey). */
  mobileRail?: "default" | "self";
};

export function SceneShell({
  id,
  index,
  layer,
  railLabel,
  labelledBy,
  children,
  className,
  rail = "default",
  segments,
  mobileRail = "default",
}: Props) {
  const drawRail = rail === "default";

  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      data-layer={layer}
      className={cn("relative", className)}
    >
      <Container className="md:grid md:grid-cols-[var(--rail)_minmax(0,1fr)]">
        {/* Desktop rail column: sticky node, index and layer name. The sticky
            block has real height so it unsticks before the next scene's
            label arrives (they never stack). */}
        <div aria-hidden="true" className="relative hidden md:block">
          {drawRail && (
            <div className="sticky top-24 h-36">
              <span className="absolute left-3 top-0 z-[1] size-[9px] -translate-x-1/2 border border-foreground bg-background" />
              <div className="flex w-fit flex-col items-start gap-3 pl-6">
                <span className="font-mono text-label-sm leading-none text-muted">{index}</span>
                <span className="w-fit font-mono text-label-sm uppercase text-technical [writing-mode:vertical-rl]">
                  {railLabel}
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="relative min-w-0" data-scene-content>
          {drawRail && (
            <>
              {/* The line itself. */}
              {segments ? (
                <>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute inset-y-0 left-[var(--rail-offset)] hidden -translate-x-1/2 flex-col md:flex",
                    )}
                  >
                    {segments.map((segment) => (
                      <span
                        key={segment}
                        data-rail={segment}
                        className={cn("mx-auto flex-1", railClass[segment])}
                      />
                    ))}
                  </span>
                  <RailSegment
                    layer={layer}
                    className={cn("inset-y-0 md:hidden", mobileRail === "self" && "hidden")}
                  />
                </>
              ) : (
                <RailSegment
                  layer={layer}
                  className={cn("inset-y-0", mobileRail === "self" && "hidden md:block")}
                />
              )}
              {/* Scene start node on phones (desktop uses the sticky one). */}
              <RailNode className="top-0 md:hidden" />
            </>
          )}
          {children}
        </div>
      </Container>
    </section>
  );
}
