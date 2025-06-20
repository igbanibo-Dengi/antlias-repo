"use client"

import { useEffect, useState, useTransition } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Edit, Loader, Check, User } from "lucide-react"
import { getEmployeeByBranchId } from "@/lib/actions/employee/employee"
import { cn } from "@/lib/utils"
import { assignManagerToBranch } from "@/lib/actions/tenant/tenant.action"
import { Employee } from "@/types"
import { toast } from "sonner"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Link from "next/link"

interface AssignManagerFormProps {
  stationId: string
  currentManagerId?: string | null
  onManagerAssigned?: () => void
  bigButton?: boolean
}

const AssignManagerForm = ({ stationId, currentManagerId, onManagerAssigned, bigButton = false }: AssignManagerFormProps) => {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true)
      setError(null)

      try {
        const result = await getEmployeeByBranchId(stationId)

        if (result.success && result.data) {
          setEmployees(result.data)
        } else {
          setError(result.error || "Failed to load employees")
        }
      } catch (err) {
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (dialogOpen) {
      fetchEmployees()
    }
  }, [stationId, dialogOpen])

  const handleAssignManager = () => {
    if (!selectedEmployee) {
      toast.error("Please select an employee to assign as manager.")
      return
    }

    startTransition(async () => {
      try {
        const result = await assignManagerToBranch(stationId, selectedEmployee.userId)

        if (result.success) {
          toast.success("Successfully assigned manager", {
            description: `${selectedEmployee.firstName} ${selectedEmployee.lastName} has been assigned as manager.`,
          })
          setDialogOpen(false)
          setSelectedEmployee(null)
          onManagerAssigned?.()
        } else {
          toast.error(result.error || "Failed to assign manager")
        }
      } catch (err) {
        toast.error("An unexpected error occurred while assigning manager.")
        console.error("Error assigning manager:", err)
      }
    })
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="flex items-center gap-3">
            <Loader className="h-6 w-6 animate-spin text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Loading employees...</span>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <div className="flex items-center gap-3">
            <User className="h-8 w-8 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-800">Failed to Load Employees</h3>
          </div>
          <p className="max-w-md text-center text-sm text-muted-foreground">{error}</p>
          <Button
            variant="outline"
            onClick={() => {
              setError(null)
              setLoading(true)
            }}
          >
            Try Again
          </Button>
        </div>
      )
    }

    if (employees.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-8">
          <User className="h-8 w-8 text-muted-foreground" />
          <div className="text-center">
            <h3 className="text-lg font-semibold">No Employees Found</h3>
            <p className="text-sm text-muted-foreground">There are no employees available for this station.</p>
            <p className="text-muted-foreground"> To assign a manager, please add employees to this station first.</p>
          </div>
          <Button>
            <Link href={`/tenant/stations/new`} className="flex items-center gap-2">
              Add Employee
            </Link>
          </Button>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Employee</label>
          <Select
            onValueChange={(value) => {
              const employee = employees.find(e => e.id === value) || null
              setSelectedEmployee(employee)
            }}
            value={selectedEmployee?.id || ""}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select employee..." />
            </SelectTrigger>
            <SelectContent>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id}>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>
                      {employee.firstName} {employee.lastName}
                    </span>
                    <span className="text-muted-foreground">- {employee.position}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedEmployee && (
          <div className="rounded-lg border bg-muted/50 p-3">
            <h4 className="text-sm font-medium mb-2">Selected Employee</h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Name:</span> {selectedEmployee.firstName} {selectedEmployee.lastName}
              </p>
              <p>
                <span className="font-medium">Position:</span> {selectedEmployee.position}
              </p>
              <p>
                <span className="font-medium">Email:</span> {selectedEmployee.email}
              </p>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => {
              setDialogOpen(false)
              setSelectedEmployee(null)
            }}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleAssignManager} disabled={!selectedEmployee || isPending}>
            {isPending ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Assigning...
              </>
            ) : (
              "Assign Manager"
            )}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant={bigButton ? "outline" : "ghost"} size="icon" className={bigButton ? "" : "p-0 size-6"} aria-label="Assign Manager">
          {bigButton ? (
            <Edit className="h-4 w-4" />
          ) : (
            <Edit className="h-4 w-4" />
          )}
          {bigButton && <span className="sr-only">Assign Manager</span>}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assign Manager</DialogTitle>
          <DialogDescription>Select an employee to assign as the manager for this station.</DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  )
}

export default AssignManagerForm