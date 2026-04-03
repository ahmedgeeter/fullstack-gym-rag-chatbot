type RatingStarsProps = {
  rating?: number;
  count?: number;
  size?: "sm" | "md";
};

const sizeStyles: Record<NonNullable<RatingStarsProps["size"]>, string> = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
};

export const RatingStars = ({ rating = 0, count, size = "md" }: RatingStarsProps) => {
  const rounded = Math.round(rating * 10) / 10;
  return (
    <div className="flex items-center gap-2 text-xs text-muted">
      <div className="flex items-center gap-1 text-accent">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={sizeStyles[size]}
            aria-hidden="true"
          >
            {star <= Math.round(rounded) ? "★" : "☆"}
          </span>
        ))}
      </div>
      <span className="text-muted">{rounded.toFixed(1)}</span>
      {typeof count === "number" ? <span>({count})</span> : null}
    </div>
  );
};
