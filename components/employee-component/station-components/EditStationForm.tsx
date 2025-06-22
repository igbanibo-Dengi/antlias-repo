"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Info, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteBranch, transferAllEmployeesToBranch, editBranch } from "@/lib/actions/tenant/tenant.action";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import AssignManagerForm from "./AssigngManagerForm";
import { Branch, EditBranchFormValues } from "@/types";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EditStationSchema } from "@/validators/branch-validator";
import { useRouter } from "next/navigation";

export type EditStationFormProps = {
  stationId: string;
  stationName?: string;
  stationPhone: string | null;
  stationAddress?: string;
  stationCity?: string;
  stationState?: string;
  stationManagerId?: string | null;
  stationManagerName?: string | null;
  isHeadQuarters?: boolean | null;
  isActive?: boolean | null;
  createdAt?: Date | null;
  onManagerAssigned?: () => void;
  branches: Branch[] | undefined
};

const EditStationForm = ({
  stationId,
  stationName,
  stationPhone,
  stationAddress,
  stationCity,
  stationState,
  stationManagerId,
  stationManagerName,
  isHeadQuarters,
  isActive,
  createdAt,
  onManagerAssigned,
  branches,
}: EditStationFormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [isDeleting, setDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [transferBranchId, setTransferBranchId] = useState<string>("");
  const router = useRouter();

  const form = useForm<z.infer<typeof EditStationSchema>>({
    resolver: zodResolver(EditStationSchema),
    defaultValues: {
      branchName: stationName,
      contactPhone: stationPhone ?? undefined,
      address: stationAddress,
      city: stationCity,
      state: stationState,
      isHQ: isHeadQuarters ?? false,
      active: isActive ?? true,
    },
  });

  // Reset edit mode when dialog closes
  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setEditMode(false);
    }
    setDialogOpen(open);
  };

  const handleSubmit = async (values: EditBranchFormValues) => {
    try {
      setSubmitting(true);

      const response = await editBranch(stationId, values);

      if (response?.success) {
        toast.success("Station updated successfully");
        setEditMode(false);
      } else {
        toast.error(response?.error || "Failed to update station");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error updating station:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBranch = async () => {
    try {
      setDeleting(true);

      // If a transfer branch is selected, transfer employees first
      if (transferBranchId) {
        const transferRes = await transferAllEmployeesToBranch(stationId, transferBranchId);
        if (!transferRes.success) {
          toast.error(transferRes.error || "Failed to transfer employees");
          setDeleting(false);
          return;
        }
      }

      const response = await deleteBranch(stationId);

      if (response?.success) {
        toast.success("Station deleted successfully");
        setDialogOpen(false);
        setEditMode(false);
        router.refresh();
      } else {
        toast.error(response?.error || "Failed to delete station");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error deleting station:", error);
    } finally {
      setDeleting(false);
    }
  };

  const isFormDisabled = isLoading || submitting || !editMode;

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="p-1">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Edit Station</DialogTitle>
          <DialogDescription>
            Update the station details below. All fields marked with an asterisk
            (*) are required.
          </DialogDescription>
        </DialogHeader>
        <Card className="w-full border-none p-0 shadow-none">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Edit Station</CardTitle>
              <CardDescription>
                Update the station information below
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={editMode ? "text-primary" : "text-muted-foreground"}
              >
                Edit Mode
              </div>
              <Switch
                id="edit-mode"
                checked={editMode}
                onCheckedChange={setEditMode}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <div className="grid-cols- grid gap-6">
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="branchName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Station Name*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter station name"
                              disabled={isFormDisabled}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Station Phone</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter phone number"
                              disabled={isFormDisabled}
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter station address"
                            disabled={isFormDisabled}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter city"
                              disabled={isFormDisabled}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State*</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter state"
                              disabled={isFormDisabled}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <div>Station Manager</div>
                    <div className="flex items-center gap-2">
                      <Input
                        value={stationManagerName || "No manager assigned"}
                        disabled
                        className="bg-muted"
                      />
                      <AssignManagerForm
                        stationId={stationId}
                        currentManagerId={stationManagerId}
                        onManagerAssigned={onManagerAssigned}
                        bigButton={true}
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-2">
                    <FormField
                      control={form.control}
                      name="isHQ"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Headquarters
                            </FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Mark this station as headquarters
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isFormDisabled}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Active</FormLabel>
                            <p className="text-sm text-muted-foreground">
                              Station is currently active and operational
                            </p>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isFormDisabled}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        disabled={submitting}
                      >
                        Delete Station
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <p className="text-sm text-muted-foreground">
                          This action cannot be undone. This will permanently
                          delete this station and all employee data.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Optionally you can transfer all employees to another station before deleting the station.
                        </p>
                        <div className="mt-4">
                          <label htmlFor="transfer-branch" className="block text-sm font-medium text-gray-700">
                            Transfer employees to:
                          </label>
                          <select
                            id="transfer-branch"
                            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            value={transferBranchId}
                            onChange={e => setTransferBranchId(e.target.value)}
                          >
                            <option value="">-- Select branch --</option>
                            {(branches ?? [])
                              .filter(branch => branch.id !== stationId)
                              .map(branch => (
                                <option key={branch.id} value={branch.id}>
                                  {branch.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                          <Button variant="outline" disabled={isDeleting}>
                            Cancel
                          </Button>
                        </AlertDialogCancel>
                        <Button
                          variant="destructive"
                          onClick={handleDeleteBranch}
                          disabled={isDeleting}
                        >
                          {isDeleting
                            ? transferBranchId
                              ? "Transferring and Deleting..."
                              : "Deleting..."
                            : transferBranchId
                              ? "Transfer Employees & Delete"
                              : "Delete Station and all data"}
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  {editMode && (
                    <div className="flex justify-end gap-4 pt-4">
                      <DialogClose asChild>
                        <Button type="button" variant="outline" disabled={submitting}>
                          Cancel
                        </Button>
                      </DialogClose>
                      <Button type="submit" disabled={isFormDisabled}>
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default EditStationForm;