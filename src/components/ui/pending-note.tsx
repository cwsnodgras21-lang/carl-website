import { cn } from "@/lib/cn";

/**
 * Visible marker for content Carl still needs to supply. Deliberately looks
 * like a drafting annotation rather than finished copy.
 */
export function PendingNote({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-block border border-dashed border-border px-2 py-1 font-mono text-label normal-case tracking-normal text-technical",
        className,
      )}
    >
      <span className="text-accent">pending</span> — {children}
    </span>
  );
}
