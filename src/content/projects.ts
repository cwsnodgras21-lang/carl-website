import { pending, type Project } from "./types";

/**
 * Project library: independent NolTurn work only. Do not add work built for
 * or during employment, even anonymized or with the figures changed.
 *
 * Adding a project: append an object here. /work and /work/[slug] pick it up.
 */
export const projects: Project[] = [
  {
    slug: "clinic-inventory",
    title: "Inventory",
    category: "NolTurn",
    status: "In use at the clinic since September 2026",
    summary: "Inventory management built for a small medical clinic.",
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
];

export const getProject = (slug: string) =>
  projects.find((project) => project.slug === slug);

export const projectHref = (slug: string) => `/work/${slug}`;
