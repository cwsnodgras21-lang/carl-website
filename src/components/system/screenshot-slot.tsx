import Image from "next/image";
import { isPending, type ProjectImage } from "@/content/types";
import { cn } from "@/lib/cn";

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
      <div className="relative aspect-[16/10] w-full overflow-hidden border border-border bg-surface">
        {isPending(image.src) ? (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <div aria-hidden="true" className="drafting-grid absolute inset-0 opacity-60" />
            <p className="relative max-w-xs text-center font-mono text-label normal-case tracking-normal text-technical">
              <span className="text-accent">screenshot pending</span>
              <br />
              {image.src.pending}
            </p>
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
        <figcaption className="mt-3 font-mono text-label text-technical">{image.caption}</figcaption>
      )}
    </figure>
  );
}
