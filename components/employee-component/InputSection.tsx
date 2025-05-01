"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

const InputSection = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

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
    <div className="w-full bg-white px-6 py-2 flex items-center justify-between rounded-lg shadow-sm">
      {/* Left Section: Title and Filter */}
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold">Employee</h2>
        <div className="relative"></div>
      </div>

      {/* Right Section: Search and Export Buttons */}
      <div className="flex items-center gap-4 min-w-[600px]">
        <span className="relative w-full flex items-center space-x-8 flex-1 max-w-md">
          <Search className="absolute left-3 h-4 w-4 text-gray-400" />
          <Input placeholder="Type here..." className="pl-10 flex-1 w-full" />
        </span>
        <button
          onClick={handleExportExcel}
          className="flex items-center gap-1  text-white text-sm font-medium rounded-lg px-3 py-2 "
        >
          <Image
            src="/icons/excel.svg"
            alt="Export to Excel"
            width={16}
            height={16}
            className="w-4 h-4 hidden lg:block"
          />
        </button>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-1 0 text-white text-sm font-medium rounded-lg px-3 py-2 "
        >
          <Image
            src="/icons/pdf.svg"
            alt="Export to PDF"
            width={16}
            height={16}
            className="w-6 h-6 hidden lg:block"
          />
        </button>
      </div>
    </div>
  );
};

export default InputSection;
