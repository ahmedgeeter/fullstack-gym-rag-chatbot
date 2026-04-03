import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

export const ProductGridSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <div
        key={`skeleton-${index}`}
        className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface"
      >
        <LoadingSkeleton className="aspect-[4/5] w-full" />
        <div className="space-y-3 p-4">
          <LoadingSkeleton className="h-4 w-1/2" />
          <LoadingSkeleton className="h-4 w-3/4" />
          <LoadingSkeleton className="h-3 w-1/3" />
        </div>
      </div>
    ))}
  </div>
);
