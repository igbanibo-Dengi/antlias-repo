import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search } from "lucide-react";
import Image from "next/image";

const StationSearchAndFilterBar = () => (
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


export default StationSearchAndFilterBar;