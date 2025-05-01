"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

import AccountDetails from "./AccountDetails";
interface Transaction {
  id: number;
  transactionId: string;
  dateTime: string;
  amount: number;
  status: string;
}

const data: Transaction[] = [
  {
    id: 1,
    transactionId: "6693ac3ca6e0cdafbe89ab99",
    dateTime: "Jun 10, 2024 10:30am",
    amount: 32333560,
    status: "Successful",
  },
  {
    id: 2,
    transactionId: "6693ac3ca6e0cdafbe89ab99",
    dateTime: "Jun 10, 2024 10:30am",
    amount: 32333560,
    status: "Successful",
  },
];

const TableSection = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleCheckboxChange = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    setSelected(
      selected.length === data.length ? [] : data.map((item) => item.id),
    );
  };

  if (!isMounted) return null;

  return (
    <div className="flex w-full flex-col md:flex-row gap-6 p-6 bg-white rounded-lg  flex-1 shadow-sm  mx-auto">
      {/* Account Details Section */}
      <AccountDetails
        accountName="Fatgbems Petroleum"
        accountNumber="0099887766"
        bankName="WEMA Bank"
      />

      {/* Table Section */}
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={selected.length === data.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={selected.includes(item.id)}
                    onCheckedChange={() => handleCheckboxChange(item.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-800">
                        {item.transactionId}
                      </span>
                      <span className="text-xs text-gray-500">
                        {item.dateTime}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-semibold text-gray-800">
                  ₦{item.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge className="bg-[#00B000] text-[white] font-small">
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <button className="text-gray-500 hover:text-gray-700">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v.01M12 12v.01M12 18v.01"
                      />
                    </svg>
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TableSection;
