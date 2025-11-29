"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
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
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  MoreHorizontal,
  Copy,
  Check,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ExpenseTableRow } from "@/types/general";
import type { Branch } from "@/types";
import { expenseTypeOptions } from "@/validators/expense-validator";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ExpenseForm from "./expenseform";
import type { ExpenseFormValues } from "@/validators/expense-validator";
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
import type { ActionResponse } from "@/types";

const expenseTypeLabelMap = expenseTypeOptions.reduce(
  (acc, option) => ({ ...acc, [option.value]: option.label }),
  {} as Record<string, string>,
);

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 2,
});

const formatAmount = (value: string) => {
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) {
    return value;
  }
  return currencyFormatter.format(numericValue);
};

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const imageExtensions = ["png", "jpg", "jpeg", "gif", "webp", "bmp", "svg"];
const uploadthingHosts = ["ufs.sh", "uploadthing.com"];

const isLikelyImage = (url: string | null | undefined) => {
  if (!url) return false;
  const sanitizedPath = url.split("?")[0]?.toLowerCase() ?? "";
  if (sanitizedPath.startsWith("data:image")) {
    return true;
  }
  if (imageExtensions.some((ext) => sanitizedPath.endsWith(`.${ext}`))) {
    return true;
  }

  try {
    const hostname = new URL(url).hostname.toLowerCase();
    return uploadthingHosts.some((host) => hostname.endsWith(host));
  } catch (error) {
    return false;
  }
};

interface ExpenseTableProps {
  expenses: ExpenseTableRow[];
  branches?: Branch[];
  updateExpense: (
    expenseId: string,
    values: ExpenseFormValues,
  ) => Promise<ActionResponse<unknown>>;
  deleteExpense: (expenseId: string) => Promise<ActionResponse<unknown>>;
}

export function ExpenseTable({
  expenses,
  branches = [],
  updateExpense,
  deleteExpense,
}: ExpenseTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [branchFilter, setBranchFilter] = useState<string>(
    () => searchParams.get("branch") ?? "all",
  );
  const [selectedExpense, setSelectedExpense] =
    useState<ExpenseTableRow | null>(null);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<ExpenseTableRow | null>(
    null,
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] =
    useState<ExpenseTableRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeRowMenuId, setActiveRowMenuId] = useState<string | null>(null);
  const triggerFileDownload = useCallback((url: string) => {
    if (!url) return;
    const anchor = document.createElement("a");
    anchor.href = url;
    const nameFromUrl = url.split("?")[0]?.split("/").pop() ?? "evidence";
    anchor.setAttribute("download", nameFromUrl);
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  }, []);

  const tableData = useMemo(() => expenses, [expenses]);
  const branchOptions = useMemo(() => {
    const branchNames = branches
      .map((branch) => branch.name)
      .filter((name): name is string => Boolean(name));
    const expenseBranchNames = expenses
      .map((expense) => expense.branchName)
      .filter((name): name is string => Boolean(name));
    return Array.from(new Set([...branchNames, ...expenseBranchNames])).sort();
  }, [branches, expenses]);

  const truncateId = useCallback((id: string) => {
    if (id.length <= 12) {
      return id;
    }
    return `${id.slice(0, 6)}...${id.slice(-4)}`;
  }, []);

  const handleCopyExpenseId = useCallback(async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      toast.success("Expense ID copied to clipboard");
      setTimeout(
        () => setCopiedId((current) => (current === id ? null : current)),
        2000,
      );
    } catch (error) {
      console.error(error);
      toast.error("Unable to copy expense ID");
    }
  }, []);

  const closeActiveRowMenu = useCallback(() => {
    setActiveRowMenuId(null);
  }, []);

  const openEvidenceModal = useCallback(
    (expense: ExpenseTableRow) => {
      closeActiveRowMenu();
      setSelectedExpense(expense);
      setIsEvidenceOpen(true);
    },
    [closeActiveRowMenu],
  );

  const openEditModal = useCallback(
    (expense: ExpenseTableRow) => {
      closeActiveRowMenu();
      setEditingExpense(expense);
      setIsEditDialogOpen(true);
    },
    [closeActiveRowMenu],
  );

  const closeEditModal = useCallback(() => {
    setIsEditDialogOpen(false);
    setEditingExpense(null);
  }, []);

  const promptDeleteExpense = useCallback(
    (expense: ExpenseTableRow) => {
      closeActiveRowMenu();
      setExpenseToDelete(expense);
    },
    [closeActiveRowMenu],
  );

  const handleDeleteExpense = useCallback(async () => {
    if (!expenseToDelete) return;
    setIsDeleting(true);
    try {
      const result = await deleteExpense(expenseToDelete.id);
      if (!result.success) {
        toast.error(result.error ?? "Failed to delete expense");
        return;
      }
      toast.success("Expense deleted successfully");
      if (selectedExpense?.id === expenseToDelete.id) {
        setIsEvidenceOpen(false);
        setSelectedExpense(null);
      }
      setExpenseToDelete(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete expense. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }, [deleteExpense, expenseToDelete, selectedExpense]);

  const handleBranchSelect = useCallback(
    (value: string) => {
      setBranchFilter(value);
      const params = new URLSearchParams(searchParams.toString());
      if (value === "all") {
        params.delete("branch");
      } else {
        params.set("branch", value);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    const paramValue = searchParams.get("branch") ?? "all";
    setBranchFilter((prev) => (prev === paramValue ? prev : paramValue));
  }, [searchParams]);

  const columns = useMemo<ColumnDef<ExpenseTableRow>[]>(
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
        header: "Expense ID",
        cell: ({ row }) => {
          const id = row.getValue("id") as string;
          const shortId = truncateId(id);
          const isCopied = copiedId === id;
          return (
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="cursor-pointer">
                      <div className="max-w-[120px] truncate font-medium">
                        {shortId}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(row.original.submittedOn)}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{id}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleCopyExpenseId(id)}
                aria-label="Copy expense ID"
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          );
        },
      },
      {
        accessorKey: "expenseType",
        header: "Category",
        cell: ({ row }) => (
          <span className="capitalize">
            {expenseTypeLabelMap[row.getValue("expenseType") as string] ??
              row.getValue("expenseType")}
          </span>
        ),
        filterFn: (row, id, value) => value.includes(row.getValue(id)),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => formatAmount(row.getValue("amount")),
      },
      {
        accessorKey: "branchName",
        header: "Branch",
      },
      {
        accessorKey: "submittedBy",
        header: "Submitted By",
      },
      {
        accessorKey: "submittedOn",
        header: "Submitted On",
        cell: ({ row }) => formatDate(row.getValue("submittedOn")),
      },
      {
        accessorKey: "receiptPhoto",
        header: "Evidence",
        cell: ({ row }) => (
          <Button
            variant="link"
            className="p-0 text-blue-600"
            onClick={() => openEvidenceModal(row.original)}
          >
            View
          </Button>
        ),
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu
            open={activeRowMenuId === row.original.id}
            onOpenChange={(open) =>
              setActiveRowMenuId(open ? row.original.id : null)
            }
          >
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openEvidenceModal(row.original)}>
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openEditModal(row.original)}>
                Edit expense
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={() => promptDeleteExpense(row.original)}
              >
                Delete expense
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [
      activeRowMenuId,
      copiedId,
      handleCopyExpenseId,
      openEvidenceModal,
      openEditModal,
      promptDeleteExpense,
      truncateId,
    ],
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

  useEffect(() => {
    const value = branchFilter === "all" ? undefined : branchFilter;
    table.getColumn("branchName")?.setFilterValue(value);
  }, [branchFilter, table]);

  return (
    <div className="w-full">
      <div className="mb-10 flex items-center justify-between rounded-lg bg-white p-4 py-4 shadow-sm">
        <p className="text-lg font-semibold">Expense</p>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search by expense ID..."
            value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("id")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Select
            value={branchFilter}
            onValueChange={handleBranchSelect}
            disabled={!branchOptions.length}
          >
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Filter by branch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All branches</SelectItem>
              {branchOptions.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <Filter className="mr-2 h-4 w-4" />
                Category
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {expenseTypeOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option.value}
                  className="capitalize"
                  checked={(
                    (table
                      .getColumn("expenseType")
                      ?.getFilterValue() as string[]) || []
                  ).includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentFilters =
                      (table
                        .getColumn("expenseType")
                        ?.getFilterValue() as string[]) || [];
                    const newFilters = checked
                      ? [...currentFilters, option.value]
                      : currentFilters.filter(
                          (value) => value !== option.value,
                        );
                    table
                      .getColumn("expenseType")
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
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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

      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <Table>
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

      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>

        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
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

          <div className="flex items-center space-x-2">
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

      <Dialog open={isEvidenceOpen} onOpenChange={setIsEvidenceOpen}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          {selectedExpense && (
            <div className="space-y-6">
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-2xl font-semibold">
                  Expense Details
                </DialogTitle>
                <DialogDescription>
                  Submitted on {formatDate(selectedExpense.submittedOn)}
                </DialogDescription>
              </DialogHeader>

              <div className="rounded-xl border bg-muted/20 p-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Expense ID
                    </p>
                    <p className="font-mono text-base">{selectedExpense.id}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCopyExpenseId(selectedExpense.id)}
                    className="gap-2"
                  >
                    {copiedId === selectedExpense.id ? (
                      <>
                        <Check className="h-4 w-4" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> Copy ID
                      </>
                    )}
                  </Button>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">
                      Branch
                    </p>
                    <p className="text-base font-medium">
                      {selectedExpense.branchName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">
                      Category
                    </p>
                    <p className="text-base font-medium capitalize">
                      {expenseTypeLabelMap[selectedExpense.expenseType] ??
                        selectedExpense.expenseType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">
                      Amount
                    </p>
                    <p className="text-lg font-semibold">
                      {formatAmount(selectedExpense.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">
                      Submitted by
                    </p>
                    <p className="text-base font-medium">
                      {selectedExpense.submittedBy}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <p className="text-sm font-semibold text-muted-foreground">
                  Description
                </p>
                <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                  {selectedExpense.description?.trim() ||
                    "No description provided."}
                </p>
              </div>

              <div className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground">
                      Evidence
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports images, PDF, and common Office documents
                    </p>
                  </div>
                  {selectedExpense.receiptPhoto && (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          triggerFileDownload(selectedExpense.receiptPhoto!)
                        }
                      >
                        Download
                      </Button>
                      <Button asChild variant="outline" size="sm">
                        <a
                          href={selectedExpense.receiptPhoto}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open in new tab
                        </a>
                      </Button>
                    </div>
                  )}
                </div>

                {selectedExpense.receiptPhoto ? (
                  <div className="mt-4 rounded-lg border bg-muted/10 p-3">
                    {isLikelyImage(selectedExpense.receiptPhoto) ? (
                      <img
                        src={selectedExpense.receiptPhoto}
                        alt="Expense evidence"
                        className="max-h-[360px] w-full rounded-md object-contain"
                      />
                    ) : (
                      <div className="flex h-[360px] flex-col items-center justify-center rounded-md bg-muted/30 text-center text-sm text-muted-foreground">
                        <p className="font-medium">
                          This receipt is not an image.
                        </p>
                        <p>
                          Please use the buttons above to download or open it.
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-muted-foreground">
                    No evidence uploaded.
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditDialogOpen}
        onOpenChange={(open) => {
          setIsEditDialogOpen(open);
          if (!open) {
            setEditingExpense(null);
          }
        }}
      >
        <DialogContent className="max-w-3xl overflow-hidden bg-red-400 p-0 px-0">
          {editingExpense && (
            <ExpenseForm
              key={editingExpense.id}
              branches={branches}
              mode="edit"
              initialValues={{
                branchId: editingExpense.branchId,
                expenseType:
                  editingExpense.expenseType as ExpenseFormValues["expenseType"],
                amount: Number(editingExpense.amount ?? 0),
                description: editingExpense.description ?? "",
                receiptPhoto: editingExpense.receiptPhoto ?? "",
              }}
              submitLabel="Save changes"
              onSubmitAction={(values) =>
                updateExpense(editingExpense.id, values)
              }
              onClose={closeEditModal}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(expenseToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setExpenseToDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete expense</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Are you sure you want to delete
              expense {expenseToDelete?.id}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteExpense}
              disabled={isDeleting}
              className="bg-red-600 text-white hover:bg-red-600/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
