import type { ReactNode } from "react";
import { Container } from "./container";
import { Display, Label } from "./typography";

/** Top of an interior page. */
export function PageHeader({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <Container className="pb-16 pt-36 md:pb-24 md:pt-48">
      <Label>{label}</Label>
      <Display as="h1" size="xl" className="mt-6 max-w-[18ch]">
        {title}
      </Display>
      {children}
    </Container>
  );
}
