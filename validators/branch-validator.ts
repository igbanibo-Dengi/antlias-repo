import { z } from "zod";

// Schemas
export const newStationSchema = z.object({
  branchName: z.string().min(2, { message: "Station name is required" }),
  city: z.string().min(2, { message: "Location is required" }),
  state: z.string().min(2, { message: "State is required" }),
  address: z.string().min(2, { message: "Address is required" }),
  // managerId: z.string().optional(),
  phone: z
    .string()
    .regex(
      /^(?:\+234|234|0)?(7[0-9]|8[0-9]|9[0-9])[0-9]{8}$/,
      "Invalid phone number",
    ),
});

export const EditStationSchema = z.object({
  branchName: z.string().min(1, "Name is required"),
  contactPhone: z
    .string()
    .regex(
      /^(?:\+234|234|0)?(7[0-9]|8[0-9]|9[0-9])[0-9]{8}$/,
      "Invalid phone number",
    ),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  isHQ: z.boolean().default(false),
  active: z.boolean().default(true),
});
