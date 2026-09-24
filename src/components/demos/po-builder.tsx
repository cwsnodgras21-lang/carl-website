"use client";

import { useState } from "react";
import { buildImport, manualPoLines, PO_STAGES, type ImportRow, type PoResult } from "@/demos/po";
import { cn } from "@/lib/cn";
import { DemoControls } from "./controls";
import { Pipeline } from "./pipeline";
import { OutputEmpty, PanelLabel } from "./parts";
import { usePipelineRun } from "./use-pipeline-run";

const S = { entry: 0, validate: 1, format: 2, done: 3 } as const;

const status = ["Validating lines", "Formatting to the import layout", "Writing import rows"];

const dwell = (stage: number) => (stage === S.validate ? 1100 : stage === S.format ? 1000 : 600);

/** Which typed field each failed check points at. */
const failedField: Record<string, keyof ImportRow> = { qty: "qty", item: "item" };

const cols =
  "grid grid-cols-[1.5rem_minmax(0,1fr)_3.75rem] gap-x-3 md:grid-cols-[2rem_4.5rem_6rem_minmax(0,1fr)_4rem_3.5rem_6.5rem_minmax(9rem,0.8fr)]";

const IMPORT_COLUMNS: { key: keyof ImportRow; label: string; align?: "right" }[] = [
  { key: "vendor", label: "vendor_id" },
  { key: "item", label: "item_no" },
  { key: "description", label: "description" },
  { key: "qty", label: "qty", align: "right" },
  { key: "uom", label: "uom" },
  { key: "needBy", label: "need_by" },
];

export function PoBuilder() {
  const { reached, running, started, complete, track, start, reset } = usePipelineRun({ stages: PO_STAGES.length, dwell });
  const [result, setResult] = useState<PoResult | null>(null);
  const r = reached;

  const onRun = () => {
    setResult(buildImport(manualPoLines));
    start();
  };
  const onReset = () => {
    reset();
    setResult(null);
  };

  const statusText =
    r < 0
      ? `Ready · ${manualPoLines.length} lines entered`
      : complete && result
        ? `Done · ${result.stats.ready} ready · ${result.stats.held} held`
        : `${status[Math.min(r, status.length - 1)]}…`;

  const validated = !!result && r >= S.validate;
  const formatted = !!result && r >= S.format;

  return (
    <div className="flex flex-col gap-10">
      <DemoControls
        runLabel="Build import"
        onRun={onRun}
        onReset={onReset}
        canRun={!started}
        canReset={started}
        status={statusText}
      />

      <Pipeline ref={track} stages={PO_STAGES} reached={r} running={running} label="PO import stages" />

      {/* INPUT */}
      <div className="min-w-0">
        <PanelLabel>Input · manual PO lines</PanelLabel>
        <div role="table" aria-label="Manual purchase-order lines" className="mt-3 border border-border bg-surface/40 text-sm">
          <div role="rowgroup">
            <div role="row" className={cn(cols, "border-b border-border bg-surface px-3 py-2 font-mono text-label-sm uppercase text-muted")}>
              <span role="columnheader">#</span>
              <span role="columnheader" className="hidden md:block">Vendor</span>
              <span role="columnheader">Item</span>
              <span role="columnheader" className="hidden md:block">Description</span>
              <span role="columnheader" className="text-right">Qty</span>
              <span role="columnheader" className="hidden md:block">UoM</span>
              <span role="columnheader" className="hidden md:block">Need by</span>
              <span role="columnheader" className="hidden md:block">Check</span>
            </div>
          </div>
          <div role="rowgroup">
            {manualPoLines.map((line, i) => {
              const res = result?.lines[i];
              const failed = validated && res && !res.ready ? res.checks.find((c) => !c.ok) : undefined;
              const bad = (field: keyof ImportRow) =>
                !!failed &&
                (failedField[failed.id] === field ||
                  (failed.id === "required" && failed.note.toLowerCase().includes(field === "needBy" ? "date" : field)));
              const shown = (field: keyof ImportRow, typed: string) => {
                if (!formatted || !res) return typed || "—";
                const v = res.formatted[field];
                return v === null || v === "" ? typed || "—" : String(v);
              };
              // Failed field: underlined copper. Reformatted field: copper while formatting.
              const tone = (field: keyof ImportRow) =>
                bad(field)
                  ? "text-accent underline decoration-accent/60 underline-offset-4"
                  : r === S.format && res?.changed.includes(field)
                    ? "text-accent"
                    : undefined;
              const cell = (field: keyof ImportRow) => cn("transition-colors duration-300", tone(field));
              return (
                <div
                  key={line.id}
                  role="row"
                  data-po-line={line.id}
                  className={cn(cols, "items-baseline gap-y-1 border-b border-border/60 px-3 py-2 last:border-b-0")}
                >
                  <span role="cell" className={cn("font-mono text-label-sm", failed?.id === "duplicate" ? "text-accent" : "text-muted")}>
                    {line.id}
                  </span>
                  <span role="cell" className={cn("hidden font-mono text-[0.8rem] md:block", cell("vendor"))}>
                    {shown("vendor", line.vendor)}
                  </span>
                  <span role="cell" className="min-w-0">
                    <span className={cn("whitespace-pre font-mono text-[0.8rem]", cell("item"))}>{shown("item", line.item)}</span>
                    <span className="block truncate text-xs text-muted md:hidden">
                      <span className={cell("vendor")}>{shown("vendor", line.vendor)}</span> ·{" "}
                      <span className={cell("needBy")}>{shown("needBy", line.needBy)}</span> · {shown("description", line.description)}
                    </span>
                  </span>
                  <span role="cell" className={cn("hidden truncate transition-colors duration-300 md:block", tone("description") ?? "text-muted")}>
                    {shown("description", line.description)}
                  </span>
                  <span role="cell" className="text-right font-mono text-[0.8rem] tabular-nums">
                    <span className={cell("qty")}>{shown("qty", line.qty)}</span>
                    <span className="text-muted md:hidden"> {shown("uom", line.uom)}</span>
                  </span>
                  <span role="cell" className={cn("hidden font-mono text-[0.8rem] md:block", cell("uom"))}>
                    {shown("uom", line.uom)}
                  </span>
                  <span role="cell" className={cn("hidden font-mono text-[0.8rem] md:block", cell("needBy"))}>
                    {shown("needBy", line.needBy)}
                  </span>
                  <span
                    role="cell"
                    className={cn(
                      "col-span-2 col-start-2 font-mono text-label-sm uppercase transition-opacity duration-300 md:col-span-1 md:col-start-auto",
                      validated ? "opacity-100" : "opacity-0",
                      failed ? "text-accent" : "text-technical",
                    )}
                    style={validated ? { transitionDelay: `${i * 70}ms` } : undefined}
                  >
                    {validated && res ? (res.ready ? "✓ OK" : `✕ ${res.held}`) : <span className="sr-only">Not checked</span>}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CHECKS + OUTPUT */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] lg:gap-12">
        <div>
          <PanelLabel>Checks</PanelLabel>
          {validated && result ? (
            <ul className="mt-3 border-t border-border">
              {(
                [
                  ["Required fields present", result.lines.filter((l) => l.checks[0].ok).length],
                  ["Quantity valid", result.lines.filter((l) => l.checks[1].ok).length],
                  ["Item number valid", result.lines.filter((l) => l.checks[2].ok).length],
                  ["Not a duplicate", result.lines.filter((l) => l.checks[3].ok).length],
                  ["Ready for export", result.stats.ready],
                ] as const
              ).map(([label, n], k) => (
                <li key={label} className={cn("flex items-baseline justify-between gap-4 border-b border-border/60 py-2 text-sm", k === 4 && "border-accent text-foreground")}>
                  <span className={k === 4 ? "text-foreground" : "text-muted"}>{label}</span>
                  <span className={cn("font-mono tabular-nums", n < manualPoLines.length ? "text-accent" : "text-foreground")}>
                    {n}/{manualPoLines.length}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <OutputEmpty>Four checks per line.</OutputEmpty>
          )}
        </div>

        <div className="min-w-0">
          <PanelLabel>Output · import file</PanelLabel>
          {complete && result ? (
            <>
              <div className="mt-3 border-t border-accent">
                <table className="w-full table-fixed text-sm">
                  <caption className="sr-only">Import-ready rows</caption>
                  <thead className="font-mono text-[0.7rem] text-muted">
                    <tr className="border-b border-border">
                      {IMPORT_COLUMNS.map((c) => (
                        <th
                          key={c.key}
                          scope="col"
                          className={cn(
                            "py-2 pr-3 font-normal",
                            c.align === "right" ? "text-right" : "text-left",
                            c.key === "description" && "hidden w-auto sm:table-cell",
                            c.key === "vendor" && "w-[5rem]",
                            c.key === "item" && "w-[5.5rem]",
                            c.key === "qty" && "w-[3rem]",
                            c.key === "uom" && "hidden w-[3.25rem] sm:table-cell",
                            c.key === "needBy" && "w-[6rem] pr-0",
                          )}
                        >
                          {c.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="font-mono text-[0.8rem]">
                    {result.lines
                      .filter((l) => l.ready)
                      .map((l) => (
                        <tr key={l.id} className="border-b border-border/60">
                          {IMPORT_COLUMNS.map((c) => (
                            <td
                              key={c.key}
                              className={cn(
                                "truncate py-1.5 pr-3",
                                c.align === "right" && "text-right tabular-nums",
                                c.key === "description" && "hidden font-sans text-sm text-muted sm:table-cell",
                                c.key === "uom" && "hidden sm:table-cell",
                                c.key === "needBy" && "pr-0",
                              )}
                            >
                              {String(l.formatted[c.key] ?? "")}
                            </td>
                          ))}
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-6 font-mono text-label uppercase text-technical">Held for review</p>
              <ul className="mt-2 text-sm">
                {result.lines
                  .filter((l) => !l.ready)
                  .map((l) => (
                    <li key={l.id} className="flex gap-3 border-b border-border/60 py-1.5">
                      <span className="font-mono text-label-sm text-muted">Line {l.id}</span>
                      <span className="text-accent">{l.held}</span>
                    </li>
                  ))}
              </ul>
            </>
          ) : (
            <OutputEmpty>{r < 0 ? "Build the import to see the rows that are ready to load." : "Working…"}</OutputEmpty>
          )}
        </div>
      </div>
    </div>
  );
}
