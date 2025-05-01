"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
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
import { toast } from "sonner";
import { useState } from "react";

// Form schema
const tankSchema = z.object({
  tankId: z.string().min(1, "Tank ID is required"),
  fuelType: z.enum(["diesel", "petrol", "gasoline", "natural-gas"]),
  capacity: z.coerce.number().min(1, "Capacity must be greater than 0"),
  fuelLevel: z.coerce.number().min(0, "Fuel level cannot be negative"),
  maintenance: z.enum(["none", "weekly", "monthly", "quarterly", "yearly"]),
  date: z.string(),
});

type TankFormValues = z.infer<typeof tankSchema>;

// Fuel type options
const fuelTypes = [
  { value: "diesel", label: "Diesel" },
  { value: "petrol", label: "Petrol" },
  { value: "gasoline", label: "Gasoline" },
  { value: "natural-gas", label: "Natural Gas" },
];

// Maintenance schedule options
const maintenanceSchedules = [
  { value: "none", label: "None" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Annually" },
];

interface AddTankCardProps {
  onClose?: () => void;
}

const AddTankCard: React.FC<AddTankCardProps> = ({
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Initialize form
  const form = useForm<TankFormValues>({
    resolver: zodResolver(tankSchema),
    defaultValues: {
      tankId: "",
      fuelType: "diesel",
      capacity: 0,
      fuelLevel: 0,
      maintenance: "none",
      date: new Date().toISOString().split("T")[0],
    },
  });

  // Form submission handler
  function onSubmit(data: TankFormValues) {
    console.log("Form Submitted:", data);
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Tank added successfully!");
      onClose?.();
    }, 2000);
  }

  return (
    <Form {...form}>
      {/* form header */}
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Add New tank</h3>
        <p className="text-muted-foreground text-sm">Create new tank</p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Tank ID */}
        <FormField
          control={form.control}
          name="tankId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tank ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter tank identifier" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fuel Type */}
        <FormField
          control={form.control}
          name="fuelType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fuel Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fuelTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Capacity & Fuel Level */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacity</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fuelLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fuel Level</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Maintenance & Date */}
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="maintenance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maintenance</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select schedule" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {maintenanceSchedules.map((schedule) => (
                      <SelectItem key={schedule.value} value={schedule.value}>
                        {schedule.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full">
          {isSubmitting ? "Adding..." : "Add Tank"}
        </Button>
      </form>
    </Form>
  );
}


export default AddTankCard;