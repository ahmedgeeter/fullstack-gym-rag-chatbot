"use client";

import { cn } from "@/lib/utils/cn";

type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

export const QuantitySelector = ({ value, onChange, min = 1, max = 20 }: QuantitySelectorProps) => {
  const clamp = (next: number) => Math.min(max, Math.max(min, next));

  return (
    <div className="inline-flex items-center rounded-[var(--radius-sm)] border border-border bg-surface">
      <button
        type="button"
        onClick={() => onChange(clamp(value - 1))}
        className={cn(
          "flex h-11 w-11 items-center justify-center text-lg text-muted",
          value <= min && "opacity-40"
        )}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="min-w-[44px] text-center text-sm font-semibold">{value}</span>
      <button
        type="button"
        onClick={() => onChange(clamp(value + 1))}
        className={cn(
          "flex h-11 w-11 items-center justify-center text-lg text-muted",
          value >= max && "opacity-40"
        )}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};
