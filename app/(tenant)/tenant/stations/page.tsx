import StationSearchAndFilterBar from "@/components/employee-component/station-components/StationSearchAndFilterBar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Plus } from "lucide-react";
import { getAllTenantBranches, getSellingPrices } from "@/lib/actions/tenant/tenant.action";
import { StationCard } from "@/components/employee-component/station-components/Station";
import { getEmployeeByBranchId } from "@/lib/actions/employee/employee";

export default async function FuelStationDashboard() {

  const getBranches = await getAllTenantBranches();
  // const employess = await getEmployeeByBranchId(getBranches.data[0].id);



  if (!getBranches.success) {
    console.error('Error fetching branches or employees:', getBranches.error);

    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] h-full gap-4 p-6 bg-white rounded-lg shadow">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-10 w-10 text-red-500" />
          <h3 className="text-xl font-semibold text-gray-800">
            {getBranches.error ? 'Failed to Load Branches' : 'Failed to Load Employees'}
          </h3>
        </div>

        <p className="text-gray-600 text-center max-w-md">
          {'An unexpected error occurred while loading branch data.'}
        </p>
      </div>
    );
  }

  const branches = getBranches.data;

  // console.log(branches);

  const stations = await Promise.all(
    (branches ?? []).map(async (branch) => {
      const employees = await getEmployeeByBranchId(branch.id);
      const sellingPrices = await getSellingPrices(branch.id);

      if (employees.success === false) {
        // Return a consistent error object or null
        return {
          id: branch.id,
          tenantId: branch.tenantId,
          name: branch.name,
          address: branch.address,
          city: branch.city,
          state: branch.state,
          managerId: branch.managerId,
          employees: undefined,
          totalSalaries: 0,
          prices: undefined,
          error: employees.error, // Add an error field
        };
      }

      // Normal Station object
      return {
        id: branch.id,
        tenantId: branch.tenantId,
        name: branch.name,
        address: branch.address,
        city: branch.city,
        state: branch.state,
        managerId: branch.managerId,
        // employees: employees.data?.length,
        totalSalaries: employees.data?.reduce((sum, emp) => sum + (emp.salary || 0), 0),
        // prices: sellingPrices.data,
      };
    })
  );



  return (
    <div className="min-h-screen">
      <Button size={"lg"} className="mb-30 absolute left-5 -top-2 -translate-y-6">
        <Link href={"/tenant/stations/new"} className="flex items-center">
          <Plus className="h-4 w-4 bg-gray-100/40 rounded-full mr-2" />
          New Station
        </Link>
      </Button>
      <StationSearchAndFilterBar />

      <div className="flex justify-end my-2 pr-20">
        <span className="text-xs text-gray-400">Total Salaries</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-12 bg-white rounded-lg">
        {stations.map(station =>
          station.error ? (
            <div key={station.id} className="error">{station.error}</div>
          ) : (
            <StationCard key={station.id} station={station} />
          )
        )}
      </div>
    </div>
  );
}