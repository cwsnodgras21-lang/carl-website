import { capabilities } from "@/content/home";
import { SceneShell } from "@/components/system/scene-shell";
import { Display, Label } from "@/components/ui/typography";

/** General professional capabilities. Static: skills only, no outcomes or figures. */
export function CapabilitiesScene() {
  return (
    <SceneShell
      id="capabilities"
      index="03"
      layer="software"
      railLabel="Capabilities"
      labelledBy="capabilities-title"
    >
      <div className="pb-24 pt-24 md:pb-32 md:pt-32">
        <Display id="capabilities-title">{capabilities.heading}</Display>
        <div className="mt-14 grid gap-x-10 gap-y-12 md:mt-16 md:grid-cols-2">
          {capabilities.groups.map((group) => (
            <div key={group.title} className="border-t border-border pt-6">
              <Label>{group.title}</Label>
              <ul className="mt-5 flex flex-col gap-3 text-lg leading-snug text-foreground/85">
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </SceneShell>
  );
}
