import type { Milestone } from "./types";

export const milestones: Milestone[] = [
  {
    period: "Age 8",
    title: "Wired my first receptacle.",
    body: "Grew up working alongside my dad in his electrical contracting business.",
    layer: "electrical",
  },
  {
    period: "Teenage years",
    title: "Started fixing things for real.",
    body: "General contracting, plumbing, appliance repair, and eventually running service calls.",
    layer: "electrical",
  },
  {
    period: "2007–2012",
    title: "Mechanical Engineering",
    body: "Learned how physical systems are designed, analyzed, and built.",
    layer: "mechanical",
  },
  {
    period: "2012–2019",
    title: "Engineering + Estimating",
    body: "Designed systems, estimated projects, and learned how work moves from an idea to something people actually have to build.",
    layer: "mechanical",
  },
  {
    period: "2019–2025",
    title: "Customer Support + Controls",
    body: "Supported equipment after it reached the real world, troubleshooting mechanical systems, controls, PLCs, and the processes around them.",
    layer: "controls",
  },
  {
    period: "2025–Present",
    title: "Software",
    body: "Started building the tools I wished we'd had all along.",
    layer: "software",
  },
];

/** The disciplines accumulate; they don't replace each other. */
export const layers = [
  "Electrical",
  "Mechanical",
  "Operations",
  "Controls",
  "Software",
  "AI",
] as const;
