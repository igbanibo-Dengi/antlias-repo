"use client";

import React from "react";
import InputSection from "@/components/Salary-components/InputSection";
import TableSection from "@/components/Salary-components/TableSection";

const Page = () => {
  return (
    <div className="relative flex flex-col w-full ">
      {/* Overlay Content */}
      <div className="w-full">
        <div className="flex flex-col items-start gap-6">
          {/* Input Section */}
          <div className="w-full">
            <InputSection />
          </div>
          {/* Table Section */}
          <div className="w-full flex-1">
            <TableSection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
