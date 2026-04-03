"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/products/PriceDisplay";
import { QuantitySelector } from "@/components/products/QuantitySelector";
import { StatusBadge } from "@/components/shared/StatusBadge";

type AddToCartSectionProps = {
  price: number;
  compareAtPrice?: number | null;
  stockStatus?: string;
  shippingEstimateDays?: number | null;
};

export const AddToCartSection = ({
  price,
  compareAtPrice,
  stockStatus = "IN_STOCK",
  shippingEstimateDays,
}: AddToCartSectionProps) => {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-4 rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <PriceDisplay price={price} compareAtPrice={compareAtPrice} size="lg" />
        <StatusBadge status={stockStatus} />
      </div>
      <p className="text-sm text-muted">
        {shippingEstimateDays
          ? `Ships in ${shippingEstimateDays}–${shippingEstimateDays + 2} days.`
          : "Ships in 5–7 working days across Europe."}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <QuantitySelector value={quantity} onChange={setQuantity} />
        <Button className="flex-1" type="button">
          Add to cart
        </Button>
      </div>
      <Button variant="outline" className="w-full" type="button">
        Buy now
      </Button>
      <div className="text-xs text-muted">
        Secure checkout · VAT included · Assembly guides provided
      </div>
    </div>
  );
};
