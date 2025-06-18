import { Card } from "@/components/ui/card";

// Types
export type FuelPrice = {
  petrol: string;
  diesel: string;
  gas: string;
  kerosene: string;
};

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
  // employees: number;
  totalSalaries: number | undefined;
  // prices: FuelPrice;
  // tanks: Tank[];
};

// Components
export const StationInfoSection = ({ station }: { station: Station }) => (
  <div className="mb-4 w-full">
    <h3 className="text-sm text-muted-foreground mb-2">Station Information</h3>
    <div className="flex justify-between mb-1">
      <div className="space-y-8">
        <p className="text-xs text-muted-foreground">Station ID</p>
        <p className="text-xs font-semibold text-gray-700">{station.id}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-muted-foreground">Manager</p>
        <p className="text-xs font-semibold text-gray-700">{station.managerId}</p>
      </div>
    </div>
    <div className="flex justify-between mb-1">
      <div className="space-y-8">
        <p className="text-xs text-muted-foreground">Station Name</p>
        <p className="text-xs font-semibold text-gray-700">{station.name}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-muted-foreground">No. of Employees</p>
        {/* <p className="text-xs font-semibold text-gray-700">{station.employees}</p> */}
      </div>
    </div>
    <div className="flex justify-between mb-1">
      <div className="space-y-8">
        <p className="text-xs text-muted-foreground">Location</p>
        <p className="text-xs font-semibold text-gray-700">{station.address}</p>
      </div>
      <div className="text-right">
        <p className="text-xs text-muted-foreground">Total Salaries</p>
        <p className="text-xs font-semibold text-gray-700">{station.totalSalaries}</p>
      </div>
    </div>
    <div className="border-t border-gray-200 my-4"></div>
  </div>
);

export const FuelPricesSection = ({ prices }: { prices: FuelPrice }) => (
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

export const TankStatusSection = ({ tanks }: { tanks: Tank[] }) => (
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

export const StationCard = ({ station }: { station: Station }) => (
  <Card className="bg-white p-6 space-y-6 shadow-lg">
    <StationInfoSection station={station} />
    {/* <FuelPricesSection prices={station.prices} /> */}
    {/* <TankStatusSection tanks={station.tanks} /> */}
  </Card>
);

