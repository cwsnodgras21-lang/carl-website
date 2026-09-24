import type { MetadataRoute } from "next";
import { articleHref, publishedArticles } from "@/content/articles";
import { projectHref, projects } from "@/content/projects";
import { site } from "@/content/site";

/** Every public page. Unpublished articles aren't pages yet, so they're left out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/work",
    ...projects.map((project) => projectHref(project.slug)),
    "/demos",
    "/about",
    ...(publishedArticles.length > 0 ? ["/thinking"] : []),
    ...publishedArticles.map((article) => articleHref(article.slug)),
  ];
  return paths.map((path) => ({ url: new URL(path, site.url).toString() }));
}
