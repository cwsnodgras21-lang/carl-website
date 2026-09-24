import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  id?: string;
};

/** Technical voice: small monospace annotation. Use sparingly. */
export function Label({ as: Tag = "p", className, children, id }: Props) {
  return (
    <Tag
      id={id}
      className={cn("font-mono text-label uppercase text-technical", className)}
    >
      {children}
    </Tag>
  );
}

const displaySizes = {
  "2xl": "text-display-2xl",
  xl: "text-display-xl",
  lg: "text-display-lg",
  md: "text-display-md",
} as const;

/** Display voice: large statements and metrics. */
export function Display({
  as: Tag = "h2",
  size = "lg",
  className,
  children,
  id,
}: Props & { size?: keyof typeof displaySizes }) {
  return (
    <Tag
      id={id}
      className={cn(
        "font-display font-semibold text-balance [font-stretch:112%]",
        displaySizes[size],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

/** Functional voice: readable body copy with a sensible measure. */
export function Body({ as: Tag = "p", className, children }: Props) {
  return (
    <Tag
      className={cn(
        "max-w-[38rem] text-lg leading-relaxed text-muted text-pretty md:text-xl",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
