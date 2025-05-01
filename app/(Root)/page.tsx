"use client";

import Image from "next/image";
import StatCard from "@/components/dashboard components/statsCard";
import {
  SalesChart,
  TransactionsCard,
  InventoryChart,
  ActivityOverview,
} from "@/components/dashboard components/Charts";

interface SalesData {
  name: string;
  sales: number;
  expense: number;
}

interface InventoryData {
  month: string;
  desktop: number;
}

const Page = () => {
  const salesData: SalesData[] = [
    { name: "Jan", sales: 200000, expense: 150000 },
    { name: "Feb", sales: 300000, expense: 200000 },
    { name: "Mar", sales: 250000, expense: 180000 },
    { name: "Apr", sales: 320000, expense: 220000 },
    { name: "May", sales: 400000, expense: 250000 },
    { name: "Jun", sales: 450000, expense: 280000 },
    { name: "Jul", sales: 500000, expense: 300000 },
  ];

  const transactions = [
    {
      name: "Chinedu Okonkwo",
      amount: "50,000",
      liters: "75.0",
      time: "8:10 PM",
    },
    {
      name: "Adesewa Adeyemi",
      amount: "40,000",
      liters: "60.0",
      time: "8:15 PM",
    },
    {
      name: "Ibrahim Mohammed",
      amount: "25,000",
      liters: "37.5",
      time: "8:20 PM",
    },
    {
      name: "Ibrahim Mohammed",
      amount: "35,000",
      liters: "52.5",
      time: "8:25 PM",
    },
    {
      name: "Ibrahim Mohammed",
      amount: "30,000",
      liters: "45.0",
      time: "8:30 PM",
    },
    {
      name: "Ibrahim Mohammed",
      amount: "30,000",
      liters: "45.0",
      time: "8:30 PM",
    },
    {
      name: "Ibrahim Mohammed",
      amount: "30,000",
      liters: "45.0",
      time: "8:30 PM",
    },
    {
      name: "Ibrahim Mohammed",
      amount: "30,000",
      liters: "45.0",
      time: "8:30 PM",
    },
    {
      name: "Ibrahim Mohammed",
      amount: "30,000",
      liters: "45.0",
      time: "8:30 PM",
    },
  ];
  const recentTransactions = [
    { name: "petrol", amount: "50,000", type: "transfer" },
    { name: "petrol", amount: "40,000", type: "transfer" },
    { name: "petrol", amount: "25,000", type: "transfer" },
    { name: "petrol", amount: "35,000", type: "transfer" },
    { name: "petrol", amount: "30,000", type: "transfer" },
  ];

  const inventoryData: InventoryData[] = [
    { month: "January", desktop: 186 },
    { month: "February", desktop: 305 },
    { month: "March", desktop: 237 },
    { month: "April", desktop: 73 },
    { month: "May", desktop: 209 },
    { month: "June", desktop: 214 },
  ];

  return (
    <div className="min-h-screen">
      {/* Background Image */}
      <div>
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            title="Total Sales"
            value="₦20,220"
            icon={
              <Image
                src="/icons/Arrow.svg"
                alt="arrow"
                width={100}
                height={100}
                className="w-4 h-4  fill-current object-cover"
                priority
              />
            }
            progress={30}
          />
          <StatCard
            title="Total Expense"
            value="₦100,000"
            icon={
              <Image
                src="/icons/Arrow.svg"
                alt="arrow"
                width={100}
                height={100}
                className="w-4 h-4  object-cover"
                priority
              />
            }
            progress={45}
          />
          <StatCard
            title="Total Petrol Sold"
            value="3330L"
            icon={
              <Image
                src="/icons/pump.svg"
                alt="petrol"
                width={100}
                height={100}
                className="w-5 h-5 object-cover"
                priority
              />
            }
            progress={50}
          />
          <StatCard
            title="Total Diesel"
            value="440l"
            icon={
              <Image
                src="/icons/diesel.svg"
                alt="arrow"
                width={100}
                height={100}
                className="w-6 h-6  object-cover"
                priority
              />
            }
            progress={70}
          />
          <StatCard
            title="Total gas sold"
            value="7773"
            icon={
              <Image
                src="/icons/gas.svg"
                alt="arrow"
                width={100}
                height={100}
                className="w-7 h-7  object-cover"
                priority
              />
            }
            progress={70}
          />
        </div>
      </div>

      {/* Charts & Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 py-6">
        {/* Left Section: Sales & Transactions */}
        <div className="lg:col-span-2 space-y-4">
          <SalesChart title="Sales Overview" data={salesData} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TransactionsCard title="Transactions" data={recentTransactions} />
            <InventoryChart
              data={inventoryData}
              tabs={["Petrol", "Diesel", "Gas", "Kerosene"]}
            />
          </div>
        </div>

        {/* Right Section: Activity Overview */}
        <div className="lg:col-span-1 ">
          <ActivityOverview
            totalSales="₦350,000"
            totalTransactions={5867}
            transactions={transactions}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
