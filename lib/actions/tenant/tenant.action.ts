"use server"

import { auth } from "@/auth"
import db from "@/database/drizzle"
import { branches, tenants, users } from "@/database/drizzle/schema"
import { USER_ROLES } from "@/lib/constants"
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