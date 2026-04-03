import * as React from "react";
import { cn } from "@/lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-white hover:bg-accent-strong focus-visible:ring-accent/40",
  secondary:
    "bg-surface-muted text-foreground hover:bg-accent-soft focus-visible:ring-accent/30",
  outline:
    "border border-border bg-transparent text-foreground hover:border-accent hover:text-accent focus-visible:ring-accent/30",
  ghost: "bg-transparent text-foreground hover:bg-surface-muted focus-visible:ring-accent/30",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export const buttonClasses = (
  variant: ButtonVariant,
  size: ButtonSize,
  className?: string
) =>
  cn(
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-semibold tracking-tight transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-60",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => (
    <button
      ref={ref}
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  )
);

Button.displayName = "Button";
