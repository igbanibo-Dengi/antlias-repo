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
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface Transaction {
  id: number;
  transactionId: string;
  dateTime: string;
  method: string;
  amount: number;
  fuel: string;
  customerName: string;
  status: "Successful" | "Declined" | "Failed";
  terminalId: string;
  employeeId: string;
}

const data: Transaction[] = [
  {
    id: 1,
    transactionId: "6693ac3ca6e0cdafbe89ab99",
    dateTime: "Jun 10, 2024 10:30am",
    method: "Transfer",
    amount: 33560,
    fuel: "Petrol",
    customerName: "Ayinla Gbenga",
    status: "Successful",
    terminalId: "702791",
    employeeId: "8782",
  },
  {
    id: 2,
    transactionId: "6693ac3ca6e0cdafbe89ab98",
    dateTime: "Jun 10, 2024 11:45am",
    method: "Card",
    amount: 28750,
    fuel: "Diesel",
    customerName: "Okafor Chinedu",
    status: "Successful",
    terminalId: "702792",
    employeeId: "8783",
  },
  {
    id: 3,
    transactionId: "6693ac3ca6e0cdafbe89ab97",
    dateTime: "Jun 10, 2024 12:15pm",
    method: "Cash",
    amount: 42000,
    fuel: "Petrol",
    customerName: "Adeleke Femi",
    status: "Declined",
    terminalId: "702793",
    employeeId: "8784",
  },
  {
    id: 4,
    transactionId: "6693ac3ca6e0cdafbe89ab96",
    dateTime: "Jun 10, 2024 01:30pm",
    method: "Transfer",
    amount: 18900,
    fuel: "Gas",
    customerName: "Bello Yusuf",
    status: "Successful",
    terminalId: "702794",
    employeeId: "8785",
  },
  {
    id: 5,
    transactionId: "6693ac3ca6e0cdafbe89ab95",
    dateTime: "Jun 10, 2024 02:45pm",
    method: "Card",
    amount: 31500,
    fuel: "Petrol",
    customerName: "Chukwu Emeka",
    status: "Failed",
    terminalId: "702795",
    employeeId: "8786",
  },
  {
    id: 6,
    transactionId: "6693ac3ca6e0cdafbe89ab94",
    dateTime: "Jun 10, 2024 03:20pm",
    method: "Cash",
    amount: 27500,
    fuel: "Diesel",
    customerName: "Eze Chioma",
    status: "Successful",
    terminalId: "702796",
    employeeId: "8787",
  },
  {
    id: 7,
    transactionId: "6693ac3ca6e0cdafbe89ab93",
    dateTime: "Jun 10, 2024 04:10pm",
    method: "Transfer",
    amount: 38900,
    fuel: "Petrol",
    customerName: "Folarin Tunde",
    status: "Successful",
    terminalId: "702797",
    employeeId: "8788",
  },
  {
    id: 8,
    transactionId: "6693ac3ca6e0cdafbe89ab92",
    dateTime: "Jun 10, 2024 05:30pm",
    method: "Card",
    amount: 22500,
    fuel: "Gas",
    customerName: "Gambo Ibrahim",
    status: "Declined",
    terminalId: "702798",
    employeeId: "8789",
  },
  {
    id: 9,
    transactionId: "6693ac3ca6e0cdafbe89ab91",
    dateTime: "Jun 10, 2024 06:15pm",
    method: "Cash",
    amount: 31000,
    fuel: "Petrol",
    customerName: "Hassan Amina",
    status: "Successful",
    terminalId: "702799",
    employeeId: "8790",
  },
  {
    id: 10,
    transactionId: "6693ac3ca6e0cdafbe89ab90",
    dateTime: "Jun 10, 2024 07:05pm",
    method: "Transfer",
    amount: 28750,
    fuel: "Diesel",
    customerName: "Ibeh Kenechukwu",
    status: "Successful",
    terminalId: "702800",
    employeeId: "8791",
  },
];

export const columns: ColumnDef<Transaction>[] = [
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
    accessorKey: "transactionId",
    header: "Transaction ID",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="text-sm font-medium text-foreground">
          {row.getValue("transactionId")}
        </span>
        <span className="text-xs text-muted-foreground">
          {row.original.dateTime}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "method",
    header: "Method",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "fuel",
    header: "Fuel",
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const variant = {
        Successful: "bg-green-100 text-green-800",
        Declined: "bg-red-100 text-red-800",
        Failed: "bg-yellow-100 text-yellow-800",
      }[status] || "bg-gray-100 text-gray-800";

      return <Badge className={`${variant} capitalize`}>{status}</Badge>;
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  // {
  //   accessorKey: "terminalId",
  //   header: "Terminal ID",
  // },
  {
    accessorKey: "employeeId",
    header: "Employee ID",
  },
];

export function DataTable() {
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
      <div className="flex items-center justify-between py-4  bg-white rounded-lg shadow-sm p-4 mb-10">
        <div className="flex items-center gap-4">
          <Input
            placeholder="Search by transaction ID..."
            value={(table.getColumn("transactionId")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("transactionId")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Input
            placeholder="Search by customer name..."
            value={(table.getColumn("customerName")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("customerName")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Status <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["Successful", "Declined", "Failed"].map((status) => (
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

export default function TableSection() {
  return <DataTable />;
}