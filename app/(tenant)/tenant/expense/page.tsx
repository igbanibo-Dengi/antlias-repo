import { ExpenseDialog } from "./_components/ExpenseDialog";
import { ExpenseTable } from "./_components/ExpenseTable";
import {
  createExpenseAction,
  deleteExpenseAction,
  getExpensesAction,
  updateExpenseAction,
} from "@/lib/actions/expense/expense.actions";
import { getAllTenantBranches } from "@/lib/actions/tenant/tenant.action";

export default async function ExpenseManagement() {
  const [expensesResult, branchesResult] = await Promise.all([
    getExpensesAction(),
    getAllTenantBranches(),
  ]);

  const expenses =
    expensesResult.success && expensesResult.data ? expensesResult.data : [];
  const branches =
    branchesResult.success && branchesResult.data ? branchesResult.data : [];

  return (
    <div className="space-y-8">
      <ExpenseDialog branches={branches} createExpense={createExpenseAction} />
      <ExpenseTable
        expenses={expenses}
        branches={branches}
        updateExpense={updateExpenseAction}
        deleteExpense={deleteExpenseAction}
      />
    </div>
  );
}
