import { SiteShell } from "@/components/site/SiteShell";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ProductGridSkeleton } from "@/components/products/ProductGridSkeleton";

export default function HomeLoading() {
  return (
    <SiteShell>
      <div className="bg-background px-6 pb-16 pt-10">
        <div className="mx-auto w-full max-w-6xl space-y-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <LoadingSkeleton className="h-4 w-32" />
              <LoadingSkeleton className="h-10 w-80" />
              <LoadingSkeleton className="h-4 w-96" />
              <div className="flex gap-3">
                <LoadingSkeleton className="h-11 w-32" />
                <LoadingSkeleton className="h-11 w-32" />
              </div>
            </div>
            <LoadingSkeleton className="aspect-[4/5] w-full" />
          </div>

          <div className="space-y-4">
            <LoadingSkeleton className="h-4 w-36" />
            <LoadingSkeleton className="h-8 w-64" />
            <LoadingSkeleton className="h-4 w-80" />
            <ProductGridSkeleton count={3} />
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
