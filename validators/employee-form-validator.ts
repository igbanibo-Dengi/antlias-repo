import { z } from "zod";

export const employeeFormSchema = z.object({
  firstName: z.string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z.string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[A-Za-z]+$/, "Last name must contain only letters"),

  email: z.string()
    .email("Invalid email address"),

  contactNumber: z.string()
    .min(11, "Phone number must be at least 11 digits")
    .regex(/^(?:\+234|234|0)?(7[0-9]|8[0-9]|9[0-9])[0-9]{8}$/, "Invalid Nigerian phone number"),

  address: z.string()
    .max(200, "Address must be less than 200 characters")
    .optional(),

  hireDate: z.date().optional(),

  position: z.string()
    .min(1, "Please select a position"),

  branchId: z.string()
    .min(1, "Please select a branch"),

  role: z.string()
    .min(1, "Please select a role"),

  salary: z.number()
    .min(0, "Salary must be a positive number")
    .max(10000000, "Salary must be less than ₦10,000,000"),

  // commission: z.number()
  //   .min(0, "Salary must be a positive number")
  //   .max(100, "commission must be between 0& and 100%")
  //   .optional(),

  bankName: z.string()
    .min(2, "Bank name must be at least 2 characters"),

  accountNumber: z.string()
    .min(10, "Account number must be at least 10 digits")
    .regex(/^[0-9]+$/, "Account number must contain only numbers"),

  accountName: z.string()
    .min(2, "Account name must be at least 2 characters"),

  bvn: z.string()
    .length(11, "BVN must be exactly 11 digits")
    .regex(/^[0-9]+$/, "BVN must contain only numbers"),

  guarantorName: z.string()
    .optional(),

  guarantorPhone: z.union([
    z.string()
      .regex(/^(?:\+234|234|0)?(7[0-9]|8[0-9]|9[0-9])[0-9]{8}$/, "Invalid Nigerian phone number"),
    z.literal("") // Allows empty string
  ]).optional(),

  guarantorAddress: z.string()
    .optional(),

  guarantorRelationship: z.string()
    .optional(),
});


export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
