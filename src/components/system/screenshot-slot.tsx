import Image from "next/image";
import { isPending, type ProjectImage } from "@/content/types";
import { cn } from "@/lib/cn";

/** Images with a real, supplied asset. Pending ones are never shown. */
export const suppliedImages = (images: ProjectImage[]) => images.filter((image) => !isPending(image.src));

/**
 * Frame for real, sanitized product UI (public-ui projects only). Renders
 * nothing until a real asset exists — never a mock screenshot presented as
 * the product, and never a placeholder. Desktop screenshots fill a 16:10
 * frame; phone screenshots keep their own proportions in a narrow frame.
 */
export function ScreenshotSlot({
  image,
  className,
}: {
  image: ProjectImage;
  className?: string;
}) {
  if (isPending(image.src)) return null;
  const phone = image.phone;
  return (
    <figure className={cn("w-full", phone && "max-w-[18rem]", className)}>
      <div
        className={cn(
          "relative w-full overflow-hidden border border-technical/50 bg-surface",
          phone ? "rounded-[1.25rem]" : "aspect-[16/10]",
        )}
        style={phone ? { aspectRatio: `${phone.width} / ${phone.height}` } : undefined}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={phone ? "18rem" : "(min-width: 1024px) 50vw, 100vw"}
          className="object-cover object-top"
        />
      </div>
      {image.caption && (
        <figcaption className="mt-3 text-sm text-muted">{image.caption}</figcaption>
      )}
    </figure>
  );
}
