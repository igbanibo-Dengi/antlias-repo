"use client";

import { useState } from "react";
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
import { Badge } from "@/components/ui/badge";
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
import { ChevronDown, ChevronLeft, ChevronRight, Filter, MoreHorizontal } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: string;
  evidence: string;
  description: string;
  requestBy: string;
  dateCode: string;
  status: "Approved" | "Pending" | "Rejected";
}

const data: Expense[] = [
  {
    id: "6693ac3ca6e0ce2ef4csascae89a89",
    date: "Jun 10, 2024 - 10:30am",
    category: "Transfer",
    amount: "₦33,560",
    evidence: "Image.jpg",
    description: "Linking rods, 224 sheets to be replaced with additional nuts...",
    requestBy: "Manager",
    dateCode: "8782",
    status: "Approved",
  },
  {
    id: "6693ac3ca6e0ce2efcacas4e89a90",
    date: "Jun 10, 2024 - 10:30am",
    category: "Transfer",
    amount: "₦33,560",
    evidence: "Image.jpg",
    description: "Linking rods, 224 sheets to be replaced with additional nuts...",
    requestBy: "Manager",
    dateCode: "8782",
    status: "Pending",
  },
  {
    id: "6693fwefwac3ca6e0ce2ef4e89a91",
    date: "Jun 10, 2024 - 10:30am",
    category: "Transfer",
    amount: "₦33,560",
    evidence: "Image.jpg",
    description: "Linking rods, 224 sheets to be replaced with additional nuts...",
    requestBy: "Manager",
    dateCode: "8782",
    status: "Rejected",
  },
  {
    id: "6693ac3ca6e0ce2efvasdvq4e89a89",
    date: "Jun 10, 2024 - 10:30am",
    category: "Transfer",
    amount: "₦33,560",
    evidence: "Image.jpg",
    description: "Linking rods, 224 sheets to be replaced with additional nuts...",
    requestBy: "Manager",
    dateCode: "8782",
    status: "Approved",
  },
  {
    id: "6693ac3ca6fwvsde0ce2ef4e89a89",
    date: "Jun 10, 2024 - 10:30am",
    category: "Transfer",
    amount: "₦33,560",
    evidence: "Image.jpg",
    description: "Linking rods, 224 sheets to be replaced with additional nuts...",
    requestBy: "Manager",
    dateCode: "8782",
    status: "Approved",
  },
  {
    id: "6693ac3ca6e0ce2evweaf4e89a89",
    date: "Jun 10, 2024 - 10:30am",
    category: "Transfer",
    amount: "₦33,560",
    evidence: "Image.jpg",
    description: "Linking rods, 224 sheets to be replaced with additional nuts...",
    requestBy: "Manager",
    dateCode: "8782",
    status: "Approved",
  },
];

export const columns: ColumnDef<Expense>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
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
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex flex-col cursor-pointer">
              <div className="truncate max-w-[120px]">{row.getValue("id")}</div>
              <div className="text-xs text-muted-foreground">
                {row.original.date}
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.getValue("id")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "evidence",
    header: "Evidence",
    cell: ({ row }) => (
      <a href="#" className="text-blue-500 hover:underline">
        {row.getValue("evidence")}
      </a>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="max-w-[120px] truncate cursor-pointer">
              {row.getValue("description")}
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-[300px]">
            <p>{row.getValue("description")}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
  },
  {
    accessorKey: "requestBy",
    header: "Request By",
  },
  {
    accessorKey: "dateCode",
    header: "Date",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant = {
        Approved: "bg-green-100 text-green-800",
        Pending: "bg-yellow-100 text-yellow-800",
        Rejected: "bg-red-100 text-red-800",
      }[status] || "bg-gray-100 text-gray-800";

      return <Badge className={`${variant} capitalize`}>{status}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: "actions",
    cell: () => (
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    ),
  },
];

export function ExpenseTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
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
    <div className="w-full">
      <div className="flex items-center justify-between py-4 bg-white rounded-lg shadow-sm p-4 mb-10">
        <p className="font-semibold text-lg">Expense</p>
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search by expense ID..."
            value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("id")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Input
            placeholder="Search by requester..."
            value={(table.getColumn("requestBy")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("requestBy")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                <Filter className="mr-2 h-4 w-4" />
                Status
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["Approved", "Pending", "Rejected"].map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  className="capitalize"
                  checked={(table.getColumn("status")?.getFilterValue() as string[] || []).includes(status)}
                  onCheckedChange={(checked) => {
                    const currentFilters = (table.getColumn("status")?.getFilterValue() as string[]) || [];
                    const newFilters = checked
                      ? [...currentFilters, status]
                      : currentFilters.filter((value) => value !== status);
                    table.getColumn("status")?.setFilterValue(newFilters.length ? newFilters : undefined);
                  }}
                >
                  {status}
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

      <div className="border bg-white rounded-lg shadow-sm p-4">
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
                          header.getContext()
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
                        cell.getContext()
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
    </div>
  );
}

export default function ExpenseManagement() {
  return (
    <div className="bg-gray-50 min-h-screen mt-5">
      <ExpenseTable />
    </div>
  );
}