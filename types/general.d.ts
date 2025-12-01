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

export interface TransactionTableRow {
  id: string;
  branchId: string;
  branchName: string;
  employeeId: string;
  employeeName: string | null;
  fuelType: string;
  quantity: string;
  unitPrice: string;
  cash: string;
  card: string;
  transfer: string;
  totalAmount: string;
  startTime: string;
  endTime: string;
  createdAt: string;
}
