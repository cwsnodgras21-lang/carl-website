import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articleHref, publishedArticles } from "@/content/articles";
import { thinking } from "@/content/home";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";

export const metadata: Metadata = {
  title: "Thinking",
  description: "Writing by Carl Snodgrass on systems, organizations, and building software.",
};

export default function ThinkingPage() {
  // Nothing published yet: the page doesn't exist rather than sitting empty.
  if (publishedArticles.length === 0) notFound();

  return (
    <>
      <PageHeader label={thinking.label} title={thinking.heading} />
      <Container className="pb-32">
        <ul>
          {publishedArticles.map((article) => (
            <li key={article.slug} className="border-t border-border">
              <Link
                href={articleHref(article.slug)}
                className="group grid gap-4 py-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-16"
              >
                <span className="font-display text-display-md font-semibold transition-colors [font-stretch:112%] group-hover:text-accent">
                  {article.title}
                </span>
                <span className="text-lg leading-relaxed text-muted">{article.summary}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
