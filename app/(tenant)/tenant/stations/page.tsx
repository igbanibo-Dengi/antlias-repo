import StationSearchAndFilterBar from "@/components/employee-component/station-components/StationSearchAndFilterBar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Plus } from "lucide-react";
import {
  getAllTenantBranches,
  getSellingPrices,
} from "@/lib/actions/tenant/tenant.action";
import { StationCard } from "@/components/employee-component/station-components/Station";
import { getEmployeeByBranchId } from "@/lib/actions/employee/employee";

export default async function FuelStationDashboard() {
  const getBranches = await getAllTenantBranches();

  if (!getBranches.success) {
    console.error("Error fetching branches or employees:", getBranches.error);

    return (
      <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4 rounded-lg bg-white p-6 shadow">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-10 w-10 text-red-500" />
          <h3 className="text-xl font-semibold text-gray-800">
            {getBranches.error
              ? "Failed to Load Branches"
              : "Failed to Load Employees"}
          </h3>
        </div>

        <p className="max-w-md text-center text-gray-600">
          {"An unexpected error occurred while loading branch data."}
        </p>
      </div>
    );
  }

  const branches = getBranches.data;

  const stations = await Promise.all(
    (branches ?? []).map(async (branch) => {
      const employees = await getEmployeeByBranchId(branch.id);
      const sellingPrices = await getSellingPrices(branch.id);
      const manager = employees.data?.find(
        (emp) => emp.userId === branch.managerId,
      );
      // console.log("Manager:", manager);
      // console.log(sellingPrices.data);

      if (employees.success === false) {
        // Return a consistent error object or null
        return {
          id: branch.id,
          tenantId: branch.tenantId,
          name: branch.name,
          contactPhone: branch.contactPhone,
          address: branch.address,
          city: branch.city,
          state: branch.state,
          managerId: branch.managerId,
          managerName: manager
            ? `${manager.firstName} ${manager.lastName}`
            : null,
          isHeadQuarters: branch.isHeadQuarters,
          isActive: branch.isActive,
          createdAt: branch.createdAt,
          employees: 0,
          totalSalaries: 0,
          prices: sellingPrices.data ?? [],
          error: employees.error,
        };
      }

      // Normal Station object
      return {
        id: branch.id,
        tenantId: branch.tenantId,
        name: branch.name,
        contactPhone: branch.contactPhone,
        address: branch.address,
        city: branch.city,
        state: branch.state,
        managerId: branch.managerId,
        managerName: manager
          ? `${manager.firstName} ${manager.lastName}`
          : null,
        isHeadQuarters: branch.isHeadQuarters,
        isActive: branch.isActive,
        createdAt: branch.createdAt,
        employees: employees.data?.length,
        totalSalaries: employees.data?.reduce(
          (sum, emp) => sum + (emp.salary || 0),
          0,
        ),
        prices: sellingPrices.data ?? [],
      };
    }),
  );

  return (
    <div className="min-h-screen">
      <Button
        size={"lg"}
        className="mb-30 absolute -top-2 left-5 -translate-y-6"
      >
        <Link href={"/tenant/stations/new"} className="flex items-center">
          <Plus className="mr-2 h-4 w-4 rounded-full bg-gray-100/40" />
          New Station
        </Link>
      </Button>
      <StationSearchAndFilterBar />

      <div className="my-2 flex justify-end pr-20">
        <span className="text-xs text-gray-400">Total Salaries</span>
      </div>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        {stations.map((station) =>
          station.error ? (
            <div key={station.id} className="error">
              {station.error}
            </div>
          ) : (
            <StationCard
              key={station.id}
              station={station}
              branches={branches}
            />
          ),
        )}
      </div>
    </div>
  );
}
