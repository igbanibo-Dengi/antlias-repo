"use server";

import { auth } from "@/auth";
import db from "@/database/drizzle";
import { branches, expenses, users } from "@/database/drizzle/schema";
import type { ActionResponse } from "@/types";
import type { ExpenseTableRow } from "@/types/general";
import { expenseFormSchema, type ExpenseFormValues } from "@/validators/expense-validator";
import { revalidatePaths } from "@/lib/revalidate-paths";
import { eq, desc, and } from "drizzle-orm";
import { USER_ROLES } from "@/lib/constants";
import { getTenantId } from "../tenant/tenant.action";

export async function createExpenseAction(
  values: ExpenseFormValues,
): Promise<ActionResponse<typeof expenses.$inferSelect>> {
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

  const validated = expenseFormSchema.safeParse(values);

  if (!validated.success) {
    return {
      success: false,
      error: "Invalid input data",
      statusCode: 400,
    };
  }

  const tenantId = await getTenantId();
  if (typeof tenantId !== "string") {
    return {
      success: false,
      error: "Tenant ID not found",
      statusCode: 404,
    };
  }

  const { branchId, expenseType, amount, description, receiptPhoto } = validated.data;

  const submittedById = session.user?.id;
  if (!submittedById) {
    return {
      success: false,
      error: "No user id on session",
      statusCode: 401,
    };
  }

  try {
    const newExpense = await db
      .insert(expenses)
      .values({
        tenantId,
        branchId,
        submittedById,
        expenseType,
        amount: amount.toString(),
        description,
        receiptPhoto: receiptPhoto || null,
      })
      .returning()
      .then((res) => res[0]);

    if (!newExpense) {
      return {
        success: false,
        error: "Failed to create expense",
        statusCode: 500,
      };
    }

    await revalidatePaths(["/tenant/expense"]);

    return {
      success: true,
      data: newExpense,
      statusCode: 201,
    };
  } catch (error) {
    console.error("Failed to create expense", error);
    return {
      success: false,
      error: "An error occurred while creating the expense",
      statusCode: 500,
    };
  }
}

export async function getExpensesAction(): Promise<ActionResponse<ExpenseTableRow[]>> {
  const session = await auth();


  if (!session) {
    return {
      success: false,
      error: "No session found",
      statusCode: 401,
    };
  }

  const tenantId = await getTenantId();

  if (typeof tenantId !== "string") {
    return {
      success: false,
      error: "Tenant ID not found",
      statusCode: 404,
    };
  }

  try {
    const results = await db
      .select({
        id: expenses.id,
        expenseType: expenses.expenseType,
        branchId: expenses.branchId,
        amount: expenses.amount,
        description: expenses.description,
        receiptPhoto: expenses.receiptPhoto,
        submittedOn: expenses.date,
        branchName: branches.name,
        submittedBy: users.name,
        submittedByEmail: users.email,
      })
      .from(expenses)
      .innerJoin(branches, eq(expenses.branchId, branches.id))
      .innerJoin(users, eq(expenses.submittedById, users.id))
      .where(eq(expenses.tenantId, tenantId))
      .orderBy(desc(expenses.date));

    const data: ExpenseTableRow[] = results.map((row) => ({
      id: row.id,
      expenseType: row.expenseType,
      branchId: row.branchId,
      amount: row.amount,
      description: row.description,
      receiptPhoto: row.receiptPhoto,
      branchName: row.branchName,
      submittedBy: row.submittedBy ?? row.submittedByEmail,
      submittedOn: (row.submittedOn ? new Date(row.submittedOn) : new Date()).toISOString(),
    }));

    return {
      success: true,
      data,
      statusCode: 200,
    };
  } catch (error) {
    console.error("Failed to fetch expenses", error);
    return {
      success: false,
      error: "An error occurred while fetching expenses",
      statusCode: 500,
    };
  }
}

export async function updateExpenseAction(
  expenseId: string,
  values: ExpenseFormValues,
): Promise<ActionResponse<typeof expenses.$inferSelect>> {
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

  const validated = expenseFormSchema.safeParse(values);

  if (!validated.success) {
    return {
      success: false,
      error: "Invalid input data",
      statusCode: 400,
    };
  }

  const tenantId = await getTenantId();
  if (typeof tenantId !== "string") {
    return {
      success: false,
      error: "Tenant ID not found",
      statusCode: 404,
    };
  }

  const { branchId, expenseType, amount, description, receiptPhoto } =
    validated.data;

  try {
    const updatedExpense = await db
      .update(expenses)
      .set({
        branchId,
        expenseType,
        amount: amount.toString(),
        description,
        receiptPhoto: receiptPhoto || null,
      })
      .where(and(eq(expenses.id, expenseId), eq(expenses.tenantId, tenantId)))
      .returning()
      .then((res) => res[0]);

    if (!updatedExpense) {
      return {
        success: false,
        error: "Expense not found",
        statusCode: 404,
      };
    }

    await revalidatePaths(["/tenant/expense"]);

    return {
      success: true,
      data: updatedExpense,
      statusCode: 200,
    };
  } catch (error) {
    console.error("Failed to update expense", error);
    return {
      success: false,
      error: "An error occurred while updating the expense",
      statusCode: 500,
    };
  }
}

export async function deleteExpenseAction(
  expenseId: string,
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

  const tenantId = await getTenantId();
  if (typeof tenantId !== "string") {
    return {
      success: false,
      error: "Tenant ID not found",
      statusCode: 404,
    };
  }

  try {
    const deletedExpense = await db
      .delete(expenses)
      .where(and(eq(expenses.id, expenseId), eq(expenses.tenantId, tenantId)))
      .returning({ id: expenses.id })
      .then((res) => res[0]);

    if (!deletedExpense) {
      return {
        success: false,
        error: "Expense not found",
        statusCode: 404,
      };
    }

    await revalidatePaths(["/tenant/expense"]);

    return {
      success: true,
      data: null,
      statusCode: 200,
    };
  } catch (error) {
    console.error("Failed to delete expense", error);
    return {
      success: false,
      error: "An error occurred while deleting the expense",
      statusCode: 500,
    };
  }
}
