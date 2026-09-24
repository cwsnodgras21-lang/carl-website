import Image from "next/image";
import { isPending, type ProjectImage } from "@/content/types";
import { cn } from "@/lib/cn";

/** Drafting-style corner marks: this frame is reserved for a real asset. */
function CropMarks() {
  const corner = "absolute size-4 border-accent";
  return (
    <span aria-hidden="true">
      <span className={cn(corner, "-left-px -top-px border-l-2 border-t-2")} />
      <span className={cn(corner, "-right-px -top-px border-r-2 border-t-2")} />
      <span className={cn(corner, "-bottom-px -left-px border-b-2 border-l-2")} />
      <span className={cn(corner, "-bottom-px -right-px border-b-2 border-r-2")} />
    </span>
  );
}

/**
 * Frame for real, sanitized product UI (public-ui projects only). Until a
 * real asset exists it renders an explicit placeholder — never a mock
 * screenshot presented as the product.
 */
export function ScreenshotSlot({
  image,
  className,
}: {
  image: ProjectImage;
  className?: string;
}) {
  return (
    <figure className={cn("w-full", className)}>
      <div className="relative aspect-[16/10] w-full border border-technical/50 bg-surface">
        {isPending(image.src) ? (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div aria-hidden="true" className="drafting-grid absolute inset-0" />
            <CropMarks />
            <div className="relative max-w-sm text-center">
              <p className="font-mono text-label uppercase text-accent">Screenshot pending</p>
              <p className="mt-3 text-base text-foreground/80">{image.alt}</p>
              <p className="mt-1 text-sm text-muted">{image.src.pending}</p>
            </div>
          </div>
        ) : (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-top"
          />
        )}
      </div>
      {image.caption && (
        <figcaption className="mt-3 text-sm text-muted">{image.caption}</figcaption>
      )}
    </figure>
  );
}
