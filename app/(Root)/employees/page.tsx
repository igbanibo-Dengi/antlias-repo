"use client";

import React, { useState } from "react";
import Image from "next/image";
import InputSection from "@/components/employee-component/InputSection";
import TableSection from "@/components/employee-component/TableSection";
import ExpenseFormModal from "@/components/employee-component/EmployeeFormModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="">
      <TableSection />
    </div>
  );
};

export default Page;
