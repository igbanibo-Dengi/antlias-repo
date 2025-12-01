"use client";

import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import type { Branch, Employee, ActionResponse } from "@/types";
import type { TransactionTableRow } from "@/types/general";
import {
  transactionFormSchema,
  type TransactionFormValues,
  fuelTypeOptions,
} from "@/validators/transaction-validator";

interface TransactionFormModalProps {
  branches: Branch[];
  employees: Employee[];
  onClose?: () => void;
  onSubmitAction: (
    values: TransactionFormValues,
  ) => Promise<ActionResponse<unknown>>;
  initialTransaction?: TransactionTableRow | null;
  mode?: "create" | "edit";
  onSuccess?: () => void | Promise<void>;
  showHeader?: boolean;
  title?: string;
  description?: string;
  readOnly?: boolean;
  renderActions?: (args: {
    handleSubmit: () => void;
    disableSubmit: boolean;
    isSubmitting: boolean;
    isReadOnly: boolean;
  }) => React.ReactNode;
}

const formatCurrencyValue = (value: number | string) => {
  if (value === undefined || value === null) return "";
  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return "";
  return new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numericValue);
};

const parseCurrencyInput = (input: string) => {
  const cleaned = input.replace(/[^0-9.]/g, "");
  if (!cleaned) return 0;
  const numericValue = Number(cleaned);
  return Number.isNaN(numericValue) ? 0 : numericValue;
};

const toTimeInput = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const hours = `${date.getHours()}`.padStart(2, "0");
  const minutes = `${date.getMinutes()}`.padStart(2, "0");
  return `${hours}:${minutes}`;
};

const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  branches,
  employees,
  onClose,
  onSubmitAction,
  initialTransaction = null,
  mode = "create",
  onSuccess,
  showHeader = true,
  title,
  description,
  readOnly = false,
  renderActions,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = mode === "edit" && Boolean(initialTransaction);
  const isReadOnly = readOnly;

  const getDefaultEmployeeId = useCallback(
    (branchId: string) => {
      if (!branchId) return "";
      const employeeForBranch = employees.find(
        (employee) =>
          employee.branchId === branchId && Boolean(employee.userId),
      );
      return employeeForBranch?.userId ?? "";
    },
    [employees],
  );

  const initialValues = useMemo<TransactionFormValues>(() => {
    if (initialTransaction) {
      return {
        branchId: initialTransaction.branchId,
        employeeId: initialTransaction.employeeId,
        fuelType:
          initialTransaction.fuelType as TransactionFormValues["fuelType"],
        totalAmount: Number(initialTransaction.totalAmount ?? 0),
        cashAmount: Number(initialTransaction.cash ?? 0),
        transferAmount: Number(initialTransaction.transfer ?? 0),
        cardAmount: Number(initialTransaction.card ?? 0),
        litersSold: Number(initialTransaction.quantity ?? 0),
        startTime: toTimeInput(initialTransaction.startTime),
        endTime: toTimeInput(initialTransaction.endTime),
      };
    }

    const defaultBranchId = branches[0]?.id ?? "";
    const defaultEmployeeId = getDefaultEmployeeId(defaultBranchId);

    return {
      branchId: defaultBranchId,
      employeeId: defaultEmployeeId,
      fuelType: undefined as unknown as TransactionFormValues["fuelType"],
      totalAmount: 0,
      cashAmount: 0,
      transferAmount: 0,
      cardAmount: 0,
      litersSold: 0,
      startTime: "",
      endTime: "",
    };
  }, [branches, getDefaultEmployeeId, initialTransaction]);

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: initialValues,
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  const selectedBranchId = form.watch("branchId");

  const employeeOptions = useMemo(() => {
    if (!selectedBranchId) return [];
    return employees
      .filter(
        (employee): employee is Employee & { userId: string } =>
          Boolean(employee.userId) && employee.branchId === selectedBranchId,
      )
      .map((employee) => ({
        id: employee.userId,
        label: `${employee.firstName} ${employee.lastName}`.trim(),
      }));
  }, [employees, selectedBranchId]);

  useEffect(() => {
    if (!selectedBranchId) {
      form.setValue("employeeId", "");
      return;
    }

    const currentEmployeeId = form.getValues("employeeId");
    const hasCurrentEmployee = employeeOptions.some(
      (employee) => employee.id === currentEmployeeId,
    );

    if (!hasCurrentEmployee) {
      const fallbackEmployeeId =
        employeeOptions[0]?.id ?? getDefaultEmployeeId(selectedBranchId);
      form.setValue("employeeId", fallbackEmployeeId);
    }
  }, [employeeOptions, form, getDefaultEmployeeId, selectedBranchId]);

  const totalAmountValue = Number(form.watch("totalAmount") || 0);
  const cashAmountValue = Number(form.watch("cashAmount") || 0);
  const transferAmountValue = Number(form.watch("transferAmount") || 0);
  const cardAmountValue = Number(form.watch("cardAmount") || 0);
  const paymentBreakdownSum =
    cashAmountValue + transferAmountValue + cardAmountValue;
  const paymentDifference = paymentBreakdownSum - totalAmountValue;
  const paymentsBalanced = Math.abs(paymentDifference) <= 0.01;

  const onSubmit = async (values: TransactionFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await onSubmitAction(values);
      if (!result.success) {
        toast.error(result.error ?? "Failed to submit transaction");
        return;
      }
      toast.success(
        isEditMode
          ? "Transaction updated successfully!"
          : "Transaction submitted successfully!",
      );
      if (!isEditMode) {
        form.reset(initialValues);
      }
      await onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit transaction. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrencyField = useCallback(
    (field: {
      value: number;
      onChange: (value: number) => void;
      onBlur: () => void;
    }) => (
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          ₦
        </span>
        <Input
          type="text"
          inputMode="decimal"
          placeholder="0.00"
          className="pl-8 text-right"
          value={formatCurrencyValue(field.value)}
          onChange={(event) =>
            field.onChange(parseCurrencyInput(event.target.value))
          }
          onBlur={field.onBlur}
          disabled={isReadOnly}
        />
      </div>
    ),
    [isReadOnly],
  );

  const disableSubmit =
    isSubmitting ||
    isReadOnly ||
    !branches.length ||
    !employeeOptions.length ||
    (isEditMode && !form.formState.isDirty);

  const formSubmitHandler = form.handleSubmit(onSubmit);

  const headingTitle =
    title ?? (isEditMode ? "Edit Transaction" : "Record Transaction");
  const headingDescription =
    description ??
    "Log daily sales with a clear payment breakdown to keep your remittances balanced.";

  return (
    <div className="h-[90vh] overflow-y-auto py-4 2xl:h-fit">
      {showHeader ? (
        <div className="mb-6 space-y-2">
          <h2 className="text-xl font-semibold">{headingTitle}</h2>
          <p className="text-sm text-muted-foreground">{headingDescription}</p>
        </div>
      ) : null}

      <Form {...form}>
        <form onSubmit={formSubmitHandler} className="space-y-6">
          <section className="space-y-4 rounded-lg border bg-muted/30 p-4">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Assignment
              </p>
              <p className="text-sm text-muted-foreground">
                Choose the branch and attendant responsible for this sale.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="branchId"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Branch</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isReadOnly || !branches.length}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {branches.map((branch) => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="employeeId"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Attendant</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ?? ""}
                      disabled={isReadOnly || !employeeOptions.length}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select attendant" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employeeOptions.length ? (
                          employeeOptions.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.label || "Unnamed"}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="" disabled>
                            No attendants for this branch
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="space-y-4 rounded-lg border bg-muted/30 p-4">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Sales Details
              </p>
              <p className="text-sm text-muted-foreground">
                Capture fuel type, volume sold, and the total revenue for the
                period.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="fuelType"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Fuel Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isReadOnly}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select fuel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fuelTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="litersSold"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Liters Sold</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        disabled={isReadOnly}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalAmount"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Total Amount</FormLabel>
                    <FormControl>{renderCurrencyField(field)}</FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          <section className="space-y-4 rounded-lg border bg-muted/30 p-4">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Payment Breakdown
              </p>
              <p className="text-sm text-muted-foreground">
                Ensure the sum of each channel equals the total remitted amount.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              <FormField
                control={form.control}
                name="cashAmount"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Cash Received</FormLabel>
                    <FormControl>{renderCurrencyField(field)}</FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="transferAmount"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Bank Transfer</FormLabel>
                    <FormControl>{renderCurrencyField(field)}</FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cardAmount"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>POS / Card</FormLabel>
                    <FormControl>{renderCurrencyField(field)}</FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <p
              className={`text-sm ${paymentsBalanced ? "text-muted-foreground" : "text-destructive"}`}
            >
              {paymentsBalanced
                ? `Breakdown equals total (₦${formatCurrencyValue(paymentBreakdownSum)})`
                : `Breakdown is off by ₦${formatCurrencyValue(Math.abs(paymentDifference))}.`}
            </p>
          </section>

          <section className="space-y-4 rounded-lg border bg-muted/30 p-4">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Shift Timing
              </p>
              <p className="text-sm text-muted-foreground">
                Record the start and end time that this transaction batch
                covers.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        placeholder="00:00"
                        disabled={isReadOnly}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input
                        type="time"
                        placeholder="00:00"
                        disabled={isReadOnly}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </section>

          {renderActions ? (
            renderActions({
              handleSubmit: formSubmitHandler,
              disableSubmit,
              isSubmitting,
              isReadOnly,
            })
          ) : (
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              disabled={disableSubmit}
            >
              {isSubmitting
                ? "Submitting..."
                : isEditMode
                  ? "Save Changes"
                  : "Submit"}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default TransactionFormModal;
