import * as React from "react";
import { cn } from "@/lib/utils/cn";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label = ({ className, ...props }: LabelProps) => (
  <label className={cn("text-xs font-semibold uppercase tracking-[0.08em]", className)} {...props} />
);
