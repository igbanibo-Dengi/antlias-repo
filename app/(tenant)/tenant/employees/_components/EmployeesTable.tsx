"use client"

import { useState, useMemo, useCallback } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"

import { ChevronDown, ChevronLeft, ChevronRight, Filter, RefreshCw } from "lucide-react"

import type { BranchProps, Employee } from "@/types"
import { TableSkeleton } from "./TableSkeleton"
import { OptimizedEditEmployeeDialog } from "./EditEmployeeDialog"
import { useDebounce } from "@/hooks/useDebounce"
import { useEmployees } from "@/hooks/useEmployees"

interface OptimizedEmployeesTableProps extends BranchProps {
  initialBranchId: string
  initialEmployees: Employee[]
}

// Memoized column component to prevent unnecessary re-renders
const EmployeeActions = ({
  employee,
  onUpdate,
  onDelete,
}: {
  employee: Employee
  onUpdate: (id: string, values: any) => Promise<any>
  onDelete: (id: string) => Promise<any>
}) => {
  return <OptimizedEditEmployeeDialog employee={employee} onEmployeeUpdated={onUpdate} onEmployeeDeleted={onDelete} />
}

export function OptimizedEmployeesTable({ branches, initialBranchId, initialEmployees }: OptimizedEmployeesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [searchTerm, setSearchTerm] = useState("")
  const [idSearchTerm, setIdSearchTerm] = useState("")

  // Debounce search terms to prevent excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const debouncedIdSearchTerm = useDebounce(idSearchTerm, 300)

  const {
    employees,
    isLoading,
    error,
    selectedBranch,
    switchBranch,
    updateEmployee,
    deleteEmployee,
    refreshCurrentBranch,
  } = useEmployees({ initialEmployees, initialBranchId })

  // Memoized columns to prevent recreation
  const columns = useMemo<ColumnDef<Employee>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex cursor-pointer flex-col">
                  <div className="max-w-[82px] truncate">{row.getValue("id")}</div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{row.getValue("id")}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ),
      },
      { accessorKey: "firstName", header: "First Name" },
      { accessorKey: "lastName", header: "Last Name" },
      { accessorKey: "contactNumber", header: "Contact Number" },
      { accessorKey: "position", header: "Position" },
      {
        accessorKey: "salary",
        header: "Salary",
        cell: ({ row }) => {
          const amount = Number.parseFloat(row.getValue("salary"))
          const formatted = new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
          }).format(amount)

          return <div className="font-medium">{formatted}</div>
        },
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
          const isActive = String(row.getValue("isActive")).toLowerCase() === "true"
          const variant = isActive
            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"

          return <Badge className={`${variant} capitalize`}>{isActive ? "Active" : "Inactive"}</Badge>
        },
        filterFn: (row, id, value) => {
          return value.includes(String(row.getValue(id)))
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => (
          <EmployeeActions employee={row.original} onUpdate={updateEmployee} onDelete={deleteEmployee} />
        ),
      },
    ],
    [updateEmployee, deleteEmployee],
  )

  // Update table filters when debounced search terms change
  const table = useReactTable({
    data: employees,
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
  })

  // Update filters when debounced values change
  useMemo(() => {
    table.getColumn("firstName")?.setFilterValue(debouncedSearchTerm || undefined)
  }, [debouncedSearchTerm, table])

  useMemo(() => {
    table.getColumn("id")?.setFilterValue(debouncedIdSearchTerm || undefined)
  }, [debouncedIdSearchTerm, table])

  const handleRefresh = useCallback(() => {
    refreshCurrentBranch()
  }, [refreshCurrentBranch])

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm">
        <div className="flex items-center gap-4">
          <p className="text-lg font-semibold">Employees</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-8 bg-transparent"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Select value={selectedBranch} onValueChange={switchBranch} disabled={isLoading}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select branch">
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  branches.find((b) => b.id === selectedBranch)?.name || "Select branch"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {branches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            placeholder="Search by first name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Input
            placeholder="Search by employee ID..."
            value={idSearchTerm}
            onChange={(e) => setIdSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto w-full bg-transparent">
                <Filter className="mr-2 h-4 w-4" />
                Status
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {["Active", "InActive"].map((status) => (
                <DropdownMenuCheckboxItem
                  key={status}
                  className="capitalize"
                  checked={((table.getColumn("isActive")?.getFilterValue() as string[]) || []).includes(status)}
                  onCheckedChange={(checked) => {
                    const currentFilters = (table.getColumn("isActive")?.getFilterValue() as string[]) || []
                    const newFilters = checked
                      ? [...currentFilters, status]
                      : currentFilters.filter((v) => v !== status)
                    table.getColumn("isActive")?.setFilterValue(newFilters.length ? newFilters : undefined)
                  }}
                >
                  {status}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto bg-transparent">
                Columns <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((c) => c.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(v) => column.toggleVisibility(!!v)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-lg border bg-white shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableSkeleton rows={5} columns={8} />
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {error ? `Error: ${error}` : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between px-2 py-4">
        <div className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s)
          selected.
        </div>

        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
            <select
              className="h-8 rounded-md border px-3 py-2 text-sm"
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
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
              className="h-8 w-8 p-0 bg-transparent"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex w-[100px] justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </div>
            <Button
              variant="outline"
              className="h-8 w-8 p-0 bg-transparent"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
