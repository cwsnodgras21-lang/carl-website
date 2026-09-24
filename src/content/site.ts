import { isPending, pending, type SiteLink } from "./types";

export const site = {
  name: "Carl Snodgrass",
  statement: "I turn ideas into working systems.",
  summary:
    "I build software around how businesses actually work, combining an engineering background with years spent in operations, customer support, controls, and enterprise systems.",
  description:
    "Carl Snodgrass builds software around how businesses actually work — combining an engineering background with years in operations, customer support, controls, and enterprise systems.",
  url: "https://carl.nolturn.io",
} as const;

export const links = {
  nolturn: {
    label: "Work with me through NolTurn",
    href: pending("NolTurn website URL"),
  },
  linkedin: {
    label: "Connect on LinkedIn",
    href: "https://www.linkedin.com/in/carl-snodgrass-4089591b",
  },
  contact: {
    label: "Get in touch",
    href: pending("Public contact address (mailto:) or booking link"),
  },
} satisfies Record<string, SiteLink>;

/**
 * Ways to reach Carl that actually go somewhere. Anything still pending is
 * left out, and every "contact" action on the site (nav, hero, About) only
 * appears once at least one of these exists.
 */
export const contactLinks = ([links.nolturn, links.linkedin, links.contact] as SiteLink[]).flatMap((link) =>
  isPending(link.href) ? [] : [{ label: link.label, href: link.href }],
);
export const hasContact = contactLinks.length > 0;

export const navigation: { label: string; href: string }[] = [
  { label: "Work", href: "/work" },
  { label: "Demos", href: "/demos" },
  { label: "About", href: "/about" },
  ...(hasContact ? [{ label: "Let's Talk", href: "/#contact" }] : []),
];
