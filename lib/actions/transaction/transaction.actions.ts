"use server";

import { auth } from "@/auth";
import db from "@/database/drizzle";
import { branches, transactions, users } from "@/database/drizzle/schema";
import type { ActionResponse } from "@/types";
import type { TransactionTableRow } from "@/types/general";
import {
  transactionFormSchema,
  type TransactionFormValues,
} from "@/validators/transaction-validator";
import { revalidatePaths } from "@/lib/revalidate-paths";
import { USER_ROLES } from "@/lib/constants";
import { and, desc, eq } from "drizzle-orm";
import { getTenantId } from "../tenant/tenant.action";

const convertTimeToDate = (timeValue: string) => {
  const [hours = "0", minutes = "0"] = timeValue.split(":");
  const baseDate = new Date();
  baseDate.setSeconds(0, 0);
  baseDate.setHours(Number(hours) || 0, Number(minutes) || 0);
  return baseDate;
};

export async function createTransactionAction(
  values: TransactionFormValues,
): Promise<ActionResponse<typeof transactions.$inferSelect>> {
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

  const validated = transactionFormSchema.safeParse(values);

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

  const {
    branchId,
    employeeId,
    fuelType,
    totalAmount,
    cashAmount,
    transferAmount,
    cardAmount,
    litersSold,
    startTime,
    endTime,
  } = validated.data;

  const quantity = litersSold;
  const computedUnitPrice = quantity > 0 ? totalAmount / quantity : totalAmount;

  const payload = {
    tenantId,
    branchId,
    employeeId,
    fuelType,
    quantity: quantity.toString(),
    unitPrice: computedUnitPrice.toString(),
    cash: cashAmount.toString(),
    card: cardAmount.toString(),
    transfer: transferAmount.toString(),
    totalAmount: totalAmount.toString(),
    startTime: convertTimeToDate(startTime),
    endTime: convertTimeToDate(endTime),
  };

  try {
    const newTransaction = await db
      .insert(transactions)
      .values(payload)
      .returning()
      .then((res) => res[0]);

    if (!newTransaction) {
      return {
        success: false,
        error: "Failed to create transaction",
        statusCode: 500,
      };
    }

    await revalidatePaths(["/tenant/transactions"]);

    return {
      success: true,
      data: newTransaction,
      statusCode: 201,
    };
  } catch (error) {
    console.error("Failed to create transaction", error);
    return {
      success: false,
      error: "An error occurred while creating the transaction",
      statusCode: 500,
    };
  }
}

export async function updateTransactionAction(
  transactionId: string,
  values: TransactionFormValues,
): Promise<ActionResponse<typeof transactions.$inferSelect>> {
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

  const validated = transactionFormSchema.safeParse(values);

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

  const {
    branchId,
    employeeId,
    fuelType,
    totalAmount,
    cashAmount,
    transferAmount,
    cardAmount,
    litersSold,
    startTime,
    endTime,
  } = validated.data;

  const quantity = litersSold;
  const computedUnitPrice = quantity > 0 ? totalAmount / quantity : totalAmount;

  try {
    const updatedTransaction = await db
      .update(transactions)
      .set({
        branchId,
        employeeId,
        fuelType,
        quantity: quantity.toString(),
        unitPrice: computedUnitPrice.toString(),
        cash: cashAmount.toString(),
        card: cardAmount.toString(),
        transfer: transferAmount.toString(),
        totalAmount: totalAmount.toString(),
        startTime: convertTimeToDate(startTime),
        endTime: convertTimeToDate(endTime),
      })
      .where(
        and(eq(transactions.id, transactionId), eq(transactions.tenantId, tenantId)),
      )
      .returning()
      .then((res) => res[0]);

    if (!updatedTransaction) {
      return {
        success: false,
        error: "Transaction not found",
        statusCode: 404,
      };
    }

    await revalidatePaths(["/tenant/transactions"]);

    return {
      success: true,
      data: updatedTransaction,
      statusCode: 200,
    };
  } catch (error) {
    console.error("Failed to update transaction", error);
    return {
      success: false,
      error: "An error occurred while updating the transaction",
      statusCode: 500,
    };
  }
}

export async function deleteTransactionAction(
  transactionId: string,
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
    const deletedTransaction = await db
      .delete(transactions)
      .where(
        and(eq(transactions.id, transactionId), eq(transactions.tenantId, tenantId)),
      )
      .returning({ id: transactions.id })
      .then((res) => res[0]);

    if (!deletedTransaction) {
      return {
        success: false,
        error: "Transaction not found",
        statusCode: 404,
      };
    }

    await revalidatePaths(["/tenant/transactions"]);

    return {
      success: true,
      data: null,
      statusCode: 200,
    };
  } catch (error) {
    console.error("Failed to delete transaction", error);
    return {
      success: false,
      error: "An error occurred while deleting the transaction",
      statusCode: 500,
    };
  }
}

export async function getTransactionsAction(
  branchId?: string,
): Promise<ActionResponse<TransactionTableRow[]>> {
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
    const filters = [eq(transactions.tenantId, tenantId)];
    if (branchId) {
      filters.push(eq(transactions.branchId, branchId));
    }

    const whereClause = filters.length > 1 ? and(...filters) : filters[0];

    const rows = await db
      .select({
        id: transactions.id,
        branchId: transactions.branchId,
        branchName: branches.name,
        employeeId: transactions.employeeId,
        employeeName: users.name,
        fuelType: transactions.fuelType,
        quantity: transactions.quantity,
        unitPrice: transactions.unitPrice,
        cash: transactions.cash,
        card: transactions.card,
        transfer: transactions.transfer,
        totalAmount: transactions.totalAmount,
        startTime: transactions.startTime,
        endTime: transactions.endTime,
        createdAt: transactions.createdAt,
      })
      .from(transactions)
      .innerJoin(branches, eq(transactions.branchId, branches.id))
      .innerJoin(users, eq(transactions.employeeId, users.id))
      .where(whereClause)
      .orderBy(desc(transactions.createdAt));

    const data: TransactionTableRow[] = rows.map((row) => ({
      id: row.id,
      branchId: row.branchId,
      branchName: row.branchName ?? "",
      employeeId: row.employeeId,
      employeeName: row.employeeName,
      fuelType: row.fuelType,
      quantity: row.quantity ?? "0",
      unitPrice: row.unitPrice ?? "0",
      cash: row.cash ?? "0",
      card: row.card ?? "0",
      transfer: row.transfer ?? "0",
      totalAmount: row.totalAmount ?? "0",
      startTime: row.startTime?.toISOString() ?? "",
      endTime: row.endTime?.toISOString() ?? "",
      createdAt: row.createdAt?.toISOString() ?? "",
    }));

    return {
      success: true,
      data,
      statusCode: 200,
    };
  } catch (error) {
    console.error("Failed to fetch transactions", error);
    return {
      success: false,
      error: "An error occurred while fetching transactions",
      statusCode: 500,
    };
  }
}
