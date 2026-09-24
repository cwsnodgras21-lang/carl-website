import { isPending, pending, type Article } from "./types";

/**
 * Writing. Only publish pieces that actually exist — no placeholder articles
 * to fill space. Adding one: append here; /thinking picks it up.
 */
export const articles: Article[] = [
  {
    slug: "organizational-gravity",
    title: "Organizational Gravity",
    summary:
      "Organizations accumulate weight as systems, processes, controls, and decisions pile up. Eventually, yesterday's decisions start determining what tomorrow can look like.",
    published: pending("Publication date"),
    body: pending("Essay text (or set externalUrl if it's published elsewhere)"),
    featured: true,
  },
];

/** Articles with something to read. The rest stay here, unpublished. */
export const publishedArticles = articles.filter(
  (article) => !isPending(article.body) || !!article.externalUrl,
);

export const getArticle = (slug: string) =>
  publishedArticles.find((article) => article.slug === slug);

export const articleHref = (slug: string) => `/thinking/${slug}`;
