"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import { Input } from "../ui/input";

const InputSection = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const salaryDue = 3333333;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Add search logic here if needed
  };

  const handleExportExcel = () => {
    // Add export to Excel logic here
    console.log("Exporting to Excel...");
  };

  const handleExportPDF = () => {
    // Add export to PDF logic here
    console.log("Exporting to PDF...");
  };

  return (
    <div className="flex w-full items-center justify-between rounded-lg bg-white px-6 py-2 shadow-sm">
      {/* Left Section: Title and Filter */}
      <div className="lg:gap-33 flex items-center gap-6">
        <h2 className="text-lg font-semibold">Payroll</h2>
        <div className="relative">
          <p className="pr-2 text-sm font-normal text-muted-foreground">
            Total Salary Due:{" "}
            <span className="font-semibold text-foreground">
              ₦{salaryDue.toLocaleString()}
            </span>
          </p>
        </div>
      </div>

      {/* Right Section: Search and Export Buttons */}
      <div className="flex min-w-[600px] items-center gap-4">
        <span className="relative flex w-full max-w-md flex-1 items-center space-x-8">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <Input placeholder="Type here..." className="w-full flex-1 pl-10" />
        </span>
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white"
        >
          <Image
            src="/icons/excel.svg"
            alt="Export to Excel"
            width={16}
            height={16}
            className="hidden h-4 w-4 lg:block"
          />
        </button>
        <button
          onClick={handleExportPDF}
          className="0 flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-white"
        >
          <Image
            src="/icons/pdf.svg"
            alt="Export to PDF"
            width={16}
            height={16}
            className="hidden h-6 w-6 lg:block"
          />
        </button>
      </div>
    </div>
  );
};

export default InputSection;
