"use client";

import React from "react";
import WalletSection from "@/components/Wallet-Components/WalletSection";
import TableSection from "@/components/Wallet-Components/TableSection";

const Page = () => {
  return (
    <div className="flex flex-col h-full">
      <WalletSection />
      <TableSection />
    </div>
  );
};

export default Page;
