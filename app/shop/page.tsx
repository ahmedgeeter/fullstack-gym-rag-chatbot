import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import { EmptyState } from "@/components/shared/EmptyState";
import { buttonClasses } from "@/components/ui/button";
import { fetchStorefront } from "@/lib/utils/storefront";
import type { ApiMeta } from "@/lib/api/response";
import type { ProductSummary } from "@/types/catalog";

const usageOptions = [
  { label: "Home", value: "HOME" },
  { label: "Studio", value: "STUDIO" },
  { label: "Commercial", value: "COMMERCIAL" },
];

const footprintOptions = [
  { label: "Compact", value: "COMPACT" },
  { label: "Medium", value: "MEDIUM" },
  { label: "Large", value: "LARGE" },
];

const stockOptions = [
  { label: "In stock", value: "IN_STOCK" },
  { label: "Low stock", value: "LOW_STOCK" },
  { label: "Out of stock", value: "OUT_OF_STOCK" },
];

type Category = {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
};

type Brand = {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
};

const resolveParam = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] : value;

const buildQuery = (params: Record<string, string | undefined>) => {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  return search.toString();
};

type ShopPageProps = {
  searchParams?:
    | Record<string, string | string[] | undefined>
    | Promise<Record<string, string | string[] | undefined>>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const resolvedParams = await Promise.resolve(searchParams ?? {});
  const category = resolveParam(resolvedParams.category);
  const brand = resolveParam(resolvedParams.brand);
  const usageType = resolveParam(resolvedParams.usageType);
  const footprintTag = resolveParam(resolvedParams.footprintTag);
  const stockStatus = resolveParam(resolvedParams.stockStatus);
  const search = resolveParam(resolvedParams.search);
  const sort = resolveParam(resolvedParams.sort) ?? "featured";
  const minPrice = resolveParam(resolvedParams.minPrice);
  const maxPrice = resolveParam(resolvedParams.maxPrice);

  const query = buildQuery({
    category,
    brand,
    usageType,
    footprintTag,
    stockStatus,
    search,
    sort,
    minPrice,
    maxPrice,
    pageSize: "12",
  });

  const [productsResponse, categoriesResponse, brandsResponse] = await Promise.all([
    fetchStorefront<ProductSummary[]>(`/api/products?${query}`),
    fetchStorefront<Category[]>("/api/categories"),
    fetchStorefront<Brand[]>("/api/brands"),
  ]);

  const products = productsResponse.data ?? [];
  const meta = productsResponse.meta as ApiMeta | null;
  const categories = categoriesResponse.data ?? [];
  const brands = brandsResponse.data ?? [];

  const selected = {
    category,
    brand,
    usageType,
    footprintTag,
    stockStatus,
  };

  const filterGroups = [
    {
      title: "Category",
      name: "category",
      options: categories.map((item) => ({ label: item.name, value: item.slug })),
      type: "radio" as const,
    },
    {
      title: "Brand",
      name: "brand",
      options: brands.map((item) => ({ label: item.name, value: item.slug })),
      type: "radio" as const,
    },
    {
      title: "Usage",
      name: "usageType",
      options: usageOptions,
      type: "radio" as const,
    },
    {
      title: "Footprint",
      name: "footprintTag",
      options: footprintOptions,
      type: "radio" as const,
    },
    {
      title: "Stock",
      name: "stockStatus",
      options: stockOptions,
      type: "radio" as const,
    },
  ];

  const resultCount = meta?.total ?? products.length;

  return (
    <SiteShell>
      <div className="bg-background px-6 pb-16 pt-10">
        <form className="mx-auto w-full max-w-6xl space-y-8" method="get" action="/shop">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              eyebrow="Shop"
              title="All equipment"
              description="Premium equipment curated for European training spaces."
            />
            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
              <input
                type="search"
                name="search"
                defaultValue={search}
                placeholder="Search product, rack, or trainer"
                className="h-11 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-4 text-sm"
              />
              <select
                name="sort"
                defaultValue={sort}
                className="h-11 rounded-[var(--radius-sm)] border border-border bg-surface px-3 text-sm"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price (low to high)</option>
                <option value="price-desc">Price (high to low)</option>
              </select>
              <button type="submit" className={buttonClasses("secondary", "md")}>
                Apply
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted">
            <p>
              {resultCount} results
              {category ? ` · ${categories.find((item) => item.slug === category)?.name}` : ""}
              {brand ? ` · ${brands.find((item) => item.slug === brand)?.name}` : ""}
            </p>
            <Link href="/shop" className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              Clear filters
            </Link>
          </div>

          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <div className="space-y-4">
              <ProductFilters
                groups={filterGroups}
                selected={selected}
                minPrice={minPrice}
                maxPrice={maxPrice}
              />
              <div className="flex gap-3">
                <button type="submit" className={buttonClasses("primary", "md", "flex-1")}>
                  Apply filters
                </button>
                <Link href="/shop" className={buttonClasses("outline", "md")}>
                  Reset
                </Link>
              </div>
            </div>

            <div className="space-y-6">
              {products.length ? (
                <ProductGrid products={products} />
              ) : (
                <EmptyState
                  title="No equipment found"
                  description="Adjust filters or search to view available inventory."
                />
              )}

              {meta && meta.totalPages && meta.totalPages > 1 ? (
                <div className="flex items-center justify-between text-sm text-muted">
                  <span>
                    Page {meta.page} of {meta.totalPages}
                  </span>
                  <div className="flex gap-3">
                    {meta.page && meta.page > 1 ? (
                      <Link
                        href={`/shop?${buildQuery({ ...selected, sort, search, minPrice, maxPrice, page: String(meta.page - 1) })}`}
                        className={buttonClasses("outline", "sm")}
                      >
                        Previous
                      </Link>
                    ) : null}
                    {meta.page && meta.page < meta.totalPages ? (
                      <Link
                        href={`/shop?${buildQuery({ ...selected, sort, search, minPrice, maxPrice, page: String(meta.page + 1) })}`}
                        className={buttonClasses("outline", "sm")}
                      >
                        Next
                      </Link>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </form>
      </div>
    </SiteShell>
  );
}
