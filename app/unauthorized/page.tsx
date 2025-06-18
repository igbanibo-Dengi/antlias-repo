"use client";

import { Ban } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const UnauthorizedPage = () => {
  const router = useRouter();

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <Ban size={120} className="mb-6 text-red-500" />
      <h1 className="mb-2 text-3xl font-bold text-gray-800">
        Unauthorized Access
      </h1>
      <p className="mb-6 text-gray-600">
        You are not authorized to view this page.
      </p>
      <button
        onClick={() => router.back()}
        className="rounded-md bg-red-500 px-6 py-2 text-white transition duration-200 hover:bg-red-600"
      >
        Go Back
      </button>
    </div>
  );
};

export default UnauthorizedPage;
