import { cn } from "@/lib/cn";

const base =
  "inline-flex items-center gap-2 border px-4 py-2.5 font-mono text-label uppercase transition-colors aria-disabled:cursor-not-allowed";

/**
 * Run + Reset, with a visible status line that is also the live region.
 * Unavailable buttons use aria-disabled rather than `disabled`, so focus
 * stays on the button the visitor just pressed.
 */
export function DemoControls({
  runLabel,
  onRun,
  onReset,
  canRun,
  canReset,
  status,
}: {
  runLabel: string;
  onRun: () => void;
  onReset: () => void;
  canRun: boolean;
  canReset: boolean;
  status: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
      <button
        type="button"
        onClick={() => canRun && onRun()}
        aria-disabled={!canRun}
        className={cn(
          base,
          "group border-accent text-foreground hover:bg-accent hover:text-background",
          "aria-disabled:border-border aria-disabled:text-muted aria-disabled:hover:bg-transparent",
        )}
      >
        {runLabel}
        <span aria-hidden="true" className="text-accent group-hover:text-background group-aria-disabled:text-muted">
          →
        </span>
      </button>
      <button
        type="button"
        onClick={() => canReset && onReset()}
        aria-disabled={!canReset}
        className={cn(
          base,
          "border-border text-muted hover:border-foreground hover:text-foreground",
          "aria-disabled:opacity-50 aria-disabled:hover:border-border aria-disabled:hover:text-muted",
        )}
      >
        Reset
      </button>
      <p role="status" aria-live="polite" className="font-mono text-label-sm uppercase text-technical">
        {status}
      </p>
    </div>
  );
}
