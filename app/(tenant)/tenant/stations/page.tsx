import StationSearchAndFilterBar from "@/components/employee-component/station-components/StationSearchAndFilterBar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function FuelStationDashboard() {


  return (
    <div className="min-h-screen">
      <Button size={"lg"} className="mb-30 absolute left-5 -top-2 -translate-y-6">
        <Link href={"/tenant/stations/new"} className="flex items-center">
          <Plus className="h-4 w-4 bg-gray-100/40 rounded-full mr-2" />
          New Station
        </Link>
      </Button>
      <StationSearchAndFilterBar />

      <div className="flex justify-end my-2 pr-20">
        <span className="text-xs text-gray-400">Total Salaries</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-12 bg-white rounded-lg">
        {/* {stations.map((station, index) => (
          <StationCard key={index} station={station} />
        ))} */}
      </div>
    </div>
  );
}