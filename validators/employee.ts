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
    .min(5, "Address must be at least 5 characters")
    .max(200, "Address must be less than 200 characters")
    .optional(),

  position: z.string()
    .min(1, "Please select a position"),

  salary: z.number()
    .min(0, "Salary must be a positive number")
    .max(10000000, "Salary must be less than ₦10,000,000")
    .optional(),

  bankName: z.string()
    .min(2, "Bank name must be at least 2 characters")
    .optional(),

  accountNumber: z.string()
    .min(10, "Account number must be at least 10 digits")
    .regex(/^[0-9]+$/, "Account number must contain only numbers")
    .optional(),

  accountName: z.string()
    .min(2, "Account name must be at least 2 characters")
    .optional(),

  bvn: z.string()
    .length(11, "BVN must be exactly 11 digits")
    .regex(/^[0-9]+$/, "BVN must contain only numbers")
    .optional(),

  guarantorName: z.string()
    .min(2, "Guarantor name must be at least 2 characters")
    .optional(),

  guarantorPhone: z.string()
    .min(11, "Guarantor phone must be at least 11 digits")
    .regex(/^(?:\+234|234|0)?(7[0-9]|8[0-9]|9[0-9])[0-9]{8}$/, "Invalid Nigerian phone number")
    .optional(),

  guarantorAddress: z.string()
    .min(5, "Guarantor address must be at least 5 characters")
    .optional(),

  guarantorRelationship: z.string()
    .min(1, "Please select a relationship")
    .optional(),
});


export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;
