import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function PanelLabel({ children }: { children: ReactNode }) {
  return <p className="font-mono text-label uppercase text-technical">{children}</p>;
}

export function OutputEmpty({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 border border-dashed border-border px-5 py-8 text-sm text-muted">{children}</p>
  );
}

export function Stat({
  value,
  label,
  note,
  accent,
}: {
  value: ReactNode;
  label: string;
  /** Secondary remark under the label. */
  note?: string;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col-reverse justify-end gap-1">
      <dt className="text-sm leading-snug text-muted">
        {label}
        {note && <span className="mt-1 block font-mono text-[0.7rem] leading-snug text-balance text-technical">{note}</span>}
      </dt>
      <dd
        className={cn(
          "font-display text-[1.6rem] font-semibold leading-none tabular-nums [font-stretch:112%]",
          accent ? "text-accent" : "text-foreground",
        )}
      >
        {value}
      </dd>
    </div>
  );
}
