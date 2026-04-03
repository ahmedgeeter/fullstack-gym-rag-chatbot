import * as React from "react";
import { cn } from "@/lib/utils/cn";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-11 w-full rounded-[var(--radius-sm)] border border-border bg-surface px-4 text-sm",
        "text-foreground placeholder:text-muted",
        "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20",
        "transition-colors",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";
