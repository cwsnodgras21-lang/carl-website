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

/**
 * General professional capabilities. Skills only: no employer systems,
 * figures, vendors replaced, or outcomes. Keep it that way.
 */
export const capabilities = {
  heading: "What I bring.",
  groups: [
    {
      title: "Engineering",
      items: ["Mechanical and industrial engineering", "Industrial equipment and PLC troubleshooting"],
    },
    {
      title: "Software",
      items: [
        "Enterprise application development",
        "JavaScript, HTML, CSS, REST APIs, and webhooks",
        "Quickbase development",
      ],
    },
    {
      title: "Data and architecture",
      items: [
        "Relational data modeling",
        "PostgreSQL and Supabase, from independent work",
        "Application architecture and technical problem-solving",
      ],
    },
    {
      title: "Practice",
      items: [
        "Requirements discovery",
        "Business process automation",
        "Technical leadership and developer enablement",
        "AI-assisted software development",
      ],
    },
  ],
};

export const nolturn = {
  label: "NolTurn",
  statement: "I build outside of work, too.",
  body: "NolTurn is my independent business, separate from my employment. It's where I build products and turn real business problems into custom software.",
  inventory: {
    slug: "clinic-inventory",
    headline: "Inventory built around the people actually using it.",
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
