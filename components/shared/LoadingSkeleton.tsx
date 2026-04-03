import { cn } from "@/lib/utils/cn";

type LoadingSkeletonProps = {
  className?: string;
};

export const LoadingSkeleton = ({ className }: LoadingSkeletonProps) => (
  <div
    className={cn(
      "animate-pulse rounded-[var(--radius-sm)] bg-surface-muted",
      className
    )}
  />
);
