import { Card, CardContent } from "@/components/ui/card";
import { JSX } from "react";
import React from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: JSX.Element;
  progress: number;
}

const statsCard = ({ title, value, icon, progress }: StatCardProps) => {
  return (
    <Card className="p-4 shadow-md">
      <CardContent className="flex items-center justify-between p-2">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 36 36">
            <path
              className="text-gray-200 stroke-current"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-blue-500 stroke-current"
              strokeWidth="3"
              fill="none"
              strokeDasharray={`${progress}, 100`}
              d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831"
            />
          </svg>
          <span className="text-blue-300">{icon}</span>
        </div>
        <div className="text-right">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className="text-lg font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default statsCard;
