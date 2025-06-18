// components/StatusBadge.tsx
"use client";

import { Badge } from "@/components/ui/badge";
import { ExpenseStatus } from "@/types/general";

export function StatusBadge({ status }: { status: ExpenseStatus }) {
  const statusStyles = {
    Approved: "bg-green-600",
    Pending: "bg-yellow-500",
    Rejected: "bg-red-600",
  };

  return (
    <Badge
      className={`${statusStyles[status]} w-24 rounded-md text-sm font-normal text-white`}
    >
      {status}
    </Badge>
  );
}
