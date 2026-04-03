import * as React from "react";
import { cn } from "@/lib/utils/cn";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

type CardSectionProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = ({ className, ...props }: CardProps) => (
  <div
    className={cn(
      "rounded-[var(--radius-lg)] border border-border bg-surface shadow-sm",
      className
    )}
    {...props}
  />
);

export const CardHeader = ({ className, ...props }: CardSectionProps) => (
  <div className={cn("border-b border-border px-6 py-4", className)} {...props} />
);

export const CardTitle = ({ className, ...props }: CardSectionProps) => (
  <h3 className={cn("text-lg font-semibold text-foreground", className)} {...props} />
);

export const CardDescription = ({ className, ...props }: CardSectionProps) => (
  <p className={cn("text-sm text-muted", className)} {...props} />
);

export const CardContent = ({ className, ...props }: CardSectionProps) => (
  <div className={cn("px-6 py-4", className)} {...props} />
);

export const CardFooter = ({ className, ...props }: CardSectionProps) => (
  <div className={cn("border-t border-border px-6 py-4", className)} {...props} />
);
