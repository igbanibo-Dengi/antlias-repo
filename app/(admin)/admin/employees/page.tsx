import { Button } from "@/components/ui/button";
import { EmployeesTable } from "./_components/EmployeesTable";
import { Plus } from "lucide-react";
import Link from "next/link";
import { getAllTenantBranches } from "@/lib/actions/tenant/tenant.action";

const Page = async () => {
  const branches = await getAllTenantBranches();

  if (!Array.isArray(branches)) {
    console.error("Failed to load branches:");

    return (
      <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-4 rounded-lg bg-white p-6 shadow">
        <div className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-800">
            Failed to Load Branches
          </h3>
        </div>

        <p className="max-w-md text-center text-gray-600">
          {"An unexpected error occurred while loading branch data."}
        </p>
      </div>
    );
  }

  return (
    <div className="">
      <Button
        size={"lg"}
        className="mb-30 absolute -top-2 left-5 -translate-y-6"
      >
        <Link href={"/tenant/employees/new"} className="flex items-center">
          <Plus className="mr-2 h-4 w-4 rounded-full bg-gray-100/40" />
          New Employee
        </Link>
      </Button>
      <EmployeesTable branches={branches} />
    </div>
  );
};

export default Page;
