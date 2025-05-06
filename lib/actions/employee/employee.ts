"use server"

import db from "@/database/drizzle";
import { employees, lower, users } from "@/database/drizzle/schema";
import { eq } from "drizzle-orm";
import { getBranchById, getEmployeeById, getTenantById, getTenantId } from "../tenant/tenant.action";
import bcrypt from "bcrypt";
import { createVerificationTokenAction } from "../admin/create-verification-token-action";
import { sendEmail } from "@/lib/workflow";
import { sendForgotPasswordEmail } from "@/lib/emails/forgotPassword";
import { USER_ROLES } from "@/lib/constants";
import { auth } from "@/auth";
import { employeeFormSchema } from "@/validators/employee-form-validator";
import { z } from "zod";
import { sendStationInvitationEmail } from "@/lib/emails/invitationEmail";


/**
 * Deletes a user by ID
 * Used for cleanup when employee creation fails
 */
export async function deleteUser(userId: string) {
  try {
    await db.delete(users).where(eq(users.id, userId))
    console.log(`Cleanup: Successfully deleted user with ID ${userId}`)
    return true
  } catch (error) {
    console.error(`Cleanup: Failed to delete user with ID ${userId}:`, error)
    return false
  }
}



export const createEmployee = async (values: z.infer<typeof employeeFormSchema>) => {

  const validatedFields = employeeFormSchema.safeParse(values)

  if (!validatedFields.success) {
    return { success: false, error: "Invalid fields", statusCode: 400 }
  }

  const {
    branchId,
    firstName,
    lastName,
    email,
    contactNumber,
    address,
    position,
    role,
    hireDate,
    salary,
    bankName,
    accountNumber,
    accountName,
    bvn,
    guarantorName,
    guarantorPhone,
    guarantorAddress,
    guarantorRelationship,
  } = validatedFields.data;

  const session = await auth()

  if (!session) {
    return { success: false, error: "No session found", statusCode: 401 };
  }

  if (session.user?.role !== USER_ROLES.TENANT && session.user?.role !== USER_ROLES.ADMIN) {
    return { success: false, error: "You are not authorized to perform this action", statusCode: 403 };
  }

  const tenantId = await getTenantId()

  try {

    if (!tenantId) {
      return {
        success: false,
        error: "Tenant not found",
        statusCode: 404,
      };
    }

    const existingEmployee = await db
      .select({
        id: users.id,
        email: users.email,
        tenantId: users.tenantId,
      })
      .from(users)
      .where(eq(lower(users.email), values.email.toLowerCase()))
      .then((res) => res[0] ?? null);


    if (existingEmployee && existingEmployee.tenantId === tenantId) {
      return {
        success: false,
        error: "An Employee with this email already exists",
        statusCode: 409,
      };
    } else if (existingEmployee && existingEmployee.tenantId !== tenantId) {
      return {
        success: false,
        error: "An Employee with this email already exists in another tenant",
        statusCode: 409,
      };
    }

  } catch (error) {
    console.error(error)
    return { success: false, error: "Internal Server Error", statusCode: 500 };
  }

  try {
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);
    let createdUserId: string | null = null


    if (typeof tenantId !== "string") {
      throw new Error("Invalid tenantId");
    }

    // Ensure role is valid
    if (!["tenant", "admin", "user"].includes(role)) {
      throw new Error("Invalid role");
    }

    const newUser = await db
      .insert(users)
      .values({
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
        role: role as "tenant" | "admin" | "user",
        isActive: true,
        emailVerified: new Date(),
        tenantId: tenantId,
      })
      .returning()
      .then((res) => res[0]);

    if (!newUser) {
      throw new Error("Failed to create user");
    }

    createdUserId = newUser.id

    try {
      const newEmployee = await db
        .insert(employees)
        .values({
          tenantId: newUser.tenantId,
          branchId: branchId,
          userId: newUser.id,
          firstName: firstName,
          lastName: lastName,
          contactNumber: contactNumber,
          email: email,
          address: address,
          hireDate: hireDate ? hireDate.toISOString() : null,
          position: position,
          salary: salary,
          bankName: bankName,
          accountNumber: accountNumber,
          accountName: accountName,
          bvn: bvn,
          guarantorName: guarantorName,
          guarantorPhone: guarantorPhone,
          guarantorAddress: guarantorAddress,
          guarantorRelationship: guarantorRelationship,
        })
        .returning()
        .then((res) => res[0]);

      if (!newEmployee) {
        throw new Error("Failed to create employee");
      }

      // send password reset email
      const verificationToken = await createVerificationTokenAction(newUser.email)
      const token = verificationToken.token

      const branch = await getBranchById(branchId)

      if (!branch || "success" in branch) {
        throw new Error(branch?.error || "Failed to fetch branch details");
      }

      const sationName = branch.name



      const tenant = await getTenantById(tenantId)

      if (!tenant || "success" in tenant) {
        throw new Error(tenant?.error || "Failed to fetch tenant details");
      }

      const tenantName = tenant.name


      const invitationEmailData = {
        recipientName: firstName + " " + lastName,
        tenantName: tenantName,
        stationName: sationName,
        token: token,
      }

      await sendEmail({
        email,
        subject: `Welcome to Antlias,  ${tenantName} 🎉`,
        message: sendStationInvitationEmail(invitationEmailData),
      });

      return {
        success: true,
        message: "New employee created successfully",
        statusCode: 201
      };
    } catch (employeeError) {
      // If employee creation fails, clean up by deleting the user
      console.error("Employee creation failed:", employeeError)

      if (createdUserId) {
        const cleanupSuccess = await deleteUser(createdUserId)
        if (cleanupSuccess) {
          console.log("Cleanup successful: Orphaned user record deleted")
        } else {
          console.error("Cleanup failed: Could not delete orphaned user record")
        }
      }

      if (employeeError instanceof Error) {
        throw new Error(`Failed to create employee: ${employeeError.message}`);
      } else {
        throw new Error("Failed to create employee: Unknown error");
      }
    }

  } catch (error) {
    console.error("Error in employee creation:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal Server Error",
      statusCode: 500,
    }
  }
}



const deleteEmployeeSchema = z.object({
  employeeId: z.string().uuid(),
})

/**
 * Server action to delete an employee and their associated user account
 * @param employeeId The ID of the employee to delete
 */
export async function deleteEmployeeAction(values: z.infer<typeof deleteEmployeeSchema>) {
  console.log("Deleting employee")

  const validatedFields = deleteEmployeeSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid employee ID",
      statusCode: 400,
    }
  }

  const { employeeId } = validatedFields.data

  try {
    // First, find the employee to get the associated user ID
    const employee = await db.query.employees.findFirst({
      where: (employees, { eq }) => eq(employees.id, employeeId),
    })

    if (!employee) {
      return {
        success: false,
        error: "Employee not found",
        statusCode: 404,
      }
    }

    const userId = employee.userId

    // Delete the employee record first
    const deletedEmployee = await db
      .delete(employees)
      .where(eq(employees.id, employeeId))
      .returning()
      .then((res) => res[0])

    if (!deletedEmployee) {
      return {
        success: false,
        error: "Failed to delete employee record",
        statusCode: 500,
      }
    }

    console.log(`Successfully deleted employee with ID ${employeeId}`)

    // Then delete the associated user
    if (userId) {
      const deletedUser = await db
        .delete(users)
        .where(eq(users.id, userId))
        .returning()
        .then((res) => res[0])

      if (!deletedUser) {
        console.error(`Warning: Deleted employee ${employeeId} but failed to delete associated user ${userId}`)
        return {
          success: true,
          warning: "Employee deleted but failed to delete associated user account",
          statusCode: 200,
        }
      }

      console.log(`Successfully deleted associated user with ID ${userId}`)
    }

    return {
      success: true,
      message: "Employee and associated user account deleted successfully",
      statusCode: 200,
    }
  } catch (error) {
    console.error("Error in employee deletion:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal Server Error",
      statusCode: 500,
    }
  }
}


export async function getEmployeeByBranchId(branchId: string) {

  const session = await auth()

  if (!session) {
    return { success: false, error: "No session found", statusCode: 401 };
  }

  if (session.user?.role !== USER_ROLES.TENANT && session.user?.role !== USER_ROLES.ADMIN) {
    return { success: false, error: "You are not authorized to perform this action", statusCode: 403 };
  }

  try {

    const response = await db
      .select()
      .from(employees)
      .where(eq(employees.branchId, branchId))
      .then((res) => res ?? []);

    return response

  } catch (error) {
    console.error(error)
    return {
      success: false,
      error: "Error in getEmpoyeeByBranch action",
      statusCode: 409
    }
  }


}