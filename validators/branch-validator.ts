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
