import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { articles, getArticle } from "@/content/articles";
import { isPending } from "@/content/types";
import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";
import { PageHeader } from "@/components/ui/page-header";
import { PendingNote } from "@/components/ui/pending-note";
import { Body } from "@/components/ui/typography";

export const dynamicParams = false;

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata(props: PageProps<"/thinking/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const article = getArticle(slug);
  return article ? { title: article.title, description: article.summary } : {};
}

export default async function ArticlePage(props: PageProps<"/thinking/[slug]">) {
  const { slug } = await props.params;
  const article = getArticle(slug);
  if (!article) notFound();

  return (
    <article>
      <PageHeader label="Thinking" title={article.title}>
        <Body className="mt-8">{article.summary}</Body>
        {!isPending(article.published) && (
          <p className="mt-6 font-mono text-label uppercase text-technical">
            <time dateTime={article.published}>{article.published}</time>
          </p>
        )}
      </PageHeader>
      <Container className="pb-32">
        <div className="max-w-2xl border-t border-border pt-14 text-lg leading-relaxed text-foreground/90 md:text-xl">
          {isPending(article.body) ? (
            <PendingNote>{article.body.pending}</PendingNote>
          ) : (
            <div className="flex flex-col gap-6">
              {article.body.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          )}
          {article.externalUrl && (
            <ActionLink href={article.externalUrl} arrow="out" className="mt-10">
              Read the full piece
            </ActionLink>
          )}
        </div>
        <div className="mt-20">
          <ActionLink href="/thinking">All writing</ActionLink>
        </div>
      </Container>
    </article>
  );
}
