import { z } from "zod";

export const fuelTypeOptions = [
  { value: "petrol", label: "Petrol" },
  { value: "diesel", label: "Diesel" },
  { value: "kerosene", label: "Kerosene" },
  { value: "gas", label: "Gas" },
] as const;

export const transactionFormSchema = z.object({
  branchId: z.string().uuid("Please select a branch"),
  employeeId: z.string().uuid("Please select an attendant"),
  fuelType: z.enum(["petrol", "diesel", "kerosene", "gas"], {
    errorMap: () => ({ message: "Please select a fuel type" }),
  }),
  totalAmount: z.coerce.number().positive("Amount must be greater than 0"),
  cashAmount: z.coerce.number().min(0, "Amount cannot be negative"),
  transferAmount: z.coerce.number().min(0, "Amount cannot be negative"),
  cardAmount: z.coerce.number().min(0, "Amount cannot be negative"),
  litersSold: z.coerce.number().min(0, "Liters sold cannot be negative"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
}).superRefine((data, ctx) => {
  const paymentsTotal = data.cashAmount + data.transferAmount + data.cardAmount;
  const difference = Math.abs(paymentsTotal - data.totalAmount);

  if (difference > 0.01) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Cash, transfer and card must add up to the total",
      path: ["totalAmount"],
    });
  }
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
