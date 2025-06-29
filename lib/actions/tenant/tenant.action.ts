"use server";

import { auth } from "@/auth";
import db from "@/database/drizzle";
import {
  branches,
  employees,
  sellingPrices,
  tenants,
  users,
} from "@/database/drizzle/schema";
import { USER_ROLES } from "@/lib/constants";
import {
  ActionResponse,
  Branch,
  DbUser,
  EditBranchFormValues,
  Employee,
  SellingPrices,
} from "@/types";
import {
  EditStationSchema,
  newStationSchema,
} from "@/validators/branch-validator";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { getAllEmployees } from "../employee/employee";
import { cache } from "react";

export const getTenantId = async () => {
  try {
    const session = await auth();

    if (!session) {
      return { success: false, error: "No session found", statusCode: 401 };
    }

    const userId = session?.user?.id;

    const tenantId = await db
      .select({ tenantId: tenants.id })
      .from(users)
      .innerJoin(tenants, eq(users.tenantId, tenants.id))
      .where(eq(users.id, userId!))
      .then((res) => res[0]?.tenantId);

    if (!tenantId) {
      return { success: false, error: "Tenant not found", statusCode: 404 };
    }

    return tenantId;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "An error occurred while fetching the tenant id",
      statusCode: 500,
    };
  }
};

export const getTenantById = async (tenantId: string) => {
  try {
    const session = await auth();

    if (!session) {
      return { success: false, error: "No session found", statusCode: 401 };
    }

    if (session.user?.role !== USER_ROLES.TENANT) {
      return {
        success: false,
        error: "You are not authorized to perform this action",
        statusCode: 403,
      };
    }

    const tenant = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, tenantId))
      .then((res) => res[0] ?? null);

    return tenant;
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "An error occurred while fetching the tenant",
      statusCode: 500,
    };
  }
};
export const getAllTenantBranches = cache(async ():
  Promise<ActionResponse<Branch[]>> => {
  const session = await auth();

  // Authentication check
  if (!session) {
    return {
      success: false,
      error: "No session found",
      statusCode: 401,
    };
  }

  // Authorization check
  if (
    session.user?.role !== USER_ROLES.TENANT &&
    session.user?.role !== USER_ROLES.ADMIN
  ) {
    return {
      success: false,
      error: "You are not authorized to perform this action",
      statusCode: 403,
    };
  }

  try {
    const tenantIdResult = await getTenantId();
    console.log(tenantIdResult);


    if (!tenantIdResult || typeof tenantIdResult !== "string") {
      return {
        success: false,
        error: "Tenant ID not found",
        statusCode: 404,
      };
    }

    const branch = await db
      .select()
      .from(branches)
      .where(eq(branches.tenantId, tenantIdResult))
      .then((res) => res ?? []);

    return {
      success: true,
      data: branch,
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "An error occurred while fetching the tenant branches",
      statusCode: 500,
    };
  }
})

export const getBranchById = async (
  id: string,
): Promise<
  | Branch
  | {
    success: false;
    error: string;
    statusCode: number;
  }
> => {
  try {
    const session = await auth();

    if (!session) {
      return { success: false, error: "No session found", statusCode: 401 };
    }
    if (session.user?.role !== USER_ROLES.TENANT) {
      return {
        success: false,
        error: "You are not authorized to perform this action",
        statusCode: 403,
      };
    }

    const branch = await db
      .select()
      .from(branches)
      .where(eq(branches.id, id))
      .then((res) => res[0] ?? null);

    if (!branch) {
      return { success: false, error: "Branch not found", statusCode: 404 };
    }
    return branch;
  } catch (error) {
    console.error("Error in getBranchById:", error);
    return {
      success: false,
      error: "An error occurred while fetching the branch",
      statusCode: 500,
    };
  }
};

export const getEmployeeById = async (
  id: string,
): Promise<
  Employee | { success: false; error: string; statusCode: number }
> => {
  try {
    const session = await auth();

    if (!session) {
      return { success: false, error: "No session found", statusCode: 401 };
    }

    const employee = await db
      .select()
      .from(employees)
      .where(eq(employees.userId, id))
      .then((res) => res[0] ?? null);

    if (!employee) {
      return { success: false, error: "Employee not found", statusCode: 404 };
    }

    return employee;

  } catch (error) {
    console.error("Error in getEmployeeById:", error);
    return {
      success: false,
      error: "An error occurred while fetching the employee",
      statusCode: 500,
    };
  }
};

export const assignManagerToBranch = async (
  branchId: string,
  employeeUserId: string,
): Promise<ActionResponse<Branch>> => {
  try {
    const session = await auth();

    // Authentication check
    if (!session) {
      return {
        success: false,
        error: "No session found",
        statusCode: 401,
      };
    }

    // Authorization check
    if (
      session.user?.role !== USER_ROLES.TENANT &&
      session.user?.role !== USER_ROLES.ADMIN
    ) {
      return {
        success: false,
        error: "You are not authorized to perform this action",
        statusCode: 403,
      };
    }

    const branch = await getBranchById(branchId);
    if ("success" in branch && !branch.success) {
      return branch;
    }

    const updatedBranch = await db
      .update(branches)
      .set({ managerId: employeeUserId })
      .where(eq(branches.id, branchId))
      .returning()
      .then((res) => res[0]);

    return {
      success: true,
      data: updatedBranch,
      statusCode: 200,
    };
  } catch (error) {
    console.error("Error in assignManagerToBranch:", error);
    return {
      success: false,
      error: "An error occurred while assigning the manager to the branch",
      statusCode: 500,
    };
  }
};

export const getManagerById = async (
  managerId: string,
): Promise<DbUser | { success: false; error: string; statusCode: number }> => {
  try {
    const manager = await db
      .select()
      .from(users)
      .where(eq(users.id, managerId))
      .then((res) => res[0] ?? null);

    if (!manager) {
      return { success: false, error: "Manager not found", statusCode: 404 };
    }

    return manager;
  } catch (error) {
    console.error("Error in getManagerById:", error);
    return {
      success: false,
      error: "An error occurred while fetching the manager",
      statusCode: 500,
    };
  }
};

export async function createBranch(
  values: z.infer<typeof newStationSchema>,
): Promise<ActionResponse<Branch>> {
  const validatedFields = newStationSchema.safeParse(values);

  const session = await auth();

  // Authentication check
  if (!session) {
    return {
      success: false,
      error: "No session found",
      statusCode: 401,
    };
  }

  // Authorization check
  if (
    session.user?.role !== USER_ROLES.TENANT &&
    session.user?.role !== USER_ROLES.ADMIN
  ) {
    return {
      success: false,
      error: "You are not authorized to perform this action",
      statusCode: 403,
    };
  }

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid input data",
      statusCode: 400,
    };
  }

  const {
    branchName,
    city,
    state,
    address,
    phone,
    // managerId
  } = validatedFields.data;

  try {
    const tenantIdResult = await getTenantId();

    if (!tenantIdResult || typeof tenantIdResult !== "string") {
      return {
        success: false,
        error: "Tenant ID not found",
        statusCode: 404,
      };
    }

    const newBranch = await db
      .insert(branches)
      .values({
        tenantId: tenantIdResult,
        name: branchName,
        address: address,
        city: city,
        state: state,
        contactPhone: phone,
        // managerId: managerId,
      })
      .returning()
      .then((res) => res[0]);

    return {
      success: true,
      data: newBranch,
      statusCode: 201,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "An error occurred while creating the branch",
      statusCode: 500,
    };
  }
}

export async function editBranch(
  branchId: string,
  values: EditBranchFormValues,
): Promise<ActionResponse<Branch>> {
  const validatedFields = EditStationSchema.safeParse(values);

  console.log("Validated Fields:", validatedFields);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid input data",
      statusCode: 400,
    };
  }

  const {
    branchName,
    address,
    city,
    state,
    contactPhone,

    // managerId
  } = validatedFields.data;

  console.log(validatedFields.data);

  const session = await auth();

  // Authentication check
  if (!session) {
    return {
      success: false,
      error: "No session found",
      statusCode: 401,
    };
  }

  // Authorization check
  if (
    session.user?.role !== USER_ROLES.TENANT &&
    session.user?.role !== USER_ROLES.ADMIN
  ) {
    return {
      success: false,
      error: "You are not authorized to perform this action",
      statusCode: 403,
    };
  }

  try {
    const branch = await getBranchById(branchId);
    if ("success" in branch && !branch.success) {
      return branch;
    }

    const updatedBranch = await db
      .update(branches)
      .set({
        name: branchName,
        address: address,
        city: city,
        state: state,
        contactPhone: contactPhone,
      })
      .where(eq(branches.id, branchId))
      .returning()
      .then((res) => res[0]);

    return {
      success: true,
      data: updatedBranch,
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "An error occurred while updating the branch",
      statusCode: 500,
    };
  }
}

export async function deleteBranch(
  branchId: string,
): Promise<ActionResponse<Branch>> {
  const session = await auth();

  // Authentication check
  if (!session) {
    return {
      success: false,
      error: "No session found",
      statusCode: 401,
    };
  }

  // Authorization check
  if (
    session.user?.role !== USER_ROLES.TENANT &&
    session.user?.role !== USER_ROLES.ADMIN
  ) {
    return {
      success: false,
      error: "You are not authorized to perform this action",
      statusCode: 403,
    };
  }

  try {
    const branch = await getBranchById(branchId);
    if ("success" in branch && !branch.success) {
      return branch;
    }

    await db.delete(branches).where(eq(branches.id, branchId));

    return {
      success: true,
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "An error occurred while deleting the branch",
      statusCode: 500,
    };
  }
}

export async function transferAllEmployeesToBranch(
  fromBranchId: string,
  toBranchId: string,
): Promise<ActionResponse<null>> {
  const session = await auth();

  if (!session) {
    return {
      success: false,
      error: "No session found",
      statusCode: 401,
    };
  }

  if (
    session.user?.role !== USER_ROLES.TENANT &&
    session.user?.role !== USER_ROLES.ADMIN
  ) {
    return {
      success: false,
      error: "You are not authorized to perform this action",
      statusCode: 403,
    };
  }

  try {
    // Update all employees' branchId
    await db
      .update(employees)
      .set({ branchId: toBranchId, position: "undesignated" })
      .where(eq(employees.branchId, fromBranchId));

    return {
      success: true,
      statusCode: 200,
      data: null,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "An error occurred while transferring employees",
      statusCode: 500,
    };
  }
}

export async function getSellingPrices(
  branchId: string,
): Promise<ActionResponse<SellingPrices[]>> {
  const session = await auth();

  // Authentication check
  if (!session) {
    return {
      success: false,
      error: "No session found",
      statusCode: 401,
    };
  }

  // Authorization check
  if (
    session.user?.role !== USER_ROLES.TENANT &&
    session.user?.role !== USER_ROLES.ADMIN
  ) {
    return {
      success: false,
      error: "You are not authorized to perform this action",
      statusCode: 403,
    };
  }

  try {
    const prices = await db
      .select()
      .from(sellingPrices)
      .where(eq(sellingPrices.branchId, branchId))
      .then((res) => res ?? []);

    return {
      success: true,
      data: prices,
      statusCode: 200,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "An error occurred while fetching the tenant branches",
      statusCode: 500,
    };
  }
}
