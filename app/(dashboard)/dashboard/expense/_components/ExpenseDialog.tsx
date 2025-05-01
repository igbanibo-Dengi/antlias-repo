"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ExpenseForm from "./expenseform";

export function ExpenseDialog() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={"lg"} className="mb-30 absolute left-5 -top-2 -translate-y-6">
          <Plus className="h-4 w-4 bg-gray-100/40 rounded-full mr-2" />
          New Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[90vh] 2xl:h-fit overflow-hidden px-0">
        <DialogTitle className="sr-only">Expense Form</DialogTitle>
        <ExpenseForm onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}