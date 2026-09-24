/**
 * Homepage copy, one block per scene. Kept out of the scene components so
 * wording can change without touching layout or animation code.
 */

import { hasContact, links } from "./site";
import { isPending } from "./types";

export const hero = {
  eyebrow: "Carl Snodgrass",
  primaryCta: { label: "Explore my work", href: "#journey" },
  // Goes straight to NolTurn once its URL exists; until then, to the
  // closing scene's contact links, and not at all while there are none.
  secondaryCta: !isPending(links.nolturn.href)
    ? { label: "Work with me", href: links.nolturn.href }
    : hasContact
      ? { label: "Work with me", href: "#contact" }
      : null,
};

export const journey = {
  heading: "Built in layers.",
  closing: ["The tools changed.", "The way I solve problems didn't."],
};

export const scale = {
  label: "Scale",
};

export const projectExecution = {
  category: "Enterprise Systems",
  statement: "It started as a Procore replacement.",
  turn: "It didn't stay that way.",
  body: "What began as a tool for managing field execution grew into a connected project platform spanning quality, materials, engineering, procurement, and operational workflows.",
  slug: "project-execution-platform",
};

export const manufacturing = {
  category: "Manufacturing",
  statement: "Excel wasn't a manufacturing system.",
  turn: "So I built one.",
  body: "A manufacturing platform spanning engineering intake, production control, shop-floor execution, part traceability, operational dashboards, and shipping.",
  slug: "manufacturing-platform",
};

export const customerOperations = {
  category: "Customer Operations",
  statement: "One screen instead of ten places to look.",
  body: "I built systems that bring drawings, PLC information, manuals, support tickets, warranty management, and spare-parts operations together around the customer.",
  slug: "customer-operations",
};

/**
 * A quick win is a transformation: old process → intervention → new process.
 * Values come from metrics where one exists; the words around them are the
 * supplied descriptions, not new claims.
 */
export type QuickWinStage = {
  /** Headline value for this side of the transformation. */
  value?: string;
  /** What it was / what it became, in plain words. */
  text?: string;
};

export type QuickWin = {
  id: string;
  label: string;
  /** Metric the values come from (before/after or value). */
  metric?: string;
  before: QuickWinStage;
  /** The intervention — what was built. */
  via: string;
  after: QuickWinStage;
};

export const quickWins = {
  heading: "Not every useful system needs to be huge.",
  items: [
    {
      id: "bom",
      label: "BOM processing",
      metric: "bomProcessing",
      before: { text: "Tens of thousands of raw engineering lines" },
      via: "Aggregation + warehouse inventory check",
      after: { text: "Actionable material demand" },
    },
    {
      id: "po",
      label: "Purchase orders",
      metric: "purchaseOrders",
      before: { text: "Purchase-order preparation" },
      via: "Safe Sage import generated directly from Quickbase",
      after: {},
    },
    {
      id: "reuse",
      label: "Material reuse",
      metric: "materialReuse",
      before: { text: "New project demand" },
      via: "Check available warehouse inventory before buying",
      after: {},
    },
    {
      id: "salesforce",
      label: "Salesforce",
      before: { text: "Salesforce" },
      via: "ZoomInfo + Sales Engagement integrations, campaign infrastructure, supporting configuration",
      after: { value: "Connected and live." },
    },
    {
      id: "custom",
      label: "Custom development",
      metric: "customCodePages",
      before: { value: "~$6,000", text: "Vendor quote for a single code page" },
      via: "Built internally",
      after: { text: "Custom code pages" },
    },
  ] satisfies QuickWin[],
};

export const nolturn = {
  label: "NolTurn",
  statement: "I build outside of work, too.",
  body: "NolTurn is where I experiment, build products, and turn real business problems into custom software.",
  inventory: {
    slug: "clinic-inventory",
    headline: "Inventory built around the people actually using it.",
  },
  factory: {
    slug: "software-factory",
    statement: ["AI can build fast.", "Fast still needs rules."],
    body: "I built a governed development system around AI-assisted coding with architecture decisions, standards, testing, security, documentation, and automated guardrails.",
  },
  cta: { label: "Explore NolTurn", href: "/work#nolturn" },
};

export const process = {
  heading: "From idea to system.",
  stages: [
    {
      index: "01",
      title: "Understand",
      body: "Figure out how the work actually happens. It's usually a few spreadsheets, three different processes, and one person who knows how they all fit together.",
    },
    { index: "02", title: "Visualize", body: "How should the work move?" },
    { index: "03", title: "Build", body: "Make the smallest useful version real." },
    {
      index: "04",
      title: "Refine",
      body: "Put it in front of the people who actually have to use it. They'll find what you missed.",
    },
  ],
  principle: "Complexity has to earn its existence.",
};

export const thinking = {
  label: "Thinking",
  heading: "Sometimes I write this stuff down.",
};

export const closing = {
  question: "Have one?",
};
