import { isPending, type Maybe } from "@/content/types";

/** Renders supplied copy; nothing at all while it's pending. */
export function MaybeText({
  value,
  className,
}: {
  value: Maybe<string>;
  className?: string;
}) {
  if (isPending(value)) return null;
  return <p className={className}>{value}</p>;
}
