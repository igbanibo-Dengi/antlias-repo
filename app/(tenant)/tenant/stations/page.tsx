"use client";

import { useState } from "react";
import { Search, Plus, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import NewStationForm from "@/components/forms/NewStationForm";

// Types
type FuelPrice = {
  petrol: string;
  diesel: string;
  gas: string;
  kerosene: string;
};

type Tank = {
  name: string;
  level: number;
};

type Station = {
  id: string;
  manager: string;
  name: string;
  employees: number;
  location: string;
  totalSalaries: string;
  prices: FuelPrice;
  tanks: Tank[];
};

// Components
const StationInfoSection = ({ station }: { station: Station }) => (
  <div className="mb-4 w-full">
    <h3 className="text-sm text-muted-foreground mb-2">Station Information</h3>
    <div className="flex justify-between mb-1">
      <div className="space-y-8">
        <p className="text-xs text-muted-foreground">Station ID</p>
        <p className="text-xs font-semibold text-gray-700">{station.id}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-muted-foreground">Manager</p>
        <p className="text-xs font-semibold text-gray-700">{station.manager}</p>
      </div>
    </div>
    <div className="flex justify-between mb-1">
      <div className="space-y-8">
        <p className="text-xs text-muted-foreground">Station Name</p>
        <p className="text-xs font-semibold text-gray-700">{station.name}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-muted-foreground">No. of Employees</p>
        <p className="text-xs font-semibold text-gray-700">{station.employees}</p>
      </div>
    </div>
    <div className="flex justify-between mb-1">
      <div className="space-y-8">
        <p className="text-xs text-muted-foreground">Location</p>
        <p className="text-xs font-semibold text-gray-700">{station.location}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-muted-foreground">Total Salaries</p>
        <p className="text-xs font-semibold text-gray-700">{station.totalSalaries}</p>
      </div>
    </div>
    <div className="border-t border-gray-200 my-4"></div>
  </div>
);

const FuelPricesSection = ({ prices }: { prices: FuelPrice }) => (
  <div className="mb-4 w-full">
    <h3 className="text-sm text-muted-foreground mb-4">Latest Selling Price</h3>
    <div className="grid grid-cols-4 gap-2">
      {Object.entries(prices).map(([fuelType, price]) => (
        <div key={fuelType} className="space-y-2">
          <p className="text-xs text-muted-foreground capitalize">{fuelType}</p>
          <p className="text-xs font-semibold text-gray-700">{price}</p>
        </div>
      ))}
    </div>
    <div className="border-t border-gray-200 my-4"></div>
  </div>
);

const TankStatusSection = ({ tanks }: { tanks: Tank[] }) => (
  <div className="w-full">
    <h3 className="text-sm text-muted-foreground mb-2">Present Tank Status</h3>
    {tanks.map((tank, index) => (
      <div key={index} className="flex items-center justify-between mb-4 gap-30">
        <p className="text-xs text-muted-foreground whitespace-nowrap">{tank.name}</p>
        <div className="relative max-w-[180px] flex-1 h-6 2xl:h-10 p-1 rounded-[4px] bg-black overflow-hidden">
          <div
            className="flex items-center h-full rounded-[2px] bg-green-600"
            style={{ width: `${tank.level}%` }}
          >
            <span className="absolute right-2  text-[10px] text-white px-2">
              {tank.level}%
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const StationCard = ({ station }: { station: Station }) => (
  <Card className="bg-white p-6 space-y-6 shadow-lg">
    <StationInfoSection station={station} />
    <FuelPricesSection prices={station.prices} />
    <TankStatusSection tanks={station.tanks} />
  </Card>
);

const SearchAndFilterBar = () => (
  <div className="bg-white rounded-lg shadow-sm gap-24 p-4 mb-6 flex items-center justify-between">
    <div className="text-base font-medium">Stations</div>
    <div className="flex items-center flex-1 gap-50 justify-between">
      <div className="relative flex items-center flex-1">
        <Filter className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-10 border-gray-200 text-sm"
          placeholder="Filter by Terminal, Customer name, Employee ID..."
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
);

const NewStationDialog = ({
  isOpen,
  onOpenChange,
  onClose
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
}) => (
  <Dialog open={isOpen} onOpenChange={onOpenChange}>
    <DialogTrigger asChild>
      <Button size={"lg"} className="mb-10 absolute left-5 -top-7">
        <Plus className="h-4 w-4 bg-gray-100/40 rounded-full" />
        New Station
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="sr-only">New Station Form</DialogTitle>
        <DialogDescription className="sr-only">New station form</DialogDescription>
      </DialogHeader>
      <NewStationForm onClose={onClose} />
    </DialogContent>
  </Dialog>
);

// Main Component
export default function FuelStationDashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stations] = useState<Station[]>([
    {
      id: "8890",
      manager: "George Adasi",
      name: "ENYO",
      employees: 18,
      location: "86 Port Harcourt Owerri Exp. Way",
      totalSalaries: "₦2,333,680",
      prices: {
        petrol: "₦1,180",
        diesel: "₦1,180",
        gas: "₦1,180",
        kerosene: "₦1,180",
      },
      tanks: [
        { name: "Tank 1 (Petrol)", level: 72 },
        { name: "Tank 2 (Petrol)", level: 40 },
        { name: "Tank 3 (Diesel)", level: 20 },
        { name: "Tank 4 (Gas)", level: 70 },
        { name: "Tank 5 ( Kero...)", level: 72 },
      ],
    },
    {
      id: "8891",
      manager: "Jane Smith",
      name: "TOTAL",
      employees: 15,
      location: "42 Lagos Express Way",
      totalSalaries: "₦1,950,000",
      prices: {
        petrol: "₦1,200",
        diesel: "₦1,150",
        gas: "₦1,100",
        kerosene: "₦1,250",
      },
      tanks: [
        { name: "Tank 1 (Petrol)", level: 85 },
        { name: "Tank 2 (Diesel)", level: 60 },
        { name: "Tank 3 (Gas)", level: 45 },
      ],
    },
    {
      id: "8892",
      manager: "Michael Johnson",
      name: "MOBIL",
      employees: 22,
      location: "17 Abuja Central District",
      totalSalaries: "₦2,750,000",
      prices: {
        petrol: "₦1,190",
        diesel: "₦1,170",
        gas: "₦1,130",
        kerosene: "₦1,210",
      },
      tanks: [
        { name: "Tank 1 (Petrol)", level: 30 },
        { name: "Tank 2 (Petrol)", level: 65 },
        { name: "Tank 3 (Diesel)", level: 90 },
        { name: "Tank 4 (Kerosene)", level: 25 },
      ],
    },
  ]);

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div className="min-h-screen">
      <NewStationDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onClose={closeDialog}
      />

      <SearchAndFilterBar />

      <div className="flex justify-end my-2 pr-20">
        <span className="text-xs text-gray-400">Total Salaries</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-12 bg-white rounded-lg">
        {stations.map((station, index) => (
          <StationCard key={index} station={station} />
        ))}
      </div>
    </div>
  );
}