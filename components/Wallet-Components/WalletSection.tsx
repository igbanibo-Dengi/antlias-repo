"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { CirclePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import SendFundsForm from "../forms/SendFundsForm";
interface StationData {
  name: string;
  balance: number;
}

const WalletSection: React.FC = () => {
  const totalBalance = 32333560;
  const stations: StationData[] = [
    { name: "Station 1 Name", balance: 32333560 },
    { name: "Station 2 Name", balance: 32333560 },
    { name: "Station 3 Name", balance: 32333560 },
  ];

  const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogToggle = (open: boolean) => {
    setIsDialogOpen(open);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };


  return (
    <div className="mb-10 flex flex-col md:flex-row  items-center gap-6">
      {/* Wallet Balance Section */}
      <div className=" bg-gradient-to-r w-1/3 h-[130px] w-full from-blue-500 to-blue-700 text-white p-3 rounded-lg flex flex-col justify-between">
        <div className="w-full">
          <Image
            src="/icons/summaryHeading.svg"
            alt="Ant-lias Logo"
            width={200}
            height={200}
            // className='w-full h-full object-cover'
            priority
          />
        </div>

        <div className="flex flex-col gap-2 lg:flex-row justify-between w-full items-end mt-auto">
          <div>
            <p className="text-sm text-background-800 font-small">
              Wallet Balance
            </p>
            <p className="text-10xl font-bold">₦{formatNumber(totalBalance)}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogToggle}>
            <DialogTrigger asChild>
              <Button className="bg-white text-primary hover:bg-white">
                <CirclePlus className="mr-2" />
                Fund Station
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-left">Send Funds</DialogTitle>
                <DialogDescription className="text-left">
                  Send funds to a station
                </DialogDescription >
              </DialogHeader>
              <DialogTitle className="sr-only">Send Funds</DialogTitle>
              <SendFundsForm onClose={closeDialog} />
            </DialogContent>
          </Dialog>

        </div>
      </div>

      {/* Salary by Station Section */}
      <div className="flex-1 w-full md:w-2/3 h-[130px] bg-white p-3 rounded-lg shadow-sm flex flex-col justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/icons/pump.svg"
            alt="Salary by Station Icon"
            width={20}
            height={20}
            className="w-5 h-5 object-contain"
            priority
          />
          <h3 className="text-lg font-semibold">Salary by Station</h3>
        </div>
        <div className="flex flex-row gap-4">
          {stations.map((station, index) => (
            <div key={index} className="flex flex-col">
              <p className="text-xs text-muted-foreground">{station.name}</p>
              <p className="text-base font-semibold">
                ₦{formatNumber(station.balance)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletSection;
