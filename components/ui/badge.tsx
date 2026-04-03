import * as React from "react";
import { cn } from "@/lib/utils/cn";

type BadgeVariant = "neutral" | "accent" | "success" | "warning" | "error";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const badgeStyles: Record<BadgeVariant, string> = {
  neutral: "bg-surface-muted text-foreground",
  accent: "bg-accent-soft text-accent-strong",
  success: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200",
  warning: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200",
  error: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-200",
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = "neutral", ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        badgeStyles[variant],
        className
      )}
      {...props}
    />
  )
);

Badge.displayName = "Badge";
