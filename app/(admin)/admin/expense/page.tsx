"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Plus, Filter, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ExpenseForm from "@/app/(Root)/expense/_components/expenseform";
import { ExpenseDialog } from "./_components/ExpenseDialog";
import { ExpenseTable } from "./_components/ExpenseTable";

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: string;
  evidence: string;
  description: string;
  requestBy: string;
  dateCode: string;
  status: "Approved" | "Pending" | "Rejected";
}

export default function ExpenseManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogToggle = (open: boolean) => {
    setIsDialogOpen(open);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const [expenseData] = useState<Expense[]>([
    {
      id: "6693ac3ca6e0ce2ef4csascae89a89",
      date: "Jun 10, 2024 - 10:30am",
      category: "Transfer",
      amount: "₦33,560",
      evidence: "Image.jpg",
      description:
        "Linking rods, 224 sheets to be replaced with additional nuts...",
      requestBy: "Manager",
      dateCode: "8782",
      status: "Approved",
    },
    {
      id: "6693ac3ca6e0ce2efcacas4e89a90",
      date: "Jun 10, 2024 - 10:30am",
      category: "Transfer",
      amount: "₦33,560",
      evidence: "Image.jpg",
      description:
        "Linking rods, 224 sheets to be replaced with additional nuts...",
      requestBy: "Manager",
      dateCode: "8782",
      status: "Pending",
    },
    {
      id: "6693fwefwac3ca6e0ce2ef4e89a91",
      date: "Jun 10, 2024 - 10:30am",
      category: "Transfer",
      amount: "₦33,560",
      evidence: "Image.jpg",
      description:
        "Linking rods, 224 sheets to be replaced with additional nuts...",
      requestBy: "Manager",
      dateCode: "8782",
      status: "Rejected",
    },
    {
      id: "6693ac3ca6e0ce2efvasdvq4e89a89",
      date: "Jun 10, 2024 - 10:30am",
      category: "Transfer",
      amount: "₦33,560",
      evidence: "Image.jpg",
      description:
        "Linking rods, 224 sheets to be replaced with additional nuts...",
      requestBy: "Manager",
      dateCode: "8782",
      status: "Approved",
    },
    {
      id: "6693ac3ca6fwvsde0ce2ef4e89a89",
      date: "Jun 10, 2024 - 10:30am",
      category: "Transfer",
      amount: "₦33,560",
      evidence: "Image.jpg",
      description:
        "Linking rods, 224 sheets to be replaced with additional nuts...",
      requestBy: "Manager",
      dateCode: "8782",
      status: "Approved",
    },
    {
      id: "6693ac3ca6e0ce2evweaf4e89a89",
      date: "Jun 10, 2024 - 10:30am",
      category: "Transfer",
      amount: "₦33,560",
      evidence: "Image.jpg",
      description:
        "Linking rods, 224 sheets to be replaced with additional nuts...",
      requestBy: "Manager",
      dateCode: "8782",
      status: "Approved",
    },
  ]);

  return (
    <div className="">
      <ExpenseDialog />
      <ExpenseTable />
    </div>
  );
}


