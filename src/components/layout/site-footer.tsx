import Link from "next/link";
import { site } from "@/content/site";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <Container className="flex h-20 items-center justify-between">
        <Link
          href="/"
          className="font-mono text-label uppercase text-muted transition-colors hover:text-accent"
        >
          {site.name}
        </Link>
      </Container>
    </footer>
  );
}
