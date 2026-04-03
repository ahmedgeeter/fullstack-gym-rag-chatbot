import { RatingStars } from "@/components/products/RatingStars";
import type { Review } from "@/types/catalog";

const formatName = (review: Review) => {
  if (!review.customer) return "Verified customer";
  const first = review.customer.firstName ?? "";
  const last = review.customer.lastName ?? "";
  return `${first} ${last}`.trim() || "Verified customer";
};

export const ReviewCard = ({ review }: { review: Review }) => (
  <div className="rounded-[var(--radius-md)] border border-border bg-surface p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-sm font-semibold">{formatName(review)}</p>
      <RatingStars rating={review.rating} size="sm" />
    </div>
    <p className="mt-3 text-sm font-semibold text-foreground">{review.title}</p>
    <p className="mt-2 text-sm text-muted">{review.content}</p>
  </div>
);
