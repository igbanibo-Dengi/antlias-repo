import NewStationForm from "@/components/forms/NewStationForm";
import { Button } from "@/components/ui/button";
import { getAllEmployees } from "@/lib/actions/employee/employee";
import { getAllTenantBranches } from "@/lib/actions/tenant/tenant.action";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import React from "react";

const page = async () => {
  const getBranches = await getAllTenantBranches();
  const getEmployees = await getAllEmployees();

  if (!getBranches.success || !getEmployees.success) {
    console.error(
      "Error fetching branches or employees:",
      getBranches.error || getEmployees.error,
    );

    return (
      <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4 rounded-lg bg-white p-6 shadow">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-10 w-10 text-red-500" />
          <h3 className="text-xl font-semibold text-gray-800">
            {getBranches.error
              ? "Failed to Load Branches"
              : "Failed to Load Employees"}
          </h3>
          <Button>
            <Link href={`/tenant/stations`} className="flex items-center gap-2">
              Back to stations
            </Link>
          </Button>
        </div>

        <p className="max-w-md text-center text-gray-600">
          {"An unexpected error occurred while loading branch data."}
        </p>
      </div>
    );
  }

  const branches = getBranches.data;
  const employees = getEmployees.data;

  return (
    <>
      {branches === undefined || employees === undefined ? (
        <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4 rounded-lg bg-white p-6 shadow">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-10 w-10 text-red-500" />
            <h3 className="text-xl font-semibold text-gray-800">
              Failed to Load Branches or employees
            </h3>
            <Button>
              <Link
                href={`/tenant/stations`}
                className="flex items-center gap-2"
              >
                Back to stations
              </Link>
            </Button>
          </div>

          <p className="max-w-md text-center text-gray-600">
            {
              "An unexpected error occurred while loading branch data or employee data."
            }
          </p>
        </div>
      ) : (
        <NewStationForm branches={branches} employees={employees} />
      )}
    </>
  );
};

export default page;
