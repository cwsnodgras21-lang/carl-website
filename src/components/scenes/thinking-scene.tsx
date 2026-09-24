import Link from "next/link";
import { articleHref, articles } from "@/content/articles";
import { thinking } from "@/content/home";
import { SceneShell } from "@/components/system/scene-shell";
import { ActionLink } from "@/components/ui/action-link";
import { Display, Label } from "@/components/ui/typography";

export function ThinkingScene() {
  const featured = articles.filter((article) => article.featured);
  if (featured.length === 0) return null;

  return (
    <SceneShell
      id="thinking"
      index="10"
      layer="connection"
      railLabel="Writing"
      labelledBy="thinking-title"
    >
      <div className="pb-24 pt-8 md:pb-40">
        <Label>{thinking.label}</Label>
        <Display id="thinking-title" className="mt-6 max-w-[20ch]">
          {thinking.heading}
        </Display>

        <ul className="mt-16 md:mt-20">
          {featured.map((article) => (
            <li key={article.slug} className="border-t border-border pt-8">
              <article className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16">
                <h3 className="font-display text-display-md font-semibold [font-stretch:112%]">
                  <Link href={articleHref(article.slug)} className="transition-colors hover:text-accent">
                    {article.title}
                  </Link>
                </h3>
                <div>
                  <p className="text-lg leading-relaxed text-muted">{article.summary}</p>
                  <ActionLink href={articleHref(article.slug)} className="mt-8">
                    Read<span className="sr-only"> {article.title}</span>
                  </ActionLink>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </SceneShell>
  );
}
