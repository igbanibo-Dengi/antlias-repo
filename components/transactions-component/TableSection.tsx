"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  Loader2,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TransactionTableRow } from "@/types/general";
import type { ActionResponse, Branch, Employee } from "@/types";
import { toast } from "sonner";
import {
  fuelTypeOptions,
  type TransactionFormValues,
} from "@/validators/transaction-validator";
import TransactionFormModal from "@/components/forms/TransactionFormModal";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
});

const formatCurrency = (value: string) => {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return value;
  }
  return currencyFormatter.format(numericValue);
};

const formatDateTime = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const truncateTransactionId = (id: string) => {
  if (!id) return "";
  if (id.length <= 10) return id;
  return `${id.slice(0, 4)}…${id.slice(-4)}`;
};

const copyTextToClipboard = async (value: string) => {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  if (typeof document !== "undefined") {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
};

interface TableSectionProps {
  transactions: TransactionTableRow[];
  branches: Branch[];
  employees: Employee[];
  fetchTransactions: (
    branchId?: string,
  ) => Promise<ActionResponse<TransactionTableRow[]>>;
  updateTransaction: (
    transactionId: string,
    values: TransactionFormValues,
  ) => Promise<ActionResponse<unknown>>;
  deleteTransaction: (transactionId: string) => Promise<ActionResponse<null>>;
}

export default function TableSection({
  transactions,
  branches,
  employees,
  fetchTransactions,
  updateTransaction,
  deleteTransaction,
}: TableSectionProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [branchFilter, setBranchFilter] = useState("all");
  const [tableData, setTableData] = useState(transactions);
  const [isPending, startTransition] = useTransition();
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [activeTransaction, setActiveTransaction] =
    useState<TransactionTableRow | null>(null);
  const [isEditEnabled, setIsEditEnabled] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<TransactionTableRow | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setTableData(transactions);
  }, [transactions]);

  const loadTransactions = useCallback(
    async (value?: string) => {
      const branchValue = value ?? branchFilter;
      try {
        const response = await fetchTransactions(
          branchValue === "all" ? undefined : branchValue,
        );
        if (!response.success || !response.data) {
          toast.error(response.error ?? "Failed to load transactions");
          return;
        }
        setTableData(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load transactions");
      }
    },
    [branchFilter, fetchTransactions],
  );

  const handleBranchChange = (value: string) => {
    setBranchFilter(value);
    startTransition(() => {
      loadTransactions(value);
    });
  };

  const handleViewClick = useCallback((transaction: TransactionTableRow) => {
    setActiveTransaction(transaction);
    setIsDetailsDialogOpen(true);
    setIsEditEnabled(false);
  }, []);

  const handleStartDelete = useCallback(() => {
    if (!activeTransaction) return;
    setTransactionToDelete(activeTransaction);
    setIsDeleteDialogOpen(true);
  }, [activeTransaction]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!transactionToDelete) return;
    const transactionId = transactionToDelete.id;
    setDeletingId(transactionId);
    try {
      const result = await deleteTransaction(transactionId);
      if (!result.success) {
        toast.error(result.error ?? "Failed to delete transaction");
        return;
      }
      toast.success("Transaction deleted successfully");
      await loadTransactions();
      if (activeTransaction?.id === transactionId) {
        setIsDetailsDialogOpen(false);
        setActiveTransaction(null);
        setIsEditEnabled(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete transaction");
    } finally {
      setDeletingId(null);
      setTransactionToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  }, [
    activeTransaction,
    deleteTransaction,
    loadTransactions,
    transactionToDelete,
  ]);

  const handleDeleteDialogChange = (open: boolean) => {
    setIsDeleteDialogOpen(open);
    if (!open) {
      setTransactionToDelete(null);
    }
  };

  const handleDetailsDialogChange = (open: boolean) => {
    setIsDetailsDialogOpen(open);
    if (!open) {
      setActiveTransaction(null);
      setIsEditEnabled(false);
    }
  };

  const handleCopyTransactionId = useCallback(async (transactionId: string) => {
    try {
      await copyTextToClipboard(transactionId);
      setCopiedId(transactionId);
      toast.success("Transaction ID copied");
    } catch (error) {
      console.error(error);
      toast.error("Unable to copy transaction ID");
    }
  }, []);

  useEffect(() => {
    if (!copiedId) return undefined;
    const timeout = setTimeout(() => setCopiedId(null), 2000);
    return () => clearTimeout(timeout);
  }, [copiedId]);

  const handleFormSuccess = useCallback(async () => {
    await loadTransactions();
    setIsEditEnabled(false);
    setIsDetailsDialogOpen(false);
    setActiveTransaction(null);
  }, [loadTransactions]);

  const handleUpdateTransaction = useCallback(
    async (values: TransactionFormValues): Promise<ActionResponse<unknown>> => {
      if (!activeTransaction) {
        return {
          success: false,
          error: "No transaction selected",
          statusCode: 400,
        } satisfies ActionResponse<unknown>;
      }

      return updateTransaction(activeTransaction.id, values);
    },
    [activeTransaction, updateTransaction],
  );

  const columns = useMemo<ColumnDef<TransactionTableRow>[]>(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: "id",
        header: "Transaction ID",
        cell: ({ row }) => {
          const transactionId = row.getValue("id") as string;
          const isCopied = copiedId === transactionId;
          return (
            <div className="flex items-start gap-2">
              <div className="flex flex-col">
                <span className="font-mono text-sm font-semibold text-foreground">
                  {truncateTransactionId(transactionId)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(row.original.createdAt)}
                </span>
              </div>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                aria-label="Copy transaction ID"
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                onClick={() => handleCopyTransactionId(transactionId)}
                title="Copy transaction ID"
              >
                {isCopied ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                <span className="sr-only">Copy transaction ID</span>
              </Button>
            </div>
          );
        },
      },
      {
        accessorKey: "branchName",
        header: "Branch",
      },
      {
        accessorKey: "employeeName",
        header: "Attendant",
      },
      {
        accessorKey: "fuelType",
        header: "Fuel Type",
        cell: ({ row }) => (
          <span className="capitalize">{row.getValue("fuelType")}</span>
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
      },
      {
        accessorKey: "quantity",
        header: "Liters",
        cell: ({ row }) => <span>{row.getValue("quantity")}</span>,
      },
      {
        accessorKey: "totalAmount",
        header: "Total",
        cell: ({ row }) => (
          <span className="font-medium">
            {formatCurrency(row.getValue("totalAmount"))}
          </span>
        ),
      },
      {
        accessorKey: "startTime",
        header: "Start",
        cell: ({ row }) => formatDateTime(row.original.startTime),
      },
      {
        accessorKey: "endTime",
        header: "End",
        cell: ({ row }) => formatDateTime(row.original.endTime),
      },
      {
        id: "actions",
        enableHiding: false,
        header: "",
        cell: ({ row }) => {
          const transaction = row.original;
          return (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="View transaction details"
              onClick={() => handleViewClick(transaction)}
              title="View transaction"
            >
              <Eye className="h-4 w-4" />
            </Button>
          );
        },
      },
    ],
    [copiedId, handleCopyTransactionId, handleViewClick],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <div className="w-full">
        <div className="mb-6 space-y-4 rounded-lg border bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <label className="flex flex-1 flex-col gap-1 text-sm">
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                Transaction ID
              </span>
              <Input
                placeholder="Search by transaction ID"
                value={
                  (table.getColumn("id")?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table.getColumn("id")?.setFilterValue(event.target.value)
                }
                className="w-full"
              />
            </label>
            <label className="flex flex-1 flex-col gap-1 text-sm">
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                Attendant
              </span>
              <Input
                placeholder="Search by attendant"
                value={
                  (table
                    .getColumn("employeeName")
                    ?.getFilterValue() as string) ?? ""
                }
                onChange={(event) =>
                  table
                    .getColumn("employeeName")
                    ?.setFilterValue(event.target.value)
                }
                className="w-full"
              />
            </label>
            <div className="flex flex-1 flex-col gap-1 lg:max-w-xs">
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                Branch
              </span>
              <Select
                value={branchFilter}
                onValueChange={handleBranchChange}
                disabled={!branches.length || isPending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by branch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All branches</SelectItem>
                  {branches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-none items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    Fuel Type <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {fuelTypeOptions.map((option) => (
                    <DropdownMenuCheckboxItem
                      key={option.value}
                      className="capitalize"
                      checked={(
                        (table
                          .getColumn("fuelType")
                          ?.getFilterValue() as string[]) || []
                      ).includes(option.value)}
                      onCheckedChange={(checked) => {
                        const currentFilters =
                          (table
                            .getColumn("fuelType")
                            ?.getFilterValue() as string[]) || [];
                        const newFilters = checked
                          ? [...currentFilters, option.value]
                          : currentFilters.filter(
                              (value) => value !== option.value,
                            );
                        table
                          .getColumn("fuelType")
                          ?.setFilterValue(
                            newFilters.length ? newFilters : undefined,
                          );
                      }}
                    >
                      {option.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    Columns <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white shadow-sm">
          <div className="w-full overflow-x-auto">
            <Table className="min-w-[900px]">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="text-muted-foreground"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="flex flex-col gap-4 px-2 py-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 lg:gap-8">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Rows per page</p>
              <select
                className="h-8 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value));
                }}
              >
                {[5, 10, 20, 30, 40, 50].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    {pageSize}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {isDetailsDialogOpen && activeTransaction ? (
        <Dialog
          open={isDetailsDialogOpen}
          onOpenChange={handleDetailsDialogChange}
        >
          <DialogContent className="h-[90vh] max-w-4xl overflow-y-auto p-0">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b px-6 py-4">
              <div>
                <DialogTitle className="text-xl font-semibold">
                  Transaction Details
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Created {formatDateTime(activeTransaction.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right text-xs font-semibold uppercase text-muted-foreground">
                  Edit Mode
                </div>
                <Switch
                  checked={isEditEnabled}
                  onCheckedChange={setIsEditEnabled}
                  aria-label="Toggle edit mode"
                  disabled={Boolean(deletingId)}
                />
              </div>
            </div>

            <div className="space-y-4 px-6 py-4">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                <span className="rounded-full bg-primary/10 px-3 py-1 capitalize text-primary">
                  {activeTransaction.fuelType}
                </span>
                <span className="rounded-full bg-muted px-3 py-1">
                  {activeTransaction.branchName}
                </span>
                <span className="rounded-full bg-muted px-3 py-1">
                  Attendant: {activeTransaction.employeeName}
                </span>
              </div>

              <div className="rounded-lg border bg-muted/30 px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground">
                      Transaction ID
                    </p>
                    <p className="font-mono text-base font-semibold">
                      {activeTransaction.id}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() =>
                      handleCopyTransactionId(activeTransaction.id)
                    }
                  >
                    {copiedId === activeTransaction.id ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                    {copiedId === activeTransaction.id ? "Copied" : "Copy ID"}
                  </Button>
                </div>
              </div>

              <TransactionFormModal
                branches={branches}
                employees={employees}
                mode="edit"
                initialTransaction={activeTransaction}
                onSubmitAction={handleUpdateTransaction}
                onClose={() => handleDetailsDialogChange(false)}
                onSuccess={handleFormSuccess}
                showHeader={false}
                readOnly={!isEditEnabled}
                renderActions={({
                  handleSubmit,
                  disableSubmit,
                  isSubmitting,
                }) => (
                  <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleStartDelete}
                      disabled={!activeTransaction || Boolean(deletingId)}
                      className="sm:order-1"
                    >
                      {deletingId ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : null}
                      Delete Transaction
                    </Button>
                    <div className="flex flex-col gap-2 sm:order-none sm:flex-row sm:items-center">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleDetailsDialogChange(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={disableSubmit}
                      >
                        {isSubmitting ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
                )}
              />
            </div>
          </DialogContent>
        </Dialog>
      ) : null}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={handleDeleteDialogChange}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete transaction?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The transaction will be removed
              permanently.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={Boolean(deletingId)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={Boolean(deletingId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingId ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
