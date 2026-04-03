"use client";

import { useState } from "react";
import { cn } from "@/lib/utils/cn";
import type { ProductImage } from "@/types/catalog";

const fallbackImage = "/images/fallback/product.jpg";

type ImageGalleryProps = {
  images?: ProductImage[];
  productName: string;
};

export const ImageGallery = ({ images = [], productName }: ImageGalleryProps) => {
  const gallery = (images.length ? images : [{ url: fallbackImage, alt: productName }]).map(
    (image) => ({
      ...image,
      url: image.url.replace(/&amp;/g, "&"),
    })
  );
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      <div className="aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface-muted">
        <img
          src={gallery[activeIndex]?.url}
          alt={gallery[activeIndex]?.alt ?? productName}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="grid grid-cols-4 gap-3">
        {gallery.map((image, index) => (
          <button
            key={`${image.url}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn(
              "overflow-hidden rounded-[var(--radius-sm)] border border-border bg-surface-muted transition",
              index === activeIndex ? "ring-2 ring-accent/50" : "opacity-80 hover:opacity-100"
            )}
          >
            <img src={image.url} alt={image.alt} className="h-20 w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};
