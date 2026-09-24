import { isPending, type Maybe } from "@/content/types";
import { PendingNote } from "./pending-note";

/** Renders supplied copy, or a visible pending annotation. */
export function MaybeText({
  value,
  className,
}: {
  value: Maybe<string>;
  className?: string;
}) {
  if (isPending(value)) return <PendingNote>{value.pending}</PendingNote>;
  return <p className={className}>{value}</p>;
}
