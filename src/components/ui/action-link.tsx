import Link from "next/link";
import type { ReactNode } from "react";
import { isPending, type Maybe } from "@/content/types";
import { cn } from "@/lib/cn";

const arrows = {
  down: "↓",
  out: "↗",
  right: "→",
} as const;

type Props = {
  href: Maybe<string>;
  children: ReactNode;
  arrow?: keyof typeof arrows;
  variant?: "primary" | "quiet";
  className?: string;
};

const isExternal = (href: string) => /^(https?:|mailto:|tel:)/.test(href);

/**
 * The site's one link/button style. Handles internal routes, in-page
 * anchors, external URLs and links that haven't been supplied yet.
 */
export function ActionLink({
  href,
  children,
  arrow = "right",
  variant = "quiet",
  className,
}: Props) {
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
        arrow === "down" && "group-hover:translate-y-0.5",
        arrow === "right" && "group-hover:translate-x-1",
        arrow === "out" && "group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
      )}
    >
      {arrows[arrow]}
    </span>
  );

  if (isPending(href)) {
    return (
      <span
        className={cn(classes, "cursor-not-allowed border-dashed text-muted hover:text-muted")}
        title={`Link pending: ${href.pending}`}
      >
        {children}
        <span className="font-mono text-label normal-case text-technical">
          (link pending)
        </span>
      </span>
    );
  }

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
