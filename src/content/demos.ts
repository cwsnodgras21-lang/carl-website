/**
 * Copy for the interactive demos (homepage "See it work" + /demos).
 * The demos themselves run on synthetic data in `src/demos/`.
 */

export type DemoId = "bom" | "po" | "system";

export type Demo = {
  id: DemoId;
  index: string;
  name: string;
  /** Input → output, one line. */
  summary: string;
  problem: string;
  system: string;
  result: string;
  /** Before → after metric (by id), if the real version has one. */
  metric?: string;
};

export const demosIntro = {
  label: "Demos",
  heading: "See it work.",
  lede: "I can explain systems all day. It's more useful to actually use one.",
  pageBody: "Small, synthetic versions of the kinds of problems I solve.",
  note: "Synthetic data. Everything runs in your browser.",
};

export const demos: Demo[] = [
  {
    id: "bom",
    index: "01",
    name: "BOM Processor",
    summary: "Raw engineering BOM → purchase list.",
    problem:
      "An engineering BOM lists the same part many times, typed different ways, across assemblies. Some of it is already on the shelf.",
    system: "Normalize part numbers, aggregate by part, check inventory, calculate what's left to buy.",
    result: "A purchase list with only what actually needs buying.",
    metric: "bomProcessing",
  },
  {
    id: "po",
    index: "02",
    name: "PO Builder",
    summary: "Hand-entered PO lines → import-ready data.",
    problem: "Purchase-order lines get typed in by hand, in whatever format they arrived in, then re-keyed for import.",
    system: "Validate every line, format it to the import layout, hold anything a person needs to look at.",
    result: "Import-ready rows, and a short list of lines to fix.",
    metric: "purchaseOrders",
  },
  {
    id: "system",
    index: "03",
    name: "System Designer",
    summary: "A messy process → the smallest system that fixes it.",
    problem:
      "We track field issues across email, Excel, and Teams. Nobody knows who owns what or whether something was resolved.",
    system: "Pick what the process actually needs. Each requirement adds one piece and one rule.",
    result: "A simple architecture that covers it, and nothing it doesn't need.",
  },
];

export const demoHref = (id: DemoId) => `/demos#${id}`;
