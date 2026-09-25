import { pending, type Project } from "./types";

/**
 * Project library. Employer work is `visualMode: "abstracted"`: no employer
 * names, internal application names, customers, screenshots or internal
 * architecture — conceptual diagrams and supplied metrics only.
 *
 * Adding a project: append an object here. /work and /work/[slug] pick it up.
 */
export const projects: Project[] = [
  {
    slug: "project-execution-platform",
    title: "Project execution platform",
    category: "Enterprise Systems",
    status: pending("Current status (e.g. in production since …)"),
    summary:
      "What began as a tool for managing field execution grew into a connected project platform spanning quality, materials, engineering, procurement, and operational workflows.",
    metrics: ["projectWork", "softwareCost"],
    technologies: pending("Platform and technologies used (public-safe level of detail)"),
    problem: "It started as a Procore replacement.",
    context: pending("Why replacing it mattered — cost, fit, workflow gaps (sanitized)"),
    system:
      "A tool for managing field execution that grew into a connected project platform spanning quality, materials, engineering, procurement, and operational workflows.",
    workflow: {
      title: "Project execution platform, conceptual architecture",
      columns: [
        [{ id: "pe", label: "Project Execution", core: true }],
        [
          { id: "field", label: "Field" },
          { id: "quality", label: "Quality" },
          { id: "materials", label: "Materials" },
          { id: "engineering", label: "Engineering" },
          { id: "procurement", label: "Procurement" },
        ],
        [{ id: "erp", label: "ERP" }],
      ],
      edges: [
        ["pe", "field"],
        ["pe", "quality"],
        ["pe", "materials"],
        ["pe", "engineering"],
        ["pe", "procurement"],
        ["procurement", "erp"],
      ],
    },
    outcome: pending("Outcomes beyond the two headline metrics, if any"),
    technicalNotes: pending("Optional technical notes for the progressive-disclosure section"),
    learned: pending("What I learned — short and specific"),
    images: [],
    featured: true,
    visualMode: "abstracted",
    owner: "employer",
  },
  {
    slug: "manufacturing-platform",
    title: "Manufacturing platform",
    category: "Manufacturing",
    status: pending("Current status"),
    summary:
      "A manufacturing platform spanning engineering intake, production control, shop-floor execution, part traceability, operational dashboards, and shipping.",
    metrics: ["manufacturingOperation", "manufacturingUsers"],
    technologies: pending("Platform and technologies used (public-safe level of detail)"),
    problem: "Excel wasn't a manufacturing system.",
    context: pending("What running production out of spreadsheets was costing (sanitized)"),
    system:
      "A manufacturing platform spanning engineering intake, production control, shop-floor execution, part traceability, operational dashboards, and shipping.",
    capabilities: [
      "Engineering intake",
      "Production control",
      "Shop-floor execution",
      "Part traceability",
      "Operational dashboards",
      "Shipping",
    ],
    workflow: {
      title: "Manufacturing flow, conceptual",
      flow: true,
      columns: [
        [{ id: "eng", label: "Engineering" }],
        [{ id: "pc", label: "Production Control" }],
        [{ id: "floor", label: "Shop Floor", core: true }],
        [{ id: "qa", label: "Quality" }],
        [{ id: "ship", label: "Shipping" }],
      ],
      edges: [
        ["eng", "pc"],
        ["pc", "floor"],
        ["floor", "qa"],
        ["qa", "ship"],
      ],
    },
    outcome: pending("Outcomes beyond scale and user count, if any"),
    technicalNotes: pending("Optional technical notes"),
    learned: pending("What I learned — short and specific"),
    images: [],
    featured: true,
    visualMode: "abstracted",
    owner: "employer",
  },
  {
    slug: "customer-operations",
    title: "Customer operations",
    category: "Customer Operations",
    status: pending("Current status"),
    summary:
      "Systems that bring drawings, PLC information, manuals, support tickets, warranty management, and spare-parts operations together around the customer.",
    metrics: ["spareParts"],
    technologies: pending("Platform and technologies used (public-safe level of detail)"),
    problem: pending(
      "What wasn't working before — the homepage framing is 'one screen instead of ten places to look'",
    ),
    context: pending("What a support call looked like before (sanitized)"),
    system:
      "Systems that bring drawings, PLC information, manuals, support tickets, warranty management, and spare-parts operations together around the customer.",
    workflow: {
      title: "Customer operations, conceptual architecture",
      columns: [
        [
          { id: "drawings", label: "Drawings" },
          { id: "plc", label: "PLC" },
          { id: "manuals", label: "Manuals" },
        ],
        [{ id: "engineer", label: "Support Engineer", core: true }],
        [{ id: "ticket", label: "Ticket" }],
        [
          { id: "warranty", label: "Warranty" },
          { id: "spares", label: "Spares" },
        ],
      ],
      edges: [
        ["drawings", "engineer"],
        ["plc", "engineer"],
        ["manuals", "engineer"],
        ["engineer", "ticket"],
        ["ticket", "warranty"],
        ["ticket", "spares"],
      ],
    },
    outcome: pending("Outcomes beyond spare-parts volume, if any"),
    technicalNotes: pending("Optional technical notes"),
    learned: pending("What I learned — short and specific"),
    images: [],
    featured: true,
    visualMode: "abstracted",
    owner: "employer",
  },
  {
    slug: "clinic-inventory",
    title: "Inventory",
    category: "NolTurn",
    status: "In use at the clinic since September 2026",
    summary: "Inventory management built for a small medical clinic.",
    metrics: [],
    technologies: pending("Stack"),
    problem:
      "When I started, the clinic ran its inventory on a three-column Google Sheet. Nobody had a clear picture of what was on hand or where it was, and keeping the sheet current ate up a lot of time.",
    context: pending("Why it mattered to the clinic"),
    system:
      "I built them an inventory system that tracks every supply by location (room, cabinet, shelf, bin), flags items that drop below their reorder point, tracks expiration dates, and keeps a full history of every item received, used or moved. It's been in use at the clinic since September 2026.",
    capabilities: [
      "Current inventory",
      "Medication stock",
      "Expiration management",
      "FEFO workflows",
      "Purchasing",
      "Receiving",
      "Counts",
      "Operational alerts",
    ],
    outcome: pending("Measured outcomes"),
    technicalNotes: pending("Optional technical notes"),
    learned: pending("What I learned — short and specific"),
    images: [
      {
        // Top of the live dashboard, captured on a phone. No patient data;
        // cropped above the activity feed so no staff names appear.
        src: "/work/clinic-inventory-dashboard.png",
        alt: "Inventory dashboard: quick actions, and counts of expired, expiring, out-of-stock and reorder items",
        phone: { width: 804, height: 1433 },
      },
    ],
    featured: true,
    visualMode: "public-ui",
    owner: "nolturn",
  },
  {
    slug: "software-factory",
    title: "Software Factory",
    category: "NolTurn",
    status: pending("Status"),
    summary:
      "A governed development system around AI-assisted coding with architecture decisions, standards, testing, security, documentation, and automated guardrails.",
    metrics: [],
    technologies: pending("Stack / tooling"),
    problem: "AI can build fast. Fast still needs rules.",
    context: pending("Why governance mattered — what went wrong without it"),
    system:
      "I built a governed development system around AI-assisted coding with architecture decisions, standards, testing, security, documentation, and automated guardrails.",
    capabilities: [
      "Architecture decisions",
      "Standards",
      "Tests",
      "Security",
      "AI guardrails",
      "Documentation",
    ],
    workflow: {
      title: "Software Factory pipeline",
      columns: [
        [{ id: "idea", label: "Idea" }],
        [{ id: "explore", label: "Explore" }],
        [{ id: "build", label: "Build" }],
        [{ id: "test", label: "Test" }],
        [{ id: "review", label: "Review" }],
        [{ id: "harden", label: "Harden" }],
        [{ id: "ship", label: "Ship", core: true }],
      ],
      edges: [
        ["idea", "explore"],
        ["explore", "build"],
        ["build", "test"],
        ["test", "review"],
        ["review", "harden"],
        ["harden", "ship"],
      ],
    },
    outcome: pending("Outcomes"),
    technicalNotes: pending("Optional technical notes"),
    learned: pending("What I learned — short and specific"),
    images: [
      {
        src: pending("Sanitized screenshot of the Software Factory"),
        alt: "Software Factory interface",
      },
    ],
    featured: true,
    visualMode: "public-ui",
    owner: "nolturn",
  },
];

export const getProject = (slug: string) =>
  projects.find((project) => project.slug === slug);

export const projectHref = (slug: string) => `/work/${slug}`;
