"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserManagement() {
  const [currentPage, setCurrentPage] = useState(1);

  const users = [
    {
      id: "77587",
      name: "Ayinla Gbenga",
      contact: "0708 690 7256",
      email: "A.gbenga@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "77587",
      name: "Ayinla Gbenga",
      contact: "0708 690 7256",
      email: "A.gbenga@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "77587",
      name: "Ayinla Gbenga",
      contact: "0708 690 7256",
      email: "A.gbenga@gmail.com",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* User Table */}
      <div className="w-full mx-auto my-8 bg-white rounded-lg shadow">
        <table className="w-full mb-6">
          <thead>
            <tr className="text-left text-sm text-gray-500 border-b">
              <th className="pl-6 py-4 font-normal w-12"></th>
              <th className="py-4 font-normal w-12"></th>
              <th className="py-4 font-normal">Employee ID</th>
              <th className="py-4 font-normal">Name</th>
              <th className="py-4 font-normal">Contact Number</th>
              <th className="py-4 font-normal">Email</th>
              <th className="py-4 font-normal">Password</th>
              <th className="py-4 font-normal w-12"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index} className="border-b">
                <td className="pl-6 py-4">
                  <Checkbox />
                </td>
                <td className="py-4">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                </td>
                <td className="py-4 text-sm">{user.id}</td>
                <td className="py-4 text-sm text-gray-600">{user.name}</td>
                <td className="py-4 text-sm text-gray-600">{user.contact}</td>
                <td className="py-4 text-sm text-gray-600">{user.email}</td>
                <td className="py-4 text-sm text-gray-400">
                  ******************
                </td>
                <td className="py-4">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          >
            <span className="sr-only">Previous</span>
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
              className="h-4 w-4"
            >
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </Button>

          <Button
            variant={currentPage === 1 ? "default" : "outline"}
            size="sm"
            className={`h-8 w-8 rounded ${
              currentPage === 1 ? "bg-indigo-600 text-white" : ""
            }`}
            onClick={() => setCurrentPage(1)}
          >
            1
          </Button>

          <Button
            variant={currentPage === 2 ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 rounded"
            onClick={() => setCurrentPage(2)}
          >
            2
          </Button>

          <span className="text-gray-500">...</span>

          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 rounded"
            onClick={() => setCurrentPage(9)}
          >
            9
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 rounded"
            onClick={() => setCurrentPage(10)}
          >
            10
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded"
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            <span className="sr-only">Next</span>
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
              className="h-4 w-4"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Button>
        </div>

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
