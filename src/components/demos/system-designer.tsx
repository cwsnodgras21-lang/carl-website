"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { defaultSelection, designSystem, requirements, today, type RequirementId } from "@/demos/system";
import type { DemoMotion } from "@/motion/demos";
import { SvgNode } from "@/components/system/svg-primitives";
import { SystemDiagram } from "@/components/system/system-diagram";
import { cn } from "@/lib/cn";
import { DemoControls } from "./controls";
import { OutputEmpty, PanelLabel } from "./parts";
import { useDemoMotion } from "./use-demo-motion";

/** Where things live today: three places, nothing connecting them. */
function Today() {
  const w = 96;
  const gap = 28;
  const width = today.length * w + (today.length - 1) * gap + 12;
  return (
    <figure>
      <svg aria-hidden="true" viewBox={`0 0 ${width} 66`} className="h-auto w-full max-w-[22rem]">
        {today.map((label, i) => (
          <SvgNode
            key={label}
            id={`today-${label}`}
            x={6 + i * (w + gap)}
            y={6 + (i % 2) * 12}
            w={w}
            label={label}
            variant="external"
          />
        ))}
      </svg>
      <figcaption className="mt-3 text-sm text-muted">
        Email, Excel and Teams. No shared record, no owner, no status.
      </figcaption>
    </figure>
  );
}

type Pending = { nodes: string[]; edges: string[] } | null;

export function SystemDesigner() {
  const [selected, setSelected] = useState<RequirementId[]>(defaultSelection);
  const [built, setBuilt] = useState(false);
  const motion = useDemoMotion();
  const loaded = useRef<DemoMotion | null>(null);
  const pending = useRef<Pending>(null);
  const figure = useRef<HTMLDivElement>(null);

  const design = designSystem(selected);
  const nodeIds = (ids: RequirementId[]) => designSystem(ids).diagram.columns.flat().map((n) => n.id);
  const edgeIds = (ids: RequirementId[]) => designSystem(ids).diagram.edges.map(([a, b]) => `${a}-${b}`);

  // After the new system renders (before paint), bring in what's new.
  useLayoutEffect(() => {
    const next = pending.current;
    const m = loaded.current;
    const root = figure.current;
    pending.current = null;
    if (!next || !m || !root) return;
    // Only the geometry on screen (wide or narrow).
    const visible = <T extends Element>(sel: string) =>
      Array.from(root.querySelectorAll<T>(sel)).filter((el) => el.getClientRects().length > 0);
    const nodes = next.nodes.flatMap((id) => visible(`[data-node="${id}"]`));
    const wires = next.edges.flatMap((id) => visible<SVGGeometryElement>(`[data-edge="${id}"] [data-wire]`));
    m.enter(nodes);
    m.draw(wires, { delay: 120 });
  });

  const onBuild = async () => {
    loaded.current = await motion.load();
    pending.current = { nodes: nodeIds(selected), edges: edgeIds(selected) };
    setBuilt(true);
  };

  const onReset = () => {
    motion.stop();
    pending.current = null;
    setBuilt(false);
    setSelected(defaultSelection);
  };

  const toggle = (id: RequirementId) => {
    const next = selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id];
    if (built) {
      const before = new Set([...nodeIds(selected), ...edgeIds(selected)]);
      pending.current = {
        nodes: nodeIds(next).filter((n) => !before.has(n)),
        edges: edgeIds(next).filter((e) => !before.has(e)),
      };
    }
    setSelected(next);
  };

  const pieces = design.diagram.columns.length;
  const statusText = built
    ? `System · ${pieces} pieces · ${design.rules.length} rules`
    : `Ready · ${selected.length} of ${requirements.length} requirements`;

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
        <div>
          <PanelLabel>Input · today</PanelLabel>
          <div className="mt-4">
            <Today />
          </div>
        </div>
        <fieldset>
          <legend className="font-mono text-label uppercase text-technical">Requirements</legend>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {requirements.map((req) => {
              const on = selected.includes(req.id);
              return (
                <li key={req.id}>
                  <label
                    className={cn(
                      "flex cursor-pointer items-center gap-3 border px-3 py-2.5 text-sm transition-colors",
                      "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
                      on ? "border-accent/70 text-foreground" : "border-border text-muted hover:border-technical",
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      onChange={() => toggle(req.id)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={cn(
                        "size-[9px] shrink-0 border transition-colors",
                        on ? "border-accent bg-accent" : "border-technical bg-background",
                      )}
                    />
                    {req.label}
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      </div>

      <DemoControls
        runLabel="Build system"
        onRun={onBuild}
        onReset={onReset}
        canRun={!built}
        canReset={built || selected.join() !== defaultSelection.join()}
        status={statusText}
      />

      <div className="min-w-0">
        <PanelLabel>Output · system</PanelLabel>
        {built ? (
          <div className="mt-4 border-t border-accent pt-8">
            <div ref={figure}>
              <SystemDiagram diagram={design.diagram} />
            </div>
            <ol className="mt-10 grid gap-x-12 gap-y-3 md:grid-cols-2">
              {design.rules.map((rule, i) => (
                <li key={rule} className="flex gap-4 border-t border-border/60 pt-3 text-base leading-snug">
                  <span className="font-mono text-label-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-foreground/90">{rule}</span>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <OutputEmpty>Pick the requirements, then build.</OutputEmpty>
        )}
      </div>
    </div>
  );
}
