"use client";

import { useMemo, useState } from "react";
import { BOM_STAGES, processBom, type BomResult } from "@/demos/bom";
import { rawBom, stock } from "@/demos/bom-data";
import { cn } from "@/lib/cn";
import { DemoControls } from "./controls";
import { Pipeline } from "./pipeline";
import { OutputEmpty, PanelLabel, Stat } from "./parts";
import { usePipelineRun } from "./use-pipeline-run";

const S = { raw: 0, normalize: 1, aggregate: 2, inventory: 3, demand: 4, done: 5 } as const;

const status = [
  "Normalizing part numbers",
  "Aggregating by part",
  "Checking inventory",
  "Calculating demand",
  "Building the purchase list",
];

// Aggregation needs longer: the duplicate lines visibly fold away.
const dwell = (stage: number) => (stage === S.aggregate ? 1200 : stage === S.normalize ? 700 : 520);

const cols =
  "grid grid-cols-[minmax(0,1fr)_3.25rem_3.5rem_3.25rem] gap-x-3 md:grid-cols-[2rem_7.5rem_6.5rem_minmax(0,1fr)_4.5rem_4.5rem_4.5rem]";

function formatMs(ms: number) {
  return ms < 1 ? "< 1 ms" : `${ms.toFixed(1)} ms`;
}

export function BomProcessor() {
  const { reached, running, started, complete, track, start, reset } = usePipelineRun({ stages: BOM_STAGES.length, dwell });
  const [result, setResult] = useState<{ bom: BomResult; ms: number } | null>(null);
  const r = reached;

  const onRun = () => {
    // The real transformation, on the synthetic BOM, in this browser.
    const t0 = performance.now();
    const bom = processBom(rawBom, stock);
    setResult({ bom, ms: performance.now() - t0 });
    start();
  };

  const onReset = () => {
    reset();
    setResult(null);
  };

  const bom = result?.bom;
  const groups = useMemo(() => new Map(bom?.groups.map((g) => [g.part, g])), [bom]);

  // Collapse order for the fold: every line that isn't the first of its part.
  const folds = useMemo(() => {
    if (!bom) return new Map<number, number>();
    const ids = rawBom
      .filter((line) => bom.dropped.includes(line.id) || groups.get(bom.groupOf[line.id])?.lines[0] !== line.id)
      .map((line) => line.id);
    return new Map(ids.map((id, k) => [id, k]));
  }, [bom, groups]);

  const statusText =
    r < 0
      ? `Ready · ${rawBom.length} raw lines`
      : complete && bom
        ? `Done · ${bom.stats.rawLines} lines → ${bom.stats.partsToBuy} parts to buy`
        : `${status[Math.min(r, status.length - 1)]}…`;

  const toBuy = bom?.groups.filter((g) => g.toBuy > 0) ?? [];

  return (
    <div className="flex flex-col gap-10">
      <DemoControls
        runLabel="Process BOM"
        onRun={onRun}
        onReset={onReset}
        canRun={!started}
        canReset={started}
        status={statusText}
      />

      <Pipeline ref={track} stages={BOM_STAGES} reached={r} running={running} label="BOM processing stages" />

      <div className="grid gap-10 xl:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)] xl:gap-12">
        {/* INPUT → working set */}
        <div className="min-w-0">
          <PanelLabel>
            {r >= S.aggregate && bom ? `Working set · ${bom.stats.uniqueParts} parts` : `Input · raw BOM · ${rawBom.length} lines`}
          </PanelLabel>
          <div
            role="region"
            aria-label="Bill of materials"
            tabIndex={0}
            className="mt-3 max-h-[28rem] overflow-y-auto overscroll-contain border border-border bg-surface/40"
          >
            <div role="table" aria-label="Bill of materials lines" className="text-sm">
              <div role="rowgroup" className="sticky top-0 z-[1] bg-surface">
                <div role="row" className={cn(cols, "border-b border-border px-3 py-2 font-mono text-label-sm uppercase text-muted")}>
                  <span role="columnheader" className="hidden md:block">#</span>
                  <span role="columnheader" className="hidden md:block">Assembly</span>
                  <span role="columnheader">Part</span>
                  <span role="columnheader" className="hidden md:block">Description</span>
                  <span role="columnheader" className="text-right">Qty</span>
                  <span role="columnheader" className={cn("text-right transition-colors", r >= S.inventory && "text-foreground")}>
                    Stock
                  </span>
                  <span role="columnheader" className={cn("text-right transition-colors", r >= S.demand && "text-accent")}>
                    Buy
                  </span>
                </div>
              </div>
              <div role="rowgroup">
                {rawBom.map((line) => {
                  const part = bom && r >= S.normalize ? bom.normalized[line.id] : line.part;
                  const reformatted = bom ? bom.normalized[line.id] !== line.part : false;
                  const isRef = line.qty <= 0;
                  const folded = !!bom && r >= S.aggregate && folds.has(line.id);
                  const group = bom && !isRef ? groups.get(bom.groupOf[line.id]) : undefined;
                  const merged = r >= S.aggregate && group && group.lines.length > 1;
                  const assemblies = r >= S.aggregate && group && group.assemblies.length > 1;
                  const qty = r >= S.aggregate && group ? group.required : line.qty;
                  return (
                    <div
                      key={line.id}
                      role="row"
                      aria-hidden={folded || undefined}
                      data-bom-line={line.id}
                      className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-500 ease-out",
                        folded ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr]",
                      )}
                      style={folded ? { transitionDelay: `${(folds.get(line.id) ?? 0) * 22}ms` } : undefined}
                    >
                      <div className="min-h-0 overflow-hidden">
                        <div className={cn(cols, "items-baseline border-b border-border/60 px-3 py-2")}>
                          <span role="cell" className="hidden font-mono text-label-sm text-muted md:block">
                            {r >= S.aggregate ? "" : line.id}
                          </span>
                          <span role="cell" className="hidden truncate text-muted md:block">
                            {assemblies ? `${group.assemblies.length} assemblies` : line.assembly}
                          </span>
                          <span role="cell" className="min-w-0">
                            <span
                              className={cn(
                                "whitespace-pre font-mono text-[0.8rem] transition-colors duration-300",
                                r === S.normalize && reformatted ? "text-accent" : "text-foreground",
                              )}
                            >
                              {part}
                            </span>
                            <span className="block truncate text-xs text-muted md:hidden">
                              {line.description} · {assemblies ? `${group.assemblies.length} assemblies` : line.assembly}
                            </span>
                          </span>
                          <span role="cell" className="hidden truncate text-muted md:block">
                            {line.description}
                          </span>
                          <span role="cell" className="text-right font-mono tabular-nums">
                            {isRef && r >= S.normalize ? (
                              <span className="text-label-sm uppercase text-muted">ref</span>
                            ) : (
                              <span className={cn(merged ? "text-foreground" : "text-foreground/85")}>{qty}</span>
                            )}
                            {merged && (
                              <span className="block font-mono text-[0.65rem] text-accent">×{group.lines.length} lines</span>
                            )}
                          </span>
                          <span role="cell" className="text-right font-mono tabular-nums text-muted">
                            {r >= S.inventory && group ? group.onHand : ""}
                          </span>
                          <span role="cell" className="text-right font-mono tabular-nums">
                            {r >= S.demand && group ? (
                              <span className={group.toBuy > 0 ? "text-accent" : "text-muted"}>{group.toBuy}</span>
                            ) : (
                              ""
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* OUTPUT */}
        <div className="min-w-0">
          <PanelLabel>Output · purchase list</PanelLabel>
          {complete && bom && result ? (
            <div className="mt-3 border-t border-accent pt-6">
              <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
                <Stat value={bom.stats.rawLines} label="Raw lines processed" />
                <Stat value={bom.stats.uniqueParts} label="Unique parts" />
                <Stat value={bom.stats.linesConsolidated} label="Duplicate lines merged" />
                <Stat value={bom.stats.referenceLines} label="Reference lines dropped (qty 0)" />
                <Stat value={bom.stats.partsFromStock} label="Parts fully covered by inventory" />
                <Stat value={bom.stats.partsToBuy} label="Parts that need purchasing" accent />
                <Stat value={bom.stats.unitsFromStock} label="Units already in stock, not reordered" />
                <Stat value={formatMs(result.ms)} label="Compute time, this browser" />
              </dl>
              <table className="mt-8 w-full text-sm">
                <caption className="sr-only">Purchase list</caption>
                <thead className="font-mono text-label-sm uppercase text-muted">
                  <tr className="border-b border-border">
                    <th scope="col" className="py-2 text-left font-normal">Part</th>
                    <th scope="col" className="py-2 text-left font-normal">Description</th>
                    <th scope="col" className="py-2 text-right font-normal">Buy</th>
                  </tr>
                </thead>
                <tbody>
                  {toBuy.map((g) => (
                    <tr key={g.part} className="border-b border-border/60">
                      <td className="py-1.5 pr-3 font-mono text-[0.8rem]">{g.part}</td>
                      <td className="max-w-0 truncate py-1.5 pr-3 text-muted">{g.description}</td>
                      <td className="py-1.5 text-right font-mono tabular-nums text-accent">{g.toBuy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <OutputEmpty>
              {r < 0 ? "Process the BOM to build the purchase list." : "Working…"}
            </OutputEmpty>
          )}
        </div>
      </div>
    </div>
  );
}
