import Image from "next/image";
import { cn } from "@/lib/cn";

type PhotoThumbProps = {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
};

function isNextImageSrc(src: string) {
  return src.startsWith("/") || src.startsWith("https://");
}

export function PhotoThumb({ src, alt, className, priority = false }: PhotoThumbProps) {
  if (isNextImageSrc(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 440px) 33vw, 120px"
        className={cn("object-cover", className)}
        loading={priority ? "eager" : "lazy"}
        quality={75}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- data/blob URLs from local demo uploads
    <img
      src={src}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
    />
  );
}
