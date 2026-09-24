import { closing } from "@/content/home";
import { links, site } from "@/content/site";
import { Connection } from "@/components/system/connection";
import { SceneShell } from "@/components/system/scene-shell";
import { ActionLink } from "@/components/ui/action-link";
import { Display } from "@/components/ui/typography";

/** The system simplifies back to the original connection. */
export function ClosingScene() {
  return (
    <SceneShell
      id="contact"
      index="11"
      layer="connection"
      labelledBy="closing-title"
      rail="none"
      className="overflow-hidden"
    >
      <div className="flex min-h-[90svh] flex-col justify-center pb-24 pt-32">
        <Connection direction="up" className="mb-14" />
        <Display id="closing-title" size="xl" className="max-w-[14ch]">
          {site.statement}
        </Display>
        <Display as="p" size="md" className="mt-10 text-accent">
          {closing.question}
        </Display>
        <ul className="mt-14 flex flex-col items-start gap-6">
          {[links.nolturn, links.linkedin, links.contact].map((link, i) => (
            <li key={link.label}>
              <ActionLink href={link.href} variant={i === 0 ? "primary" : "quiet"}>
                {link.label}
              </ActionLink>
            </li>
          ))}
        </ul>
      </div>
    </SceneShell>
  );
}
