import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SellingPrices } from "@/types";

// Types
// export type FuelPrice = {
//   petrol: string;
//   diesel: string;
//   gas: string;
//   kerosene: string;
// };

export type Tank = {
  name: string;
  level: number;
};

export type Station = {
  id: string;
  tenantId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  managerId: string | null;
  employees: number | undefined;
  totalSalaries: number | undefined;
  prices: SellingPrices[];
  // tanks: Tank[];
};

// Components
export const StationInfoSection = ({ station }: { station: Station }) => (
  <div className="w-full">
    <h3 className="mb-4 text-sm font-semibold text-muted-foreground">
      Station Information
    </h3>

    <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
      {/* Station ID */}
      <div className="flex flex-col space-y-1">
        <p className="text-xs text-muted-foreground">Station ID</p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="max-w-[120px] cursor-pointer truncate text-xs text-foreground">
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
        <p className="text-xs text-muted-foreground">Manager</p>
        <p className="text-xs">
          {station.managerId === null ? (
            <span className="text-red-500">not assigned</span>
          ) : (
            station.managerId
          )}
        </p>
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
        <p className="text-xs text-foreground">{station.totalSalaries}</p>
      </div>
    </div>
  </div>
);

export const FuelPricesSection = ({ prices }: { prices: SellingPrices[] }) =>
  prices.length === 0 ? (
    <div>empty</div>
  ) : (
    <div className="w-full">
      <h3 className="mb-4 text-sm text-muted-foreground">Selling Prices</h3>
      <div className="grid grid-cols-4 gap-2">
        {prices.map((fuel) => (
          <div key={fuel.id} className="space-y-2">
            <p className="text-xs capitalize text-muted-foreground">
              {fuel.fuelType}
            </p>
            <p className="text-xs">{fuel.price}</p>
          </div>
        ))}
      </div>
      <div className="my-4 border-t border-gray-200"></div>
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

export const StationCard = ({ station }: { station: Station }) => (
  <Card className="space-y-6 bg-white py-6 pl-6 pr-2 shadow-lg">
    <StationInfoSection station={station} />
    <Separator />
    <FuelPricesSection prices={station.prices} />
    <Separator />
    {/* <TankStatusSection tanks={station.tanks} /> */}
  </Card>
);
