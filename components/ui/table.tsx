import * as React from "react";
import { cn } from "@/lib/utils/cn";

type TableProps = React.TableHTMLAttributes<HTMLTableElement>;

type TableSectionProps = React.HTMLAttributes<HTMLTableSectionElement>;

type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>;

type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement>;

type TableHeadCellProps = React.ThHTMLAttributes<HTMLTableCellElement>;

export const Table = ({ className, ...props }: TableProps) => (
  <div className="w-full overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface">
    <table className={cn("w-full border-collapse text-sm", className)} {...props} />
  </div>
);

export const TableHead = ({ className, ...props }: TableSectionProps) => (
  <thead className={cn("bg-surface-muted text-left", className)} {...props} />
);

export const TableBody = ({ className, ...props }: TableSectionProps) => (
  <tbody className={cn("divide-y divide-border", className)} {...props} />
);

export const TableRow = ({ className, ...props }: TableRowProps) => (
  <tr className={cn("text-foreground", className)} {...props} />
);

export const TableHeadCell = ({ className, ...props }: TableHeadCellProps) => (
  <th
    className={cn("px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em]", className)}
    {...props}
  />
);

export const TableCell = ({ className, ...props }: TableCellProps) => (
  <td className={cn("px-4 py-3", className)} {...props} />
);
