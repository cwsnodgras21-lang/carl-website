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
    title: "Industrial Controls Troubleshooting",
    body: "Troubleshot industrial equipment after it reached the real world: mechanical systems, controls, and PLCs.",
    layer: "controls",
  },
  {
    period: "2025–Present",
    title: "Software",
    body: "Moved into enterprise application development and architecture, and began building software independently.",
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
