"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StationMediaUploadButton } from "@/components/uploadthing/StationMediaUploadButton";
import type { Branch, ActionResponse } from "@/types";
import {
  expenseFormSchema,
  expenseTypeOptions,
  type ExpenseFormValues,
} from "@/validators/expense-validator";
import { Trash2 } from "lucide-react";

interface ExpenseFormProps {
  branches: Branch[];
  onClose?: () => void;
  onSubmitAction: (
    values: ExpenseFormValues,
  ) => Promise<ActionResponse<unknown>>;
  mode?: "create" | "edit";
  initialValues?: Partial<ExpenseFormValues>;
  title?: string;
  description?: string;
  submitLabel?: string;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  branches,
  onClose,
  onSubmitAction,
  mode = "create",
  initialValues,
  title,
  description,
  submitLabel,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptUrl, setReceiptUrl] = useState<string | null>(
    initialValues?.receiptPhoto || null,
  );
  const [isUploading, setIsUploading] = useState(false);
  const [amountInput, setAmountInput] = useState(() =>
    initialValues?.amount ? `${initialValues.amount}` : "",
  );

  const formTitle =
    title ?? (mode === "edit" ? "Edit Expense" : "New Expense Form");
  const formDescription =
    description ??
    (mode === "edit"
      ? "Update the expense details and save your changes."
      : "Create new expense for approval");
  const buttonLabel =
    submitLabel ?? (mode === "edit" ? "Save changes" : "Submit");
  const successMessage =
    mode === "edit"
      ? "Expense updated successfully!"
      : "Expense submitted successfully!";

  const integerFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-NG", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }),
    [],
  );

  const formatAmountDisplay = useCallback(
    (rawValue: string) => {
      if (!rawValue) return "";
      const hasTrailingDecimal = rawValue.endsWith(".");
      const [integerPart = "", decimalPart = ""] = rawValue.split(".");
      const formattedInteger = integerFormatter.format(
        Number(integerPart || "0"),
      );

      if (hasTrailingDecimal) {
        return `₦${formattedInteger}.`;
      }

      if (decimalPart) {
        return `₦${formattedInteger}.${decimalPart}`;
      }

      return `₦${formattedInteger}`;
    },
    [integerFormatter],
  );

  const amountDisplay = amountInput ? formatAmountDisplay(amountInput) : "";

  const resolvedDefaults: ExpenseFormValues = {
    branchId: initialValues?.branchId ?? branches[0]?.id ?? "",
    amount: initialValues?.amount ?? 0,
    description: initialValues?.description ?? "",
    expenseType:
      (initialValues?.expenseType as ExpenseFormValues["expenseType"]) ??
      (undefined as unknown as ExpenseFormValues["expenseType"]),
    receiptPhoto: initialValues?.receiptPhoto ?? "",
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: resolvedDefaults,
  });

  const selectedBranch = watch("branchId");
  const selectedCategory = watch("expenseType");

  useEffect(() => {
    if (branches.length && !selectedBranch) {
      setValue("branchId", branches[0].id);
    }
  }, [branches, selectedBranch, setValue]);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const cleaned = rawValue.replace(/[^0-9.]/g, "");

    if (!cleaned) {
      setAmountInput("");
      setValue("amount", 0, { shouldValidate: true, shouldDirty: true });
      return;
    }

    const firstDotIndex = cleaned.indexOf(".");
    const hasDecimal = firstDotIndex !== -1;
    const endsWithDot = cleaned.endsWith(".");
    const integerPartRaw = hasDecimal
      ? cleaned.slice(0, firstDotIndex)
      : cleaned;
    const remainder = hasDecimal ? cleaned.slice(firstDotIndex + 1) : "";
    const decimalPartRaw = remainder.replace(/\./g, "");
    const limitedDecimals = decimalPartRaw.slice(0, 2);

    const normalizeIntegerPart = (value: string) => {
      if (!value) {
        return hasDecimal ? "0" : "";
      }
      const trimmed = value.replace(/^0+(?=\d)/, "");
      return trimmed === "" ? "0" : trimmed;
    };

    const normalizedInteger = normalizeIntegerPart(integerPartRaw);
    let nextRaw = normalizedInteger;

    if (hasDecimal) {
      if (endsWithDot && !limitedDecimals.length) {
        nextRaw = `${normalizedInteger || "0"}.`;
      } else if (limitedDecimals.length) {
        nextRaw = `${normalizedInteger || "0"}.${limitedDecimals}`;
      } else {
        nextRaw = normalizedInteger || "0";
      }
    }

    setAmountInput(nextRaw);

    const numericString =
      nextRaw && nextRaw.endsWith(".") ? nextRaw.slice(0, -1) : nextRaw;

    const numericValue =
      numericString && !Number.isNaN(Number(numericString))
        ? Number(numericString)
        : 0;

    setValue("amount", numericValue, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleUploadComplete = (url: string) => {
    setReceiptUrl(url);
    setValue("receiptPhoto", url, {
      shouldValidate: true,
      shouldDirty: true,
    });
    toast.success("Receipt uploaded successfully");
    setIsUploading(false);
  };

  const handleUploadError = (error: Error) => {
    toast.error(error.message || "Failed to upload receipt");
    setIsUploading(false);
  };

  const handleRemoveReceipt = () => {
    setReceiptUrl(null);
    setValue("receiptPhoto", "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleUploadProgress = (progress: number) => {
    if (progress === 0) {
      setIsUploading(true);
    } else if (progress >= 100) {
      setIsUploading(false);
    } else {
      setIsUploading(true);
    }
  };

  const onSubmit = async (data: ExpenseFormValues) => {
    setIsSubmitting(true);
    try {
      const payload: ExpenseFormValues = {
        ...data,
        receiptPhoto: receiptUrl ?? "",
      };

      const result = await onSubmitAction(payload);

      if (!result.success) {
        toast.error(result.error ?? "Failed to submit expense");
        return;
      }

      toast.success(successMessage);
      if (mode === "create") {
        reset({
          branchId: branches[0]?.id ?? "",
          expenseType: undefined as unknown as ExpenseFormValues["expenseType"],
          amount: 0,
          description: "",
          receiptPhoto: "",
        });
        setReceiptUrl(null);
        setAmountInput("");
      } else {
        reset(payload);
        setReceiptUrl(payload.receiptPhoto || null);
        setAmountInput(payload.amount ? `${payload.amount}` : "");
      }
      onClose?.();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit expense. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="ml-2 h-[90vh] w-full overflow-y-auto border-none pb-10 shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <h2 className="text-lg font-medium">{formTitle}</h2>
          <p className="text-sm text-muted-foreground">{formDescription}</p>
        </div>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 overflow-auto px-1"
        >
          <div className="space-y-2">
            <Label htmlFor="branch">Branch</Label>
            <Select
              value={selectedBranch || undefined}
              onValueChange={(value) =>
                setValue("branchId", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
              disabled={!branches.length}
            >
              <SelectTrigger id="branch" className="w-full">
                <SelectValue placeholder="Select a branch" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch.id} value={branch.id}>
                    {branch.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.branchId && (
              <p className="text-sm text-red-500">{errors.branchId.message}</p>
            )}
            {!branches.length && (
              <p className="text-sm text-muted-foreground">
                You need at least one branch before submitting an expense.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="expenseType">Category</Label>
            <Select
              value={selectedCategory || undefined}
              onValueChange={(value) =>
                setValue(
                  "expenseType",
                  value as ExpenseFormValues["expenseType"],
                  {
                    shouldDirty: true,
                    shouldValidate: true,
                  },
                )
              }
            >
              <SelectTrigger id="expenseType" className="w-full">
                <SelectValue placeholder="Please Select" />
              </SelectTrigger>
              <SelectContent>
                {expenseTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.expenseType && (
              <p className="text-sm text-red-500">
                {errors.expenseType.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              placeholder="₦0.00"
              value={amountDisplay}
              onChange={handleAmountChange}
              inputMode="decimal"
              autoComplete="off"
            />
            {errors.amount && (
              <p className="text-sm text-red-500">{errors.amount.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe this expense"
              className="min-h-[120px] resize-none"
              maxLength={2000}
            />
            {errors.description && (
              <p className="text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Upload evidence</Label>
            <div className="rounded-lg border border-dashed p-4">
              {receiptUrl ? (
                <div className="mb-3 flex items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-sm">
                  <span className="truncate">{receiptUrl}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveReceipt}
                    aria-label="Remove uploaded file"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <p className="mb-3 text-sm text-muted-foreground">
                  Upload a JPG, JPEG, PNG, GIF or WEBP image (max 8MB)
                </p>
              )}
              <StationMediaUploadButton
                onCompleted={handleUploadComplete}
                onError={handleUploadError}
                onProgress={handleUploadProgress}
              />
            </div>
            {errors.receiptPhoto && (
              <p className="text-sm text-red-500">
                {errors.receiptPhoto.message}
              </p>
            )}
          </div>

          <Button
            className="w-full"
            size="lg"
            type="submit"
            disabled={
              isSubmitting ||
              !branches.length ||
              !receiptUrl ||
              isUploading ||
              (mode === "edit" && !isDirty)
            }
          >
            {isSubmitting ? "Processing..." : buttonLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ExpenseForm;
