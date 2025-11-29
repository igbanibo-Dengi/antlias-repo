import { z } from "zod";

export const expenseTypeOptions = [
  { value: "fuel", label: "Fuel" },
  { value: "maintenance", label: "Maintenance" },
  { value: "salary", label: "Salary" },
  { value: "utility", label: "Utility" },
  { value: "other", label: "Other" },
] as const;

export const expenseFormSchema = z.object({
  branchId: z.string().uuid("Please select a branch"),
  expenseType: z.enum(
    ["fuel", "maintenance", "salary", "utility", "other"] as const,
    {
      errorMap: () => ({ message: "Please select a category" }),
    },
  ),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description must be less than 2000 characters"),
  receiptPhoto: z
    .string()
    .url("Please upload a valid receipt URL")
    .refine((value) => {
      const base = value.split("?")[0] ?? "";
      const hasImageExtension = /\.(png|jpe?g|gif|bmp|webp|svg)$/i.test(base);
      const isUploadthingUrl = /\.(ufs\.sh|uploadthing\.com)\//i.test(value);

      return hasImageExtension || isUploadthingUrl;
    }, {
      message: "Receipt must be an image (JPG, PNG, GIF, BMP, WEBP, or SVG)",
    }),
});

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;
