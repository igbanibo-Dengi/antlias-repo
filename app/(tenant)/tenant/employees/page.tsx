import { Button } from "@/components/ui/button"
// import { EmployeesTable } from "./components/EmployeesTable"
import { AlertTriangle, Plus } from "lucide-react"
import Link from "next/link"
import { getAllTenantBranches } from "@/lib/actions/tenant/tenant.action"
import { getEmployeeByBranchId } from "@/lib/actions/employee/employee"
import { OptimizedEmployeesTable } from "./_components/EmployeesTable"

const Page = async () => {
  const getBranches = await getAllTenantBranches()

  if (!getBranches.success) {
    return (
      <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4 rounded-lg bg-white p-6 shadow">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-10 w-10 text-red-500" />
          <h3 className="text-xl font-semibold text-gray-800">Failed to Load Branches</h3>
        </div>
        <p className="max-w-md text-center text-gray-600">
          {getBranches.error || "An unexpected error occurred while loading branch data."}
        </p>
      </div>
    )
  }

  const branches = getBranches.data ?? []

  const defaultBranch = branches.find((branch) => branch.isHeadQuarters === true) ?? branches[0]

  let employees: any[] = []

  if (defaultBranch) {
    const employeeRes = await getEmployeeByBranchId(defaultBranch.id)
    if (employeeRes.success) {
      employees = employeeRes.data!
    } else {
      console.error("Failed to fetch employees:", employeeRes.error)
    }
  }

  return (
    <div className="h-full">
      <Button size="lg" className="mb-30 absolute -top-2 left-5 -translate-y-6">
        <Link href="/tenant/employees/new" className="flex items-center">
          <Plus className="mr-2 h-4 w-4 rounded-full bg-gray-100/40" />
          New Employee
        </Link>
      </Button>

      <OptimizedEmployeesTable branches={branches} initialBranchId={defaultBranch?.id ?? ""} initialEmployees={employees} />
    </div>
  )
}

export default Page
