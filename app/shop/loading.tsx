import { SiteShell } from "@/components/site/SiteShell";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ProductGridSkeleton } from "@/components/products/ProductGridSkeleton";

export default function ShopLoading() {
  return (
    <SiteShell>
      <div className="bg-background px-6 pb-16 pt-10">
        <div className="mx-auto w-full max-w-6xl space-y-8">
          <div className="space-y-3">
            <LoadingSkeleton className="h-4 w-40" />
            <LoadingSkeleton className="h-8 w-64" />
            <LoadingSkeleton className="h-4 w-80" />
          </div>
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <div className="space-y-4">
              <LoadingSkeleton className="h-8 w-32" />
              <LoadingSkeleton className="h-40 w-full" />
              <LoadingSkeleton className="h-40 w-full" />
            </div>
            <ProductGridSkeleton />
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
