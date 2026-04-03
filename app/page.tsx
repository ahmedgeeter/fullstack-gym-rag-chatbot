import Link from "next/link";
import { SiteShell } from "@/components/site/SiteShell";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ProductGrid } from "@/components/products/ProductGrid";
import { CategoryNav } from "@/components/products/CategoryNav";
import { ProductCard } from "@/components/products/ProductCard";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { buttonClasses } from "@/components/ui/button";
import { fetchStorefront } from "@/lib/utils/storefront";
import type { ProductSummary, Review } from "@/types/catalog";

type Category = {
  id: string;
  name: string;
  slug: string;
  productCount?: number;
};

type Collection = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  heroImageUrl?: string | null;
  heroImageAlt?: string | null;
  featured?: boolean;
};

type CollectionDetail = Collection & { items?: ProductSummary[] };

const fallbackHero = "/images/fallback/hero.jpg";

export default async function HomePage() {
  const [featuredResponse, newResponse, categoriesResponse, collectionsResponse, reviewsResponse, bundlesResponse] =
    await Promise.all([
      fetchStorefront<ProductSummary[]>("/api/products?featured=true&pageSize=6"),
      fetchStorefront<ProductSummary[]>("/api/products?sort=newest&pageSize=4"),
      fetchStorefront<Category[]>("/api/categories"),
      fetchStorefront<Collection[]>("/api/collections"),
      fetchStorefront<Review[]>("/api/reviews?status=APPROVED"),
      fetchStorefront<CollectionDetail>("/api/collections/bundles"),
    ]);

  const featuredProducts = featuredResponse.data ?? [];
  const newArrivals = newResponse.data ?? [];
  const categories = categoriesResponse.data ?? [];
  const collections = collectionsResponse.data ?? [];
  const reviews = (reviewsResponse.data ?? []).slice(0, 3);
  const bundles = bundlesResponse.data?.items ?? [];

  const featuredIds = new Set(featuredProducts.map((product) => product.id));
  const heroProduct =
    newArrivals.find((product) => !featuredIds.has(product.id)) ??
    featuredProducts[0] ??
    newArrivals[0];
  const heroImage = heroProduct?.images?.[0]?.url ?? fallbackHero;
  const newArrivalCards = newArrivals.filter(
    (product) => product.id !== heroProduct?.id
  );
  const bestSellerCards = featuredProducts.filter(
    (product) => product.id !== heroProduct?.id
  );

  const categoryItems = categories.slice(0, 6).map((category) => ({
    label: category.name,
    href: `/shop?category=${category.slug}`,
    count: category.productCount,
  }));

  const collectionCards: Array<Collection | null> = collections.slice(0, 3);
  while (collectionCards.length < 3) {
    collectionCards.push(null);
  }

  return (
    <SiteShell>
      <div className="bg-background">
        <section id="home" className="px-6 pb-12 pt-10">
          <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
                Coremont Equipment
              </p>
              <h1 className="font-serif text-4xl font-semibold text-foreground md:text-5xl">
                Strength equipment for refined training spaces.
              </h1>
              <p className="max-w-xl text-sm text-muted md:text-base">
                European-made equipment with compact footprints, clean finishes, and delivery
                clarity for home gyms and boutique studios.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/shop" className={buttonClasses("primary", "md")}>
                  Shop equipment
                </Link>
                <Link href="/shop?category=bundles" className={buttonClasses("outline", "md")}>
                  View bundles
                </Link>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-muted">
                <span>Delivery in 5–7 working days</span>
                <span>VAT included</span>
                <span>Assembly guides included</span>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-md">
              <img
                src={heroImage}
                alt={heroProduct?.name ?? "Coremont hero"}
                className="h-full w-full object-cover"
              />
              {heroProduct ? (
                <div className="absolute bottom-4 left-4 rounded-[var(--radius-md)] border border-border bg-surface/90 px-4 py-3 backdrop-blur">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted">Featured</p>
                  <p className="text-sm font-semibold text-foreground">{heroProduct.name}</p>
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section id="categories" className="px-6 pb-12">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            <SectionHeading
              eyebrow="Categories"
              title="Browse by training focus"
              description="Select from targeted equipment sets tailored to modern European interiors."
            />
            {categoryItems.length ? (
              <CategoryNav items={categoryItems} />
            ) : (
              <EmptyState title="Categories loading" description="Catalog entries will appear here." />
            )}
          </div>
        </section>

        <section id="best-sellers" className="px-6 pb-12">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            <SectionHeading
              eyebrow="Best sellers"
              title="Coremont best sellers"
              description="Trusted pieces for compact and studio training environments."
            />
            {bestSellerCards.length ? (
              <ProductGrid products={bestSellerCards} />
            ) : (
              <EmptyState title="No featured products" description="Feature selection is updating." />
            )}
          </div>
        </section>

        <section id="new-arrivals" className="px-6 pb-12">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            <SectionHeading
              eyebrow="New arrivals"
              title="Latest arrivals"
              description="New additions curated for modern strength training routines."
            />
            {newArrivalCards.length ? (
              <div className="grid gap-6 md:grid-cols-2">
                {newArrivalCards.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <EmptyState title="No recent arrivals" description="New arrivals land weekly." />
            )}
          </div>
        </section>

        <section id="bundles" className="px-6 pb-12">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            <SectionHeading
              eyebrow="Bundles"
              title="Compact home gym sets"
              description="Complete bundles engineered for limited-space training." 
            />
            {bundles.length ? (
              <ProductGrid products={bundles.slice(0, 3)} />
            ) : (
              <EmptyState title="Bundles updating" description="Bundle inventory will return soon." />
            )}
          </div>
        </section>

        <section id="collections" className="px-6 pb-12">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            <SectionHeading
              eyebrow="Collections"
              title="Curated equipment stories"
              description="Merchandising collections built for specific training goals."
            />
            <div className="grid gap-6 md:grid-cols-3">
              {collectionCards.map((collection, index) => {
                if (!collection) {
                  return (
                    <div
                      key={`collection-placeholder-${index}`}
                      className="h-40 rounded-[var(--radius-lg)] border border-dashed border-border bg-surface"
                    />
                  );
                }

                return (
                  <Link
                    key={collection.id}
                    href={`/collections/${collection.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface"
                  >
                    <div className="flex-1 bg-surface-muted">
                      {collection.heroImageUrl ? (
                        <img
                          src={collection.heroImageUrl}
                          alt={collection.heroImageAlt ?? collection.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        />
                      ) : null}
                    </div>
                    <div className="space-y-2 p-4">
                      <p className="text-sm font-semibold text-foreground">{collection.name}</p>
                      <p className="text-xs text-muted">{collection.description}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <section id="assurance" className="px-6 pb-12">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            <SectionHeading
              eyebrow="Coremont assurance"
              title="Delivery, warranty, and support"
              description="Clear timelines, transparent service, and durable coverage."
            />
            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Reliable delivery",
                  copy: "Tracked EU delivery in 5–7 working days with appointment options.",
                },
                {
                  title: "Warranty coverage",
                  copy: "24–60 month warranties depending on equipment category.",
                },
                {
                  title: "Assembly guidance",
                  copy: "Digital guides and hardware support included with every order.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-sm"
                >
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-2 text-sm text-muted">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="px-6 pb-16">
          <div className="mx-auto w-full max-w-6xl space-y-6">
            <SectionHeading
              eyebrow="Reviews"
              title="Verified customer impressions"
              description="Recent feedback from studios and private clients across Europe."
            />
            {reviews.length ? (
              <div className="grid gap-6 md:grid-cols-3">
                {reviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            ) : (
              <EmptyState title="No reviews yet" description="Customer feedback will appear here." />
            )}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
