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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";

interface Transaction {
  id: number;
  Role: string;
  Name: string;
  Amount: number;
  Status: string;
  Contact: string;
  employeeId: string;
  src: string;
}

const data: Transaction[] = [
  {
    id: 1,
    employeeId: "323",
    Role: "Manager",
    Amount: 33560,
    Name: "Ayinla Gbenga",
    Status: "Paid",
    Contact: "07027999991",
    src: "/icons/Avatar.svg",
  },
  {
    id: 2,
    employeeId: "4444",
    Role: "Manager",
    Amount: 33560,
    Name: "Ayinla Gbenga",
    Status: "Paid",
    Contact: "07027999991",
    src: "/icons/Avatar.svg",
  },
  {
    id: 3,
    employeeId: "1111",
    Role: "Manager",
    Amount: 33560,
    Name: "Ayinla Gbenga",
    Status: "Pending",
    Contact: "07027999991",
    src: "/icons/Avatar.svg",
  },
  {
    id: 4,
    employeeId: "12222",
    Role: "Manager",
    Amount: 33560,
    Name: "Ayinla Gbenga",
    Status: "Paid",
    Contact: "07027999991",
    src: "/icons/Avatar.svg",
  },
  {
    id: 5,
    employeeId: "3333",
    Role: "Manager",
    Amount: 33560,
    Name: "Ayinla Gbenga",
    Status: "Pending",
    Contact: "07027999991",
    src: "/icons/Avatar.svg",
  },
  {
    id: 7,
    employeeId: "3333",
    Role: "Manager",
    Amount: 33560,
    Name: "Ayinla Gbenga",
    Status: "Pending",
    Contact: "07027999991",
    src: "/icons/Avatar.svg",
  },
];

const ITEMS_PER_PAGE = 8;

const TableSection = () => {
  const [selected, setSelected] = useState<number[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSelectAll = () => {
    const pageIds = paginatedData.map((item) => item.id);
    setSelected((prev) =>
      pageIds.every((id) => prev.includes(id))
        ? prev.filter((id) => !pageIds.includes(id))
        : [...prev, ...pageIds.filter((id) => !prev.includes(id))],
    );
  };

  const handleCheckboxChange = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  // Pagination logic
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = data.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="w-full bg-white flex  flex-col rounded-lg shadow-sm">
      {/* Table */}
      <div className="overflow-auto flex-grow">
        <Table className="w-full ">
          <TableHeader className="text-center">
            <TableRow>
              <TableHead className="w-10">
                <Checkbox
                  checked={selected.length === data.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-10 px-13"></TableHead>
              <TableHead>Employee ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Contact no</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Ammount Due</TableHead>
              <TableHead>Payment Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id} className="h-14">
                <TableCell>
                  <Checkbox
                    checked={selected.includes(item.id)}
                    onCheckedChange={() => handleCheckboxChange(item.id)}
                  />
                </TableCell>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={item.src} alt="Avatar" />
                    <AvatarFallback>{item.Name[0]}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{item.employeeId}</TableCell>
                <TableCell>{item.Name}</TableCell>
                <TableCell>{item.Contact}</TableCell>
                <TableCell>{item.Role}</TableCell>
                <TableCell>₦{item.Amount.toLocaleString()}</TableCell>
                <TableCell>
                  {" "}
                  <p
                    className={
                      item.Status === "Paid"
                        ? "bg-[#2EE02E] text-transparent bg-clip-text "
                        : item.Status === "Pending"
                          ? "bg-[#E57D3D] text-transparent bg-clip-text"
                          : "text-white"
                    }
                  >
                    {item.Status}
                  </p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {/* Pagination Controls */}
      <div className="flex items-center justify-between p-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded-md text-sm ${
                currentPage === page
                  ? "bg-blue-500 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>

        {/* Total Transactions */}
        <div className="text-sm text-gray-500 flex items-center gap-1">
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
              d="M16 8v8m-4-8v8m-4-8v8"
            />
          </svg>
          <span>{data.length} Transactions</span>
        </div>
      </div>
    </div>
  );
};

export default TableSection;
