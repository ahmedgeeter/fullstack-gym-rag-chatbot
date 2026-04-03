import { ProductCard } from "@/components/products/ProductCard";
import type { ProductSummary } from "@/types/catalog";

type ProductGridProps = {
  products: ProductSummary[];
};

export const ProductGrid = ({ products }: ProductGridProps) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
);
