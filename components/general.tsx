import React from "react";
import { X, FileIcon } from "lucide-react"; // Ensure these are valid imports
import { Button } from "@/components/ui/button"; // Adjust based on your project structure
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const General = () => {
  return (
    <div className="relative mx-auto p-4">
      {/* Close Button */}
      {/* <button className="absolute right-4 top-4">
        <X className="h-5 w-5 text-muted-foreground" />
      </button> */}

      {/* Three Column Layout */}
      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Company Information */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-medium">Company Information</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Configure system-wide preferences and defaults
          </p>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Logo
              </label>
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6">
                <div className="mb-2 flex items-center">
                  <FileIcon className="mr-2 h-5 w-5 text-blue-600" />
                  <span className="text-sm text-gray-600">
                    Drag and drop the file.
                  </span>
                </div>
                <Button variant="outline" size="sm" className="text-xs">
                  File upload
                </Button>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Maximum size: 20 MB, file format: JPG, PNG
              </p>
            </div>

            <div>
              <label
                htmlFor="company-id"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Company ID
              </label>
              <Input
                id="company-id"
                value="7666"
                className="bg-gray-100"
                readOnly
              />
            </div>

            <div>
              <label
                htmlFor="station-name"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Station Name
              </label>
              <Input id="station-name" />
            </div>

            <div>
              <label
                htmlFor="address"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <Input id="address" />
            </div>

            <div>
              <label
                htmlFor="contact-phone"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Contact Phone
              </label>
              <Input id="contact-phone" />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <Input id="email" />
            </div>
          </div>
        </div>

        {/* Payroll Settings */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-medium">Payroll Settings</h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="pay-period"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Default Pay Period
              </label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Please Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                htmlFor="payday"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                PayDay
              </label>
              <Input id="payday" />
            </div>
          </div>
        </div>

        {/* Roles */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-medium">Roles</h2>
          <div className="space-y-4">
            {["Station Manager", "Admin", "Attendant"].map((role) => (
              <div
                key={role}
                className="flex items-center justify-between border-b py-2"
              >
                <div>
                  <h3 className="font-medium">{role}</h3>
                  <button className="text-sm text-blue-600">Edit</button>
                </div>
                <div className="text-right">
                  <span className="font-medium">₦164,120</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex justify-end">
        <Button size={"lg"}>Submit</Button>
      </div>
    </div>
  );
};

export default General;
