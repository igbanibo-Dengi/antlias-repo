"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { toast } from "sonner";

const transactionSchema = z.object({
  attendant: z.string().min(1, "Please select an attendant"),
  fuelType: z.string().min(1, "Please select a fuel type"),
  totalAmount: z.coerce.number().min(1, "Amount must be greater than 0"),
  cashAmount: z.coerce.number().min(0, "Amount cannot be negative"),
  transferAmount: z.coerce.number().min(0, "Amount cannot be negative"),
  cardAmount: z.coerce.number().min(0, "Amount cannot be negative"),
  litersSold: z.coerce.number().min(0, "Liters sold cannot be negative"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  permission: z.boolean(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface TransactionFormModalProps {
  onClose?: () => void;
}

const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  onClose,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      attendant: "",
      fuelType: "",
      totalAmount: 0,
      cashAmount: 0,
      transferAmount: 0,
      cardAmount: 0,
      litersSold: 0,
      startTime: "",
      endTime: "",
      permission: false,
    },
  });

  const onSubmit = (values: TransactionFormValues) => {
    console.log("Form Submitted:", values);
    setIsSubmitting(true);
    setTimeout(() => {
      toast.success("Transaction submitted successfully!");
      setIsSubmitting(false);
      onClose?.();
    }, 2000);

  };

  return (
    <div className="h-[90vh] 2xl:h-fit overflow-y-auto px-2">
      <h2 className="text-xl font-semibold">Transaction Form</h2>
      <p className="text-sm text-muted-foreground mb-6">
        {" "}
        Create periodic sales remittance for approval
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Attendant */}
          <div className="space-y-2">
            <FormLabel>Attendant</FormLabel>
            <FormField
              control={form.control}
              name="attendant"
              render={({ field }) => (
                <FormItem>
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
                      <SelectItem value="John Doe">John Doe</SelectItem>
                      <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Fuel Type and Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormLabel>Fuel</FormLabel>
              <FormField
                control={form.control}
                name="fuelType"
                render={({ field }) => (
                  <FormItem>
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
                        <SelectItem value="Petrol">Petrol</SelectItem>
                        <SelectItem value="Diesel">Diesel</SelectItem>
                        <SelectItem value="Kerosene">Kerosene</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>Amount</FormLabel>
              <FormField
                control={form.control}
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="₦" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Cash Method and Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormLabel>Method</FormLabel>
              <Select defaultValue="cash">
                <SelectTrigger className="w-full pointer-events-none text-foreground" disabled >
                  <SelectValue className="disabled:text-foreground">Cash</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  {/* <SelectItem value="transfer">Transfer</SelectItem> */}
                  {/* <SelectItem value="card">Card</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <FormLabel>Amount</FormLabel>
              <FormField
                control={form.control}
                name="cashAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="₦" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Transfer Method and Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormLabel>Method</FormLabel>
              <Select defaultValue="transfer">
                <SelectTrigger className="w-full pointer-events-none text-foreground" disabled>
                  <SelectValue className="disabled:text-foreground">Transfer</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transfer" disabled>Transfer</SelectItem>
                  {/* <SelectItem value="cash">Cash</SelectItem> */}
                  {/* <SelectItem value="card">Card</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <FormLabel>Amount</FormLabel>
              <FormField
                control={form.control}
                name="transferAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="₦" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Card Method and Amount */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormLabel>Method</FormLabel>
              <Select defaultValue="card">
                <SelectTrigger className="w-full pointer-events-none text-foreground" disabled>
                  <SelectValue className="disabled:text-foreground">Card</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="cash">Cash</SelectItem> */}
                  {/* <SelectItem value="transfer">Transfer</SelectItem> */}
                  <SelectItem value="card" disabled>Card</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <FormLabel>Amount</FormLabel>
              <FormField
                control={form.control}
                name="cardAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="₦" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          {/* Total Liters Sold */}
          <div className="space-y-2">
            <FormLabel>Total Liters Sold</FormLabel>
            <FormField
              control={form.control}
              name="litersSold"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="0" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Start Time & End Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <FormLabel>Start Time</FormLabel>
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="time" placeholder="00:00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormLabel>End Time</FormLabel>
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="time" placeholder="00:00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          Amount Label
          <div className="space-y-2">
            <FormLabel>Amount</FormLabel>
          </div>
          {/* Permission Checkbox */}
          <FormField
            control={form.control}
            name="permission"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Request for Permission for spending</FormLabel>
                </div>
              </FormItem>
            )}
          />
          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default TransactionFormModal;
