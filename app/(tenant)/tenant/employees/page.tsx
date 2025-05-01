"use client";

import { Button } from "@/components/ui/button";
import { EmployeesTable } from "./_components/EmployeesTable";
import { Plus } from "lucide-react";
import Link from "next/link";


const Page = () => {

  return (
    <div className="">
      <Button size={"lg"} className="mb-30 absolute left-5 -top-2 -translate-y-6">
        <Link href={"/employees/new"} className="flex items-center">
          <Plus className="h-4 w-4 bg-gray-100/40 rounded-full mr-2" />
          New Employee
        </Link>
      </Button>
      <EmployeesTable />
    </div>
  );
};

export default Page;
