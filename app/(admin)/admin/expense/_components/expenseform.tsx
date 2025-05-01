"use client";

import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const expenseSchema = z.object({
  category: z.string().min(1, "Category is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000),
  permission: z.boolean().optional(),
  file: z.instanceof(File).optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

interface ExpenseFormProps {
  onClose?: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onClose,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      permission: false
    }
  });

  const handleClearFile = () => {
    setFile(null);
    setValue("file", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
      setValue("file", droppedFile);
    }
  };

  const validateFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload JPG, PNG, or PDF.");
      return false;
    }
    if (file.size > 700 * 1024 * 1024) {
      toast.error("File size exceeds 700MB limit.");
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setValue("file", selectedFile);
    }
  };

  const onSubmit = async (data: ExpenseFormValues) => {
    setIsSubmitting(true);
    try {
      console.log("Form submitted:", data);
      // Add your submission logic here
      toast.success("Expense submitted successfully!");
      reset();
      onClose?.();
    } catch (error) {
      toast.error("Failed to submit expense. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Card className="w-full overflow-y-auto shadow-none border-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <h2 className="text-lg font-medium">New Expense Form</h2>
          <p className="text-sm text-muted-foreground">
            Create new expense for approval
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 overflow-auto pr-1"
        >
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={(value) => setValue("category", value)}>
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Please Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="food">Food & Dining</SelectItem>
                <SelectItem value="supplies">Office Supplies</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              placeholder="₦"
              type="number"
              {...register("amount")}
              className=""
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe this expense"
              className="min-h-[120px] resize-none"
              maxLength={2000}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Upload evidence</Label>
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className={`flex border-2 border-dashed rounded-lg p-6 ${errors.file ? "border-red-500" : "border-gray-200"
                }`}
              role="button"
              aria-label="File upload drop zone"
              tabIndex={0}
            >
              <input
                ref={fileInputRef}
                type="file"
                id="file-upload"
                className="hidden"
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf"
              />
              <label htmlFor="file-upload" className="cursor-pointer w-full">
                <div className="flex justify-between items-center">
                  <FolderOpen className="w-6 h-6 text-primary" />
                  <div className="text-semiblack truncate max-w-[200px]">
                    {file ? (
                      <div className="flex items-center gap-2">
                        {file.name}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearFile();
                          }}
                          className="text-muted-foreground hover:text-red-500"
                          aria-label="Remove file"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      "Drag and drop or click to upload"
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-primary"
                  >
                    Browse files
                  </Button>
                </div>
              </label>
            </div>
            {errors.file && (
              <p className="text-red-500 text-sm">{errors.file.message}</p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Maximum size: 700 MB, file format: JPG, PNG, PDF
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="permission" {...register("permission")} />
            <Label htmlFor="permission" className="text-sm font-normal">
              Request for Permission for spending
            </Label>
          </div>

          <Button className="w-full" size="lg" type="submit">
            Submit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}


export default ExpenseForm;