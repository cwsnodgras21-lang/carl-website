/**
 * Homepage copy, one block per scene. Kept out of the scene components so
 * wording can change without touching layout or animation code.
 */

export const hero = {
  eyebrow: "Carl Snodgrass",
  primaryCta: { label: "Explore my work", href: "#journey" },
  secondaryCta: { label: "Work with me", href: "#contact" },
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

export type QuickWin = {
  id: string;
  label: string;
  /** Metric id for the headline figure, if there is one. */
  metric?: string;
  /** Headline when there's no metric. */
  headline?: string;
  body: string[];
  list?: string[];
  footnote?: string;
};

export const quickWins = {
  heading: "Not every useful system needs to be huge.",
  items: [
    {
      id: "bom",
      label: "BOM Processing",
      metric: "bomProcessing",
      body: [
        "Tens of thousands of raw engineering lines aggregated into actionable material demand automatically.",
        "The system also checks available warehouse inventory against project demand before additional material is purchased.",
      ],
    },
    {
      id: "po",
      label: "Purchase Orders",
      metric: "purchaseOrders",
      body: ["A safe Sage import generated directly from Quickbase."],
    },
    {
      id: "reuse",
      label: "Material Reuse",
      metric: "materialReuse",
      body: [
        "Project demand checks available warehouse inventory before new material is purchased.",
      ],
    },
    {
      id: "salesforce",
      label: "Salesforce",
      headline: "Connected and live.",
      body: [],
      list: [
        "ZoomInfo integration",
        "Sales Engagement integration",
        "Campaign infrastructure",
        "Supporting Salesforce configuration",
      ],
    },
    {
      id: "custom",
      label: "Custom Development",
      metric: "customCodePages",
      body: [],
      footnote:
        "A vendor previously quoted approximately $6,000 for an individual code page.",
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
    { index: "01", title: "Understand", body: "What problem are we actually solving?" },
    { index: "02", title: "Visualize", body: "How should the work move?" },
    { index: "03", title: "Build", body: "Make the smallest useful version real." },
    { index: "04", title: "Refine", body: "Put it in front of people and learn." },
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
