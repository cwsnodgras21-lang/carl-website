import { pending, type SiteLink } from "./types";

export const site = {
  name: "Carl Snodgrass",
  statement: "I turn ideas into working systems.",
  summary:
    "I build software around how businesses actually work, combining an engineering background with years spent in operations, customer support, controls, and enterprise systems.",
  description:
    "Carl Snodgrass builds software around how businesses actually work — combining an engineering background with years in operations, customer support, controls, and enterprise systems.",
  url: pending("Production domain"),
} as const;

export const links = {
  nolturn: {
    label: "Work with me through NolTurn",
    href: pending("NolTurn website URL"),
  },
  linkedin: {
    label: "Connect on LinkedIn",
    href: pending("LinkedIn profile URL"),
  },
  contact: {
    label: "Get in touch",
    href: pending("Public contact address (mailto:) or booking link"),
  },
} satisfies Record<string, SiteLink>;

export const navigation: { label: string; href: string }[] = [
  { label: "Work", href: "/work" },
  { label: "Demos", href: "/demos" },
  { label: "About", href: "/about" },
  { label: "Let's Talk", href: "/#contact" },
];
