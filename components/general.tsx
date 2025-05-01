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
    <div className="relative p-4 mx-auto">
      {/* Close Button */}
      {/* <button className="absolute right-4 top-4">
        <X className="h-5 w-5 text-muted-foreground" />
      </button> */}

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {/* Company Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium  mb-2">Company Information</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Configure system-wide preferences and defaults
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Logo
              </label>
              <div className="flex border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
                <div className="flex items-center mb-2">
                  <FileIcon className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm text-gray-600">
                    Drag and drop the file.
                  </span>
                </div>
                <Button variant="outline" size="sm" className="text-xs">
                  File upload
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Maximum size: 20 MB, file format: JPG, PNG
              </p>
            </div>

            <div>
              <label
                htmlFor="company-id"
                className="block text-sm font-medium text-gray-700 mb-1"
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
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Station Name
              </label>
              <Input id="station-name" />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address
              </label>
              <Input id="address" />
            </div>

            <div>
              <label
                htmlFor="contact-phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Contact Phone
              </label>
              <Input id="contact-phone" />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <Input id="email" />
            </div>
          </div>
        </div>

        {/* Payroll Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium  mb-6">Payroll Settings</h2>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="pay-period"
                className="block text-sm font-medium text-gray-700 mb-1"
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
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                PayDay
              </label>
              <Input id="payday" />
            </div>
          </div>
        </div>

        {/* Roles */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium  mb-6">Roles</h2>
          <div className="space-y-4">
            {["Station Manager", "Admin", "Attendant"].map((role) => (
              <div
                key={role}
                className="flex justify-between items-center py-2 border-b"
              >
                <div>
                  <h3 className="font-medium">{role}</h3>
                  <button className="text-blue-600 text-sm">Edit</button>
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
      <div className="flex justify-end mt-6">
        <Button size={"lg"}>Submit</Button>
      </div>
    </div>
  );
};

export default General;
