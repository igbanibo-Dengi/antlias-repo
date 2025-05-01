// types.ts
export type ExpenseStatus = "Approved" | "Pending" | "Rejected";

export interface Expense {
  id: string;
  date: string;
  category: string;
  amount: string;
  evidence: string;
  description: string;
  requestBy: string;
  dateCode: string;
  status: ExpenseStatus;
}
