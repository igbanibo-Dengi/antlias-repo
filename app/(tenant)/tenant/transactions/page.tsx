import { TransactionsClient } from "./_components/TransactionsClient";
import {
  createTransactionAction,
  deleteTransactionAction,
  getTransactionsAction,
  updateTransactionAction,
} from "@/lib/actions/transaction/transaction.actions";
import { getAllTenantBranches } from "@/lib/actions/tenant/tenant.action";
import { getAllEmployees } from "@/lib/actions/employee/employee";

export default async function TransactionsPage() {
  const [branchesResult, employeesResult, transactionsResult] =
    await Promise.all([
      getAllTenantBranches(),
      getAllEmployees(),
      getTransactionsAction(),
    ]);

  const branches =
    branchesResult.success && branchesResult.data ? branchesResult.data : [];
  const employees =
    employeesResult.success && employeesResult.data ? employeesResult.data : [];
  const transactions =
    transactionsResult.success && transactionsResult.data
      ? transactionsResult.data
      : [];

  return (
    <TransactionsClient
      branches={branches}
      employees={employees}
      transactions={transactions}
      createTransaction={createTransactionAction}
      fetchTransactions={getTransactionsAction}
      updateTransaction={updateTransactionAction}
      deleteTransaction={deleteTransactionAction}
    />
  );
}
