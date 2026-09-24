"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navigation, site } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Understated at the top of the page; settles into a minimal persistent bar
 * (solid background + hairline) once the visitor scrolls.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.documentElement.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled || open
          ? "border-border bg-background"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[90rem] items-center justify-between px-gutter">
        <Link
          href="/"
          onClick={close}
          className="font-mono text-label uppercase text-foreground transition-colors hover:text-accent"
        >
          {site.name}
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "text-sm transition-colors hover:text-accent",
                    item.href === "/#contact" ? "text-foreground" : "text-muted",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="font-mono text-label uppercase text-foreground md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Primary"
        hidden={!open}
        className="h-[calc(100svh-4rem)] border-t border-border bg-background px-gutter md:hidden"
      >
        <ul className="flex flex-col pt-8">
          {navigation.map((item) => (
            <li key={item.href} className="border-b border-border">
              <Link
                href={item.href}
                onClick={close}
                className="flex items-baseline justify-between py-5 font-display text-display-md font-semibold [font-stretch:112%]"
              >
                {item.label}
                <span aria-hidden="true" className="font-mono text-base text-accent">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
