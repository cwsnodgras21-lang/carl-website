import type { Metric } from "./types";

/**
 * Every number on the site. Scenes and case studies reference these by id,
 * so a figure is only ever stated in one place. Do not add metrics that
 * Carl hasn't supplied.
 */
export const metrics = {
  projectWork: {
    id: "projectWork",
    value: "$500M+",
    label: "Project work supported",
  },
  manufacturingOperation: {
    id: "manufacturingOperation",
    value: "$150M",
    label: "Manufacturing operation supported",
  },
  manufacturingUsers: {
    id: "manufacturingUsers",
    value: "326",
    label: "Users",
  },
  spareParts: {
    id: "spareParts",
    value: "$20M",
    label: "Annual spare-parts sales managed",
    // Annualised from 9 months: $4M spare parts + $11M project spares.
    note: "About $5M/year in spare-parts order management and $15M/year in project spare-parts order management.",
    parts: [
      { value: "~$5M/yr", label: "Spare-parts order management" },
      { value: "~$15M/yr", label: "Project spare-parts order management" },
    ],
  },
  bomProcessing: {
    id: "bomProcessing",
    before: "~1 day",
    after: "seconds",
    label: "Engineering BOM processing",
  },
  purchaseOrders: {
    id: "purchaseOrders",
    before: "~2 hours",
    after: "~10 minutes",
    label: "Purchase-order processing",
  },
  softwareCost: {
    id: "softwareCost",
    value: "$350K+",
    label: "Annual software cost eliminated",
  },
  materialReuse: {
    id: "materialReuse",
    value: "~$1M/year",
    label: "Material reuse",
    qualifier: "Estimate",
  },
  customCodePages: {
    id: "customCodePages",
    value: "400+",
    label: "Custom code pages developed internally",
  },
} satisfies Record<string, Metric>;

export type MetricId = keyof typeof metrics;

export const getMetric = (id: string): Metric | undefined =>
  (metrics as Record<string, Metric>)[id];

/**
 * The homepage Scale scene. `scope` answers "how significant is this work?"
 * (primary reveal — project scenes only reference these quietly);
 * `improvement` shows what changed operationally.
 */
export const scaleMetrics: { scope: MetricId[]; improvement: MetricId[] } = {
  scope: ["projectWork", "manufacturingOperation", "spareParts"],
  improvement: ["bomProcessing", "purchaseOrders"],
};
