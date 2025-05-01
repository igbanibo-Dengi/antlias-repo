"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, MoreHorizontal, Plus, Search, Truck } from "lucide-react";
import Image from "next/image";
import AddTank from "@/components/addtank";
import LogFuelDelivery from "@/components/logfueldeliveryform";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
// Inventory Data
const inventoryData = [
  {
    id: "6721",
    type: "Petrol",
    capacity: "40,000 L",
    remaining: 38,
    value: "₦33,560,783",
  },
  {
    id: "2922",
    type: "Petrol",
    capacity: "40,000 L",
    remaining: 72,
    value: "₦33,560,783",
  },
  {
    id: "7587",
    type: "Diesel",
    capacity: "40,000 L",
    remaining: 72,
    value: "₦33,560,783",
  },
  {
    id: "0812",
    type: "Gas",
    capacity: "40,000 L",
    remaining: 38,
    value: "₦33,560,783",
  },
  {
    id: "6724",
    type: "Kerosene",
    capacity: "40,000 L",
    remaining: 38,
    value: "₦33,560,783",
  },
];

// ProgressBar Component
const ProgressBar = ({ percentage }: { percentage: number }) => {

  const getColor = () => {
    if (percentage > 50) return "bg-green-500";
    if (percentage > 20) return "bg-orange-200";
    return "bg-red-500";
  };

  return (
    <div className="relative flex-1 h-8 w-27 p-1 text-6xs rounded-[6px] bg-black overflow-hidden">
      <div
        className={`h-full transition-all duration-300 rounded-[2px] ${getColor()}`}
        style={{ width: `${percentage}% ` }}
      ></div>
      <span className="absolute inset-0 flex items-center  text-white px-18">
        {percentage}%
      </span>
    </div>
  );
};

// Inventory Table Component
export default function InventoryTable() {
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogToggle = (open: boolean) => {
    setIsDialogOpen(open);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="">
      {/* Header Controls */}

      <div className="flex items-center justify-between mb-4">
        <Dialog open={isDialogOpen} onOpenChange={handleDialogToggle}>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Plus size={16} /> <span>Add Tank</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="">
            <DialogTitle className="sr-only">Add New Tank</DialogTitle>
            <AddTank onClose={closeDialog} />
          </DialogContent>
        </Dialog>

        {/* Fuel Delivery Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Truck size={16} /> <span>Fuel Delivery</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="">
            <DialogTitle className="sr-only">Log Fuel Delivery</DialogTitle>
            <LogFuelDelivery />
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow-sm gap-14 p-4 mb-6 flex items-center justify-between">
        <div className="text-lg font-medium">Inventory</div>
        <div className="flex items-center flex-1 gap-50 space-x-34 mx-4">
          <div className="relative flex items-center flex-1 max-w-md">
            <Filter className="absolute left-3 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10 border-gray-200 text-sm"
              placeholder="Branches"
            />
          </div>
          <div className="relative flex items-center flex-1 max-w-md">
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <Input
              className="pl-10 border-gray-200 text-sm"
              placeholder="Type here..."
            />
          </div>
        </div>
        <div className="space-x-2">
          <Button variant="outline" className="h-9 w-9 p-0">
            <Image
              src="/icons/Excel-Logo.svg"
              alt="Export to Excel"
              width={24}
              height={24}
            />
          </Button>
          <Button variant="outline" className="h-9 w-9 p-0">
            <Image
              src="/icons/Pdf-Logo.svg"
              alt="Export to PDF"
              width={24}
              height={24}
            />
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox />
              </TableHead>
              <TableHead>Tank ID</TableHead>
              <TableHead>Fuel Type</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead>Value</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryData
              .filter((item) =>
                item.type.toLowerCase().includes(search.toLowerCase()),
              )
              .map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.capacity}</TableCell>
                  <TableCell>
                    <ProgressBar percentage={item.remaining} />
                  </TableCell>
                  <TableCell>{item.value}</TableCell>
                  <TableCell>
                    <MoreHorizontal className="cursor-pointer" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <div className="flex space-x-2">
          {[1, 2, 3, "...", 10].map((num, index) => (
            <Button key={index} variant={num === 1 ? "default" : "outline"}>
              {num}
            </Button>
          ))}
        </div>

        {/* Transaction Count */}
        <div className="flex items-center text-sm text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 mr-2"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
          2250 Transactions
        </div>
      </div>
    </div>
  );
}
