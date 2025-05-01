"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const InputSection = () => {
  const filterOptions = ["Terminal", "Customer name", "Employee ID"];
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.target.value);
    // Add filter logic here if needed
  };

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
    <div className="w-full bg-white p-6 flex items-center justify-between rounded-lg shadow-sm">
      {/* Left Section: Title and Filter */}
      <div className="flex items-center gap-4">
        <h2 className="text-lg font-semibold text-gray-800">Transactions</h2>
        <div className="relative">
          <select
            value={selectedFilter}
            onChange={handleFilterChange}
            className="appearance-none bg-gray-50 border border-gray-300 text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 pr-8"
          >
            <option value="" disabled>
              Filter by Terminal, Customer name, Employee ID...
            </option>
            {filterOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="w-4 h-4 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Right Section: Search and Export Buttons */}
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Type here..."
          className="bg-gray-50 border border-gray-300 lg:w-[350px]  text-gray-500 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2.5 w-62 overflow-hidden"
        />
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
