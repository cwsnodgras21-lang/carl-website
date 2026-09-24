import Link from "next/link";
import type { ReactNode } from "react";
import { isPending, type Maybe } from "@/content/types";
import { cn } from "@/lib/cn";

const arrows = {
  down: "↓",
  out: "↗",
  right: "→",
} as const;

type Arrow = keyof typeof arrows;

type Props = {
  href: Maybe<string>;
  children: ReactNode;
  /** Defaults from the destination: ↗ leaves the site, ↓ stays on this page, → goes to another page. */
  arrow?: Arrow;
  variant?: "primary" | "quiet";
  className?: string;
};

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

/** The glyph must describe what the link actually does. */
function arrowFor(href: string): Arrow {
  if (isExternal(href)) return "out";
  if (href.startsWith("#")) return "down";
  return "right";
}

/**
 * The site's one link/button style. Handles internal routes, in-page
 * anchors and external URLs; renders nothing for a link that hasn't been
 * supplied yet.
 */
export function ActionLink({ href, children, arrow, variant = "quiet", className }: Props) {
  // A link without a real destination isn't shown at all.
  if (isPending(href)) return null;

  const glyphKind = arrow ?? arrowFor(href);
  const classes = cn(
    "group inline-flex items-baseline gap-2 font-sans text-base font-medium transition-colors md:text-lg",
    variant === "primary"
      ? "border-b-2 border-accent pb-1 text-foreground hover:text-accent"
      : "border-b border-border pb-1 text-foreground hover:border-accent hover:text-accent",
    className,
  );

  const glyph = (
    <span
      aria-hidden="true"
      className={cn(
        "font-mono text-accent transition-transform duration-200",
        glyphKind === "down" && "group-hover:translate-y-0.5",
        glyphKind === "right" && "group-hover:translate-x-1",
        glyphKind === "out" && "group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
      )}
    >
      {arrows[glyphKind]}
    </span>
  );

  if (isExternal(href)) {
    const newTab = href.startsWith("http");
    return (
      <a
        href={href}
        className={classes}
        {...(newTab && { target: "_blank", rel: "noopener noreferrer" })}
      >
        {children}
        {glyph}
        {newTab && <span className="sr-only">(opens in a new tab)</span>}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {children}
      {glyph}
    </Link>
  );
}
