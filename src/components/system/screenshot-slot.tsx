import Image from "next/image";
import { isPending, type ProjectImage } from "@/content/types";
import { cn } from "@/lib/cn";

/** Images with a real, supplied asset. Pending ones are never shown. */
export const suppliedImages = (images: ProjectImage[]) => images.filter((image) => !isPending(image.src));

/**
 * Frame for real, sanitized product UI (public-ui projects only). Renders
 * nothing until a real asset exists — never a mock screenshot presented as
 * the product, and never a placeholder.
 */
export function ScreenshotSlot({
  image,
  className,
}: {
  image: ProjectImage;
  className?: string;
}) {
  if (isPending(image.src)) return null;
  return (
    <figure className={cn("w-full", className)}>
      <div className="relative aspect-[16/10] w-full border border-technical/50 bg-surface">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-top"
        />
      </div>
      {image.caption && (
        <figcaption className="mt-3 text-sm text-muted">{image.caption}</figcaption>
      )}
    </figure>
  );
}
