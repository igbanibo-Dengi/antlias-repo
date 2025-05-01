"use client";

import React, { useState } from "react";
import Image from "next/image";
import InputSection from "@/components/transactions-component/InputSection";
import TableSection from "@/components/transactions-component/TableSection";
import ExpenseFormModal from "@/components/transactions-component/ExpenseFormModal";
import { Filter, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import TransactionFormModal from "@/components/forms/TransactionFormModal";

const Page = () => {

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogToggle = (open: boolean) => {
    setIsDialogOpen(open);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={handleDialogToggle}>
        <DialogTrigger asChild>
          <Button
            size={"lg"}
            className="mb-10 absolute left-5 -top-7 cursor-pointer"
          >
            <Plus className="h-4 w-4 bg-gray-100/40 rounded-full" />
            New Transactions
          </Button>
        </DialogTrigger>
        <DialogContent className=" pl-6 pr-2 ">
          <DialogTitle className="sr-only">New transactions</DialogTitle>
          <TransactionFormModal onClose={closeDialog} />
        </DialogContent>
      </Dialog>

      <div className="w-full">
        <TableSection />
      </div>
    </div>
  );
};

export default Page;
