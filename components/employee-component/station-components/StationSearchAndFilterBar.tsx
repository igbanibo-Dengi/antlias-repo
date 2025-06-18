import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";
import Image from "next/image";

const StationSearchAndFilterBar = () => (
  <div className="mb-6 flex items-center justify-between gap-24 rounded-lg bg-white p-4 shadow-sm">
    <div className="text-base font-medium">Stations</div>
    <div className="gap-50 flex flex-1 items-center justify-between">
      <div className="relative flex flex-1 items-center">
        <Filter className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input
          className="border-gray-200 pl-10 text-sm"
          placeholder="Filter by Terminal, Customer name, Employee ID..."
        />
      </div>
      <div className="relative flex max-w-md flex-1 items-center">
        <Search className="absolute left-3 h-4 w-4 text-gray-400" />
        <Input
          className="border-gray-200 pl-10 text-sm"
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

export default StationSearchAndFilterBar;
