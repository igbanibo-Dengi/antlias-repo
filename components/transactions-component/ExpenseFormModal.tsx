"use client";

import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Copy, FilePlus } from "lucide-react";

const expenseSchema = z.object({
  category: z.string().min(1, "Category is required"),
  amount: z.coerce.number().min(1, "Amount must be greater than zero"),
  description: z
    .string()
    .max(2000, "Description must be under 2000 characters"),
  file: z.instanceof(File).optional(),
  permission: z.boolean().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

const ExpenseFormModal: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      category: "",
      amount: 0,
      description: "",
      permission: false,
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      form.setValue("file", event.target.files[0]);
    }
  };

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = (values: ExpenseFormValues) => {
    console.log("Form Submitted:", values);
  };

  return (
    <div className="h-full overflow-auto pr-4">
      <h2 className="text-lg font-semibold mb-4">New Expense Form</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Create a new expense form for approval
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Travel">Travel</SelectItem>
                    <SelectItem value="Food">Food</SelectItem>
                    <SelectItem value="Supplies">Supplies</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Amount */}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="₦" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe this expense"
                    maxLength={2000}
                    {...field}
                  />
                </FormControl>
                <p className="text-xs text-muted-foreground mt-1 text-right">
                  Max: 2000 characters
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* File Upload */}
          <FormField
            control={form.control}
            name="file"
            render={() => (
              <FormItem>
                <FormLabel>Upload Evidence</FormLabel>
                <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-md text-center bg-gray-50">
                  <FilePlus className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">
                    Drag and drop the file.
                  </p>

                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept=".jpg,.png,.pdf"
                    onChange={handleFileChange}
                  />

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleFileUploadClick}
                  >
                    Choose File
                  </Button>

                  {selectedFile && (
                    <p className="text-sm text-gray-600 mt-2">
                      {selectedFile.name}
                    </p>
                  )}

                  <p className="text-xs text-muted-foreground mt-2">
                    Max size: 700MB | Formats: JPG, PNG, PDF
                  </p>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Permission Checkbox */}
          <FormField
            control={form.control}
            name="permission"
            render={({ field }) => (
              <FormItem className="flex items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Request Permission for Spending</FormLabel>
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
};

export default ExpenseFormModal;
