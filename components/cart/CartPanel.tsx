"use client";

import { Button } from "@/components/ui/button";
import { PriceDisplay } from "@/components/products/PriceDisplay";
import type { ProductSummary } from "@/types/catalog";

export type CartItem = {
  id: string;
  quantity: number;
  product: ProductSummary;
};

type CartPanelProps = {
  items: CartItem[];
};

export const CartPanel = ({ items }: CartPanelProps) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <aside className="flex w-full flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-sm">
      <h3 className="text-lg font-semibold">Cart summary</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm">
            <div>
              <p className="font-semibold">{item.product.name}</p>
              <p className="text-xs text-muted">Qty {item.quantity}</p>
            </div>
            <PriceDisplay price={item.product.price * item.quantity} size="sm" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-border pt-4 text-sm">
        <span className="text-muted">Subtotal</span>
        <PriceDisplay price={subtotal} size="md" />
      </div>
      <Button>Proceed to checkout</Button>
    </aside>
  );
};
