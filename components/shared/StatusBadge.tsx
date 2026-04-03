import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  status: string;
};

const statusMap: Record<string, { label: string; variant: "neutral" | "accent" | "success" | "warning" | "error" }> = {
  IN_STOCK: { label: "In stock", variant: "success" },
  LOW_STOCK: { label: "Low stock", variant: "warning" },
  OUT_OF_STOCK: { label: "Out of stock", variant: "error" },
  ACTIVE: { label: "Active", variant: "success" },
  DRAFT: { label: "Draft", variant: "neutral" },
  ARCHIVED: { label: "Archived", variant: "neutral" },
  PENDING: { label: "Pending", variant: "warning" },
  CONFIRMED: { label: "Confirmed", variant: "success" },
  FULFILLED: { label: "Fulfilled", variant: "success" },
  CANCELLED: { label: "Cancelled", variant: "error" },
  RETURNED: { label: "Returned", variant: "neutral" },
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const mapped = statusMap[status] ?? { label: status, variant: "neutral" };
  return <Badge variant={mapped.variant}>{mapped.label}</Badge>;
};
