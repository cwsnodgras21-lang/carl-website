import { ActionLink } from "@/components/ui/action-link";
import { Container } from "@/components/ui/container";
import { Display, Label } from "@/components/ui/typography";

export default function NotFound() {
  return (
    <Container className="flex min-h-[70svh] flex-col justify-center pt-24">
      <Label>404 · Open circuit</Label>
      <Display as="h1" size="lg" className="mt-6 max-w-[18ch]">
        Nothing is connected here.
      </Display>
      <ActionLink href="/" className="mt-10">
        Back to the start
      </ActionLink>
    </Container>
  );
}
