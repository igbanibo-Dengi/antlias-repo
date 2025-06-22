"use client";

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Branch, SellingPrices } from "@/types";
import { useState } from "react";
import AssignManagerForm from "./AssigngManagerForm";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import EditStationForm from "./EditStationForm";

export type Tank = {
  name: string;
  level: number;
};

export type Station = {
  id: string;
  tenantId: string;
  name: string;
  contactPhone: string | null;
  address: string;
  city: string;
  state: string;
  managerId: string | null;
  managerName: string | null;
  isHeadQuarters: boolean | null;
  isActive: boolean | null;
  createdAt: Date | null;
  employees: number | undefined;
  totalSalaries: number | undefined;
  prices: SellingPrices[];
};

// Components
export const StationInfoSection = ({
  station,
  onManagerAssigned,
  branches,
}: {
  station: Station;
  branches: Branch[] | undefined;
  onManagerAssigned?: () => void;
}) => (
  <div className="w-full">
    <div className="mb-4 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-muted-foreground">
        Station Information
      </h3>

      <span>
        <EditStationForm
          stationId={station.id}
          stationName={station.name}
          stationPhone={station.contactPhone}
          stationAddress={station.address}
          stationCity={station.city}
          stationState={station.state}
          stationManagerId={station.managerId}
          stationManagerName={station.managerName}
          isHeadQuarters={station.isHeadQuarters}
          isActive={station.isActive}
          createdAt={station.createdAt}
          onManagerAssigned={onManagerAssigned}
          branches={branches}
        />
      </span>
    </div>

    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
      {/* Station ID */}
      <div className="flex flex-col space-y-1">
        <div className="flex h-6 items-center text-xs text-muted-foreground">
          <p>Station ID</p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[65px] cursor-pointer truncate text-xs text-foreground">
                {station.id}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{station.id}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Manager */}
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between gap-2">
          {station.managerId === null ? (
            <div className="flex w-full flex-col">
              <div className="flex w-full items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">Manager</p>
                <AssignManagerForm
                  stationId={station.id}
                  currentManagerId={station.managerId}
                  onManagerAssigned={onManagerAssigned}
                />
              </div>
              <span className="text-xs text-red-500">Not assigned</span>
            </div>
          ) : (
            <div className="flex w-full flex-col">
              <div className="flex w-full items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">Manager</p>
                <AssignManagerForm
                  stationId={station.id}
                  currentManagerId={station.managerId}
                  onManagerAssigned={onManagerAssigned}
                />
              </div>
              <span className="text-xs text-foreground">
                {station.managerName || station.managerId}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Station Name */}
      <div className="flex flex-col space-y-1">
        <p className="text-xs text-muted-foreground">Station Name</p>
        <p className="text-xs text-foreground">{station.name}</p>
      </div>

      {/* Number of Employees */}
      <div className="flex flex-col space-y-1">
        <p className="text-xs text-muted-foreground">No. of Employees</p>
        <p className="text-xs text-foreground">{station.employees}</p>
      </div>

      {/* Location */}
      <div className="flex flex-col space-y-1">
        <p className="text-xs text-muted-foreground">Location</p>
        <p className="text-xs text-foreground">{station.address}</p>
      </div>

      {/* Total Salaries */}
      <div className="flex flex-col space-y-1">
        <p className="text-xs text-muted-foreground">Total Salaries</p>
        <p className="text-xs text-foreground">
          {station.totalSalaries
            ? `$${station.totalSalaries.toLocaleString()}`
            : "N/A"}
        </p>
      </div>
    </div>
  </div>
);

export const FuelPricesSection = ({ prices }: { prices: SellingPrices[] }) =>
  prices.length === 0 ? (
    <div className="flex flex-col items-center justify-center gap-2 py-4">
      <p className="text-sm text-muted-foreground">No pricing data available</p>
      <Button size={"sm"} variant={"secondary"}>
        Set Prices
      </Button>
    </div>
  ) : (
    <div className="w-full">
      <h3 className="mb-4 text-sm text-muted-foreground">Selling Prices</h3>
      <div className="grid grid-cols-4 gap-2">
        {prices.map((fuel) => (
          <div key={fuel.id} className="space-y-2">
            <p className="text-xs capitalize text-muted-foreground">
              {fuel.fuelType}
            </p>
            <p className="text-xs font-medium">${fuel.price}</p>
          </div>
        ))}
      </div>
    </div>
  );

export const TankStatusSection = ({ tanks }: { tanks: Tank[] }) => (
  <div className="w-full">
    <h3 className="mb-2 text-sm text-muted-foreground">Present Tank Status</h3>
    {tanks.map((tank, index) => (
      <div
        key={index}
        className="gap-30 mb-4 flex items-center justify-between"
      >
        <p className="whitespace-nowrap text-xs text-muted-foreground">
          {tank.name}
        </p>
        <div className="relative h-6 max-w-[180px] flex-1 overflow-hidden rounded-[4px] bg-black p-1 2xl:h-10">
          <div
            className="flex h-full items-center rounded-[2px] bg-green-600"
            style={{ width: `${tank.level}%` }}
          >
            <span className="absolute right-2 px-2 text-[10px] text-white">
              {tank.level}%
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export const StationCard = ({
  station,
  branches,
}: {
  station: Station;
  branches: Branch[] | undefined;
}) => {
  const router = useRouter();

  const handleManagerAssigned = () => {
    router.refresh();
  };

  return (
    <Card className="space-y-6 bg-white p-6 shadow-lg">
      <StationInfoSection
        station={station}
        branches={branches}
        onManagerAssigned={handleManagerAssigned}
      />
      <Separator />
      <FuelPricesSection prices={station.prices} />
      <Separator />
      {/* <TankStatusSection tanks={station.tanks} /> */}
    </Card>
  );
};
