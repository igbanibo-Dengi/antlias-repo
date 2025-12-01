"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import TransactionFormModal from "@/components/forms/TransactionFormModal";
import TableSection from "@/components/transactions-component/TableSection";
import type { Branch, Employee, ActionResponse } from "@/types";
import type { TransactionTableRow } from "@/types/general";
import type { TransactionFormValues } from "@/validators/transaction-validator";

interface TransactionsClientProps {
  branches: Branch[];
  employees: Employee[];
  transactions: TransactionTableRow[];
  createTransaction: (
    values: TransactionFormValues,
  ) => Promise<ActionResponse<unknown>>;
  fetchTransactions: (
    branchId?: string,
  ) => Promise<ActionResponse<TransactionTableRow[]>>;
  updateTransaction: (
    transactionId: string,
    values: TransactionFormValues,
  ) => Promise<ActionResponse<unknown>>;
  deleteTransaction: (transactionId: string) => Promise<ActionResponse<null>>;
}

export function TransactionsClient({
  branches,
  employees,
  transactions,
  createTransaction,
  fetchTransactions,
  updateTransaction,
  deleteTransaction,
}: TransactionsClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Transaction
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl overflow-hidden p-0">
          <DialogTitle className="sr-only">New transaction</DialogTitle>
          <TransactionFormModal
            branches={branches}
            employees={employees}
            onClose={() => setIsDialogOpen(false)}
            onSubmitAction={createTransaction}
          />
        </DialogContent>
      </Dialog>

      <TableSection
        branches={branches}
        employees={employees}
        transactions={transactions}
        fetchTransactions={fetchTransactions}
        updateTransaction={updateTransaction}
        deleteTransaction={deleteTransaction}
      />
    </div>
  );
}
