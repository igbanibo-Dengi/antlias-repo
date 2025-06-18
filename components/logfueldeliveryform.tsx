"use client";

import type React from "react";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FolderOpen } from "lucide-react";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define form schema with validation
const fuelDeliverySchema = z.object({
  tankId: z.string({
    required_error: "Please select a tank",
  }),
  supplier: z.string().min(1, "Supplier is required"),
  deliveryDate: z.string({
    required_error: "Please select a delivery date",
  }),
  volume: z.coerce
    .number()
    .positive("Volume must be greater than 0")
    .min(1, "Volume must be at least 1 liter"),
  cost: z.coerce
    .number()
    .positive("Cost must be greater than 0")
    .min(1, "Cost must be at least 1"),
  receivedBy: z.string().min(1, "Received by is required"),
  // We don't validate files with Zod since they're handled separately
});

type FuelDeliveryFormValues = z.infer<typeof fuelDeliverySchema>;

// Custom file upload component
interface FileUploadProps {
  label: string;
  file: File | null;
  setFile: (file: File | null) => void;
  type: "waybill" | "receipt";
  description?: string;
}

function FileUpload({
  label,
  file,
  setFile,
  type,
  description,
}: FileUploadProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = event.target.files?.[0] || null;
    setFile(newFile);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newFile = event.dataTransfer.files?.[0] || null;
    setFile(newFile);
  };

  return (
    <FormItem className="space-y-2">
      <FormLabel>{label}</FormLabel>
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="flex cursor-pointer rounded-lg border-2 border-dashed p-6"
      >
        <input
          type="file"
          id={`${type}-upload`}
          className="hidden"
          onChange={handleFileChange}
          accept=".jpg,.png,.pdf"
        />
        <label
          htmlFor={`${type}-upload`}
          className="flex w-full cursor-pointer flex-col items-center gap-2"
        >
          <div className="flex w-full items-center justify-between space-x-4">
            <FolderOpen strokeWidth={1.5} className="h-6 w-6 text-primary" />
            <div className="text-semiblack">
              {file ? file.name : "Drag and drop the file."}
            </div>
            <div className="hover:text-primary-hover rounded-lg border border-primary px-4 py-1 text-primary hover:bg-primary hover:text-white">
              File upload
            </div>
          </div>
        </label>
      </div>
      {description && <FormDescription>{description}</FormDescription>}
    </FormItem>
  );
}

export default function FuelDeliveryForm() {
  // File state management
  const [wayBillFile, setWayBillFile] = useState<File | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  // Initialize form
  const form = useForm<FuelDeliveryFormValues>({
    resolver: zodResolver(fuelDeliverySchema),
    defaultValues: {
      tankId: "",
      supplier: "",
      deliveryDate: new Date().toISOString().split("T")[0],
      volume: 0,
      cost: 0,
      receivedBy: "",
    },
  });

  // Form submission
  function onSubmit(data: FuelDeliveryFormValues) {
    // Create a FormData object to include files
    const formData = new FormData();

    // Add form fields
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    // Add files if they exist
    if (wayBillFile) formData.append("waybill", wayBillFile);
    if (receiptFile) formData.append("receipt", receiptFile);

    console.log("Form submitted:", data);
    console.log("Files:", { wayBill: wayBillFile, receipt: receiptFile });

    // Here you would typically send the formData to your API
    alert("Fuel delivery logged successfully!");
  }

  return (
    <div className="max-h-[550px] overflow-y-auto px-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Create new log fuel delivery form
          </p>

          {/* Tank Selection */}
          <FormField
            control={form.control}
            name="tankId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tank ID</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Please Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="tank-1">Tank 1</SelectItem>
                    <SelectItem value="tank-2">Tank 2</SelectItem>
                    <SelectItem value="tank-3">Tank 3</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Supplier Input */}
          <FormField
            control={form.control}
            name="supplier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Supplier</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Delivery Date */}
          <FormField
            control={form.control}
            name="deliveryDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Delivery Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Volume Delivered */}
          <FormField
            control={form.control}
            name="volume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Volume Delivered (in liters)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Cost Input */}
          <FormField
            control={form.control}
            name="cost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cost</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type="number" placeholder="₦" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File Uploads using custom component */}
          <FileUpload
            label="WayBill"
            file={wayBillFile}
            setFile={setWayBillFile}
            type="waybill"
          />

          <FileUpload
            label="Receipt"
            file={receiptFile}
            setFile={setReceiptFile}
            type="receipt"
            description="Accepted file formats: jpg, png, pdf"
          />

          {/* Received By Input */}
          <FormField
            control={form.control}
            name="receivedBy"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Received By</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
}
