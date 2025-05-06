"use server"

import { auth } from "@/auth"
import db from "@/database/drizzle"
import { branches, employees, tenants, users } from "@/database/drizzle/schema"
import { USER_ROLES } from "@/lib/constants"
import { Branch, DbUser, Employee } from "@/types"
import { eq } from "drizzle-orm"

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


    return tenantId;
  } catch (error) {
    console.error(error);
    return { success: false, error: "An error occurred while fetching the tenant id", statusCode: 500 };
  }
};


export const getTenantById = async (tenantId: string) => {

  try {
    const session = await auth();

    if (!session) {
      return { success: false, error: "No session found", statusCode: 401 };
    }

    if (session.user?.role !== USER_ROLES.TENANT) {
      return { success: false, error: "You are not authorized to perform this action", statusCode: 403 };
    }

    const tenant = await db
      .select()
      .from(tenants)
      .where(eq(tenants.id, tenantId))
      .then((res) => res[0] ?? null);

    return tenant;


  } catch (error) {
    console.error(error);
    return { success: false, error: "An error occurred while fetching the tenant", statusCode: 500 };
  }

}


export const getAllTenantBranches = async () => {
  const session = await auth();

  if (!session) {
    return { success: false, error: "No session found", statusCode: 401 };
  }

  if (session.user?.role !== USER_ROLES.TENANT) {
    return { success: false, error: "You are not authorized to perform this action", statusCode: 403 };
  }

  try {
    const tenantIdResult = await getTenantId();

    if (!tenantIdResult || typeof tenantIdResult !== "string") {
      return { success: false, error: "Tenant not found", statusCode: 404 };
    }

    const branch = await db
      .select()
      .from(branches)
      .where(eq(branches.tenantId, tenantIdResult))
      .then((res) => res ?? []);

    return branch;
  } catch (error) {
    console.error(error);
    return { success: false, error: "An error occurred while fetching the tenant branches", statusCode: 500 };
  }
};

export const getBranchById = async (id: string): Promise<Branch |
{
  success: false;
  error: string;
  statusCode: number
}> => {

  try {
    const session = await auth();

    if (!session) {
      return { success: false, error: "No session found", statusCode: 401 };
    }
    if (session.user?.role !== USER_ROLES.TENANT) {
      return { success: false, error: "You are not authorized to perform this action", statusCode: 403 };
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
    return { success: false, error: "An error occurred while fetching the branch", statusCode: 500 };
  }
}


export const getEmployeeById = async (id: string): Promise<Employee | { success: false; error: string; statusCode: number }> => {
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
    return { success: false, error: "An error occurred while fetching the employee", statusCode: 500 };
  }
};


export const getManagerById = async (managerId: string,): Promise<DbUser | { success: false; error: string; statusCode: number; }> => {

  try {

    const manager = await db
      .select()
      .from(users)
      .where(eq(users.id, managerId))
      .then((res) => res[0] ?? null);

    if (!manager) {
      return { success: false, error: "Manager not found", statusCode: 404 };
    }

    return manager

  } catch (error) {
    console.error("Error in getManagerById:", error);
    return { success: false, error: "An error occurred while fetching the manager", statusCode: 500 };
  }

}