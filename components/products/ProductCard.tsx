import Link from "next/link";
import { PriceDisplay } from "@/components/products/PriceDisplay";
import { RatingStars } from "@/components/products/RatingStars";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { ProductSummary } from "@/types/catalog";

const fallbackImage = "/images/fallback/product.jpg";

type ProductCardProps = {
  product: ProductSummary;
};

export const ProductCard = ({ product }: ProductCardProps) => {
  const image = (product.images?.[0]?.url ?? fallbackImage).replace(/&amp;/g, "&");

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-sm">
      <Link href={`/products/${product.slug}`} className="group">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-muted">
          <img
            src={image}
            alt={product.images?.[0]?.alt ?? product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>{product.brand?.name ?? "Coremont"}</span>
          {product.stockStatus && <StatusBadge status={product.stockStatus} />}
        </div>
        <Link href={`/products/${product.slug}`} className="space-y-1">
          <h3 className="text-base font-semibold leading-tight text-foreground">
            {product.name}
          </h3>
          {product.category?.name && (
            <p className="text-xs uppercase tracking-[0.2em] text-muted">
              {product.category.name}
            </p>
          )}
        </Link>
        <RatingStars rating={product.averageRating} count={product.reviewCount} size="sm" />
        <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice} />
      </div>
    </div>
  );
};
