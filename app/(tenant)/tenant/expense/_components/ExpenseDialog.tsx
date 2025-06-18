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
        <Button
          size={"lg"}
          className="mb-30 absolute -top-2 left-5 -translate-y-6"
        >
          <Plus className="mr-2 h-4 w-4 rounded-full bg-gray-100/40" />
          New Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="h-[90vh] overflow-hidden px-0 2xl:h-fit">
        <DialogTitle className="sr-only">Expense Form</DialogTitle>
        <ExpenseForm onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
