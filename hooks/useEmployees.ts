"use client"

import { useState, useCallback } from "react"
import { toast } from "sonner"
import type { ActionResponse, Employee } from "@/types"
import { getEmployeeByBranchId, editEmployeeAction, deleteEmployeeAction } from "@/lib/actions/employee/employee"
import type { EditEmployeeFormValues } from "@/validators/employee-form-validator"

interface UseEmployeesOptions {
  initialEmployees: Employee[]
  initialBranchId: string
}

export function useEmployees({ initialEmployees, initialBranchId }: UseEmployeesOptions) {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedBranch, setSelectedBranch] = useState<string>(initialBranchId)

  // Cache for branch employees to avoid unnecessary API calls
  const [branchCache, setBranchCache] = useState<Map<string, Employee[]>>(
    new Map([[initialBranchId, initialEmployees]]),
  )

  const fetchEmployees = useCallback(
    async (branchId: string, forceRefresh = false) => {
      // Check cache first
      if (!forceRefresh && branchCache.has(branchId)) {
        const cachedEmployees = branchCache.get(branchId)!
        setEmployees(cachedEmployees)
        return
      }

      setIsLoading(true)
      setError("")

      try {
        const response: ActionResponse<Employee[]> = await getEmployeeByBranchId(branchId)
        if (response.success && response.data) {
          setEmployees(response.data)
          // Update cache
          setBranchCache((prev) => new Map(prev).set(branchId, response.data!))
        } else {
          setError(response.error || "Failed to fetch employees")
          setEmployees([])
        }
      } catch {
        setError("An unexpected error occurred")
        setEmployees([])
      } finally {
        setIsLoading(false)
      }
    },
    [branchCache],
  )

  const switchBranch = useCallback(
    (branchId: string) => {
      setSelectedBranch(branchId)
      fetchEmployees(branchId)
    },
    [fetchEmployees],
  )

  // Optimistic update for employee edit
  const updateEmployee = useCallback(
    async (employeeId: string, values: EditEmployeeFormValues) => {
      // Optimistic update
      const optimisticEmployee = employees.find((emp) => emp.id === employeeId)
      if (!optimisticEmployee) return { success: false, error: "Employee not found" }

      const updatedEmployee = { ...optimisticEmployee, ...values }

      // Update UI immediately
      setEmployees((prev) => prev.map((emp) => (emp.id === employeeId ? updatedEmployee : emp)))

      // Update cache for current branch
      setBranchCache((prev) => {
        const newCache = new Map(prev)
        const currentBranchEmployees = newCache.get(selectedBranch)
        if (currentBranchEmployees) {
          newCache.set(
            selectedBranch,
            currentBranchEmployees.map((emp) => (emp.id === employeeId ? updatedEmployee : emp)),
          )
        }
        return newCache
      })

      try {
        const result = await editEmployeeAction(employeeId, values)

        if (result.success) {
          toast.success("Employee updated successfully")
          return { success: true }
        } else {
          // Rollback on error
          setEmployees((prev) => prev.map((emp) => (emp.id === employeeId ? optimisticEmployee : emp)))
          setBranchCache((prev) => {
            const newCache = new Map(prev)
            const currentBranchEmployees = newCache.get(selectedBranch)
            if (currentBranchEmployees) {
              newCache.set(
                selectedBranch,
                currentBranchEmployees.map((emp) => (emp.id === employeeId ? optimisticEmployee : emp)),
              )
            }
            return newCache
          })
          toast.error("Failed to update employee")
          return { success: false, error: result.error }
        }
      } catch (error) {
        // Rollback on error
        setEmployees((prev) => prev.map((emp) => (emp.id === employeeId ? optimisticEmployee : emp)))
        toast.error("An unexpected error occurred")
        return { success: false, error: "Network error" }
      }
    },
    [employees, selectedBranch],
  )

  // Optimistic delete
  const deleteEmployee = useCallback(
    async (employeeId: string) => {
      const employeeToDelete = employees.find((emp) => emp.id === employeeId)
      if (!employeeToDelete) return { success: false, error: "Employee not found" }

      // Optimistic delete - remove from UI immediately
      setEmployees((prev) => prev.filter((emp) => emp.id !== employeeId))

      // Update cache
      setBranchCache((prev) => {
        const newCache = new Map(prev)
        const currentBranchEmployees = newCache.get(selectedBranch)
        if (currentBranchEmployees) {
          newCache.set(
            selectedBranch,
            currentBranchEmployees.filter((emp) => emp.id !== employeeId),
          )
        }
        return newCache
      })

      try {
        const result = await deleteEmployeeAction({ employeeId })

        if (result.success) {
          toast.success("Employee deleted successfully")
          return { success: true }
        } else {
          // Rollback on error
          setEmployees((prev) => [...prev, employeeToDelete].sort((a, b) => a.firstName.localeCompare(b.firstName)))
          setBranchCache((prev) => {
            const newCache = new Map(prev)
            const currentBranchEmployees = newCache.get(selectedBranch)
            if (currentBranchEmployees) {
              newCache.set(
                selectedBranch,
                [...currentBranchEmployees, employeeToDelete].sort((a, b) => a.firstName.localeCompare(b.firstName)),
              )
            }
            return newCache
          })
          toast.error("Failed to delete employee")
          return { success: false, error: result.error }
        }
      } catch (error) {
        // Rollback on error
        setEmployees((prev) => [...prev, employeeToDelete].sort((a, b) => a.firstName.localeCompare(b.firstName)))
        toast.error("An unexpected error occurred")
        return { success: false, error: "Network error" }
      }
    },
    [employees, selectedBranch],
  )

  const refreshCurrentBranch = useCallback(() => {
    fetchEmployees(selectedBranch, true)
  }, [selectedBranch, fetchEmployees])

  // Invalidate cache for a specific branch
  const invalidateBranchCache = useCallback((branchId: string) => {
    setBranchCache((prev) => {
      const newCache = new Map(prev)
      newCache.delete(branchId)
      return newCache
    })
  }, [])

  return {
    employees,
    isLoading,
    error,
    selectedBranch,
    switchBranch,
    updateEmployee,
    deleteEmployee,
    refreshCurrentBranch,
    invalidateBranchCache,
    fetchEmployees,
  }
}
