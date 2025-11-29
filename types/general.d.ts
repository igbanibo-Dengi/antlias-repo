// types.ts
export type ExpenseStatus = "Approved" | "Pending" | "Rejected";

export interface ExpenseTableRow {
  id: string;
  branchId: string;
  expenseType: string;
  amount: string;
  description: string | null;
  receiptPhoto: string | null;
  branchName: string;
  submittedBy: string;
  submittedOn: string;
}
