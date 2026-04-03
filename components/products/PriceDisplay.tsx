import { formatCurrency } from "@/lib/utils/format";

type PriceDisplayProps = {
  price: number;
  compareAtPrice?: number | null;
  size?: "sm" | "md" | "lg";
};

const sizeStyles: Record<NonNullable<PriceDisplayProps["size"]>, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-xl",
};

export const PriceDisplay = ({ price, compareAtPrice, size = "md" }: PriceDisplayProps) => (
  <div className="flex items-center gap-3">
    <span className={`font-semibold ${sizeStyles[size]}`}>{formatCurrency(price)}</span>
    {compareAtPrice ? (
      <span className="text-sm text-muted line-through">
        {formatCurrency(compareAtPrice)}
      </span>
    ) : null}
  </div>
);
