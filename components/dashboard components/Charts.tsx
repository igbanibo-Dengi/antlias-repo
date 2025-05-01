"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ChevronDown, Circle } from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  CartesianGrid,
  Bar,
  BarChart,
} from "recharts";
import { useState } from "react";

export const SalesChart: React.FC<{
  title: string;
  data: { name: string; sales: number; expense: number }[];
}> = ({ title, data }) => (
  <Card className="p-6 border-2 border-blue-100 rounded-lg shadow-sm">
    <h3 className="text-lg font-semibold">{title}</h3>
    <div className="flex justify-between items-center mb-4">
      <div className="flex gap-4 items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Circle size={10} className="text-blue-500" />
          <span>Sales</span>
        </div>
        <div className="flex items-center gap-1">
          <Circle size={10} className="text-teal-400" />
          <span>Expense</span>
        </div>
        <div className="flex items-center gap-1 cursor-pointer">
          <span>This Month</span>
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ left: 12, right: 12 }}>
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1E40AF" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fill: "#888" }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
        <Area
          type="monotone"
          dataKey="sales"
          stroke="#1E40AF"
          fill="url(#colorSales)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="expense"
          stroke="#1E40AF"
          fill="url(#colorExpense)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  </Card>
);

export const TransactionsCard: React.FC<{
  title: string;
  data: { name: string; amount: string; type: string }[];
}> = ({ title, data }) => (
  <Card className="p-6">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      <span className="text-blue-500 text-sm cursor-pointer">View All</span>
    </div>
    <CardContent className="p-0">
      {data.length > 0 ? (
        data.map((tx, index) => (
          <div
            key={index}
            className="py-2 border-b last:border-b-0 text-gray-600"
          >
            <div className="flex justify-between">
              <span className="font-medium">{tx.name}</span>
              <span className="font-medium">{tx.type}</span>
              <span className="font-medium">{tx.amount}</span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-muted-foreground">No Activity</p>
      )}
    </CardContent>
  </Card>
);

export const InventoryChart: React.FC<{
  data: { month: string; desktop: number }[];
  tabs: string[];
}> = ({ data, tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <Card className=" h-full">
      <CardHeader className="space-y-2">
        <h3 className="text-lg font-semibold">Inventory Level</h3>
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-4 text-muted-foreground">
            {tabs.map((tab) => (
              <span
                key={tab}
                className={`cursor-pointer text-sm ${activeTab === tab
                    ? "font-semibold border-b-2 border-primary"
                    : ""
                  }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </span>
            ))}
          </div>
        </div>
      </CardHeader>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: "#888", fontSize: 9 }}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis />
          <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
          <Bar
            dataKey="desktop"
            stackId="a"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            barSize={15}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
};

export const ActivityOverview: React.FC<{
  totalSales?: string;
  totalTransactions?: number;
  transactions?: {
    name: string;
    amount: string;
    liters: string;
    time: string;
  }[];
}> = ({ totalSales = "N/A", totalTransactions = 0, transactions = [] }) => (
  <div className="h-full flex flex-col gap-8">
    <div className="space-y-4">
      <Card className="p-6">
        <h1 className="text-lg font-semibold">
          Today&apos;s Activity Overview
        </h1>
        <div className="flex justify-between">
          <div>
            <p className="text-xl font-bold">{totalSales}</p>
            <p className="text-sm text-muted-foreground">Today&apos;s Sales</p>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold">{totalTransactions}</p>
            <p className="text-sm text-muted-foreground">Transactions</p>
          </div>
        </div>
      </Card>
    </div>

    <Card className="p-6 h-full">
      <h2 className="text-md font-semibold">Recent Transactions</h2>
      {transactions.length > 0 ? (
        <div className="mt-4 space-y-4">
          {transactions.map((tx, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <Circle size={10} className="text-primary" />
              <div>
                <p className="text-sm font-medium">{tx.name}</p>
                <p className="text-xs">
                  ₦{tx.amount} - {tx.liters}L
                </p>
                <p className="text-xs">{tx.time}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted-foreground mt-4">No Activity</p>
      )}
    </Card>
  </div>
);
