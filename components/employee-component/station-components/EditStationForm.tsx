"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Info,
  Loader2,
  MapPin,
  Building2,
  User,
  Settings,
  Trash2,
  Edit3,
  Phone,
  Calendar,
  Crown,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import AssignManagerForm from "./AssigngManagerForm"
import { deleteBranch, editBranch, transferAllEmployeesToBranch } from "@/lib/actions/tenant/tenant.action"
import { Branch, EditBranchFormValues } from "@/types"
import { EditStationSchema } from "@/validators/branch-validator"

type EditStationFormValues = z.infer<typeof EditStationSchema>

export interface EditStationFormProps {
  stationId: string
  stationName?: string
  stationPhone: string | null
  stationAddress?: string
  stationCity?: string
  stationState?: string
  stationManagerId?: string | null
  stationManagerName?: string | null
  isHeadQuarters?: boolean | null
  isActive?: boolean | null
  createdAt?: Date | null
  onManagerAssigned?: () => void
  branches: Branch[] | undefined
}

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
  const [submitting, setSubmitting] = useState(false)
  const [isDeleting, setDeleting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [transferBranchId, setTransferBranchId] = useState<string>("")
  const router = useRouter()

  const form = useForm<EditStationFormValues>({
    resolver: zodResolver(EditStationSchema),
    defaultValues: {
      branchName: stationName || "",
      contactPhone: stationPhone || "",
      address: stationAddress || "",
      city: stationCity || "",
      state: stationState || "",
      isHQ: isHeadQuarters ?? false,
      active: isActive ?? true,
    },
  })

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setEditMode(false)
      form.reset()
    }
    setDialogOpen(open)
  }

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
        const transferRes = await transferAllEmployeesToBranch(
          stationId,
          transferBranchId,
        );

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

  const isFormDisabled = submitting || !editMode

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="p-1">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                Station Details
              </DialogTitle>
              <DialogDescription>View and manage station information and settings</DialogDescription>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-xs text-muted-foreground">Enable edit mode to modify fields</p>
              <div className="flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                <span className="text-sm font-medium">Edit Mode</span>
                <Switch checked={editMode} onCheckedChange={setEditMode} disabled={submitting} />
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Station Status Badges */}
          <div className="flex items-center gap-2">
            <Badge variant={isActive ? "default" : "secondary"} className="flex items-center gap-1">
              {isActive ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
              {isActive ? "Active" : "Inactive"}
            </Badge>
            {isHeadQuarters && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Crown className="h-3 w-3" />
                Headquarters
              </Badge>
            )}
            {createdAt && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Created {new Date(createdAt).toLocaleDateString()}
              </Badge>
            )}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                </div>
                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="branchName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Station Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter station name" disabled={isFormDisabled} {...field} />
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
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Enter phone number"
                              disabled={isFormDisabled}
                              className="pl-10"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Location Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Location Information</h3>
                </div>
                <Separator />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter complete street address"
                          disabled={isFormDisabled}
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter city" disabled={isFormDisabled} {...field} />
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
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter state" disabled={isFormDisabled} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Management Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Management</h3>
                </div>
                <Separator />

                <div className="space-y-4">
                  <div>
                    <label>Station Manager</label>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex-1">
                        <Input value={stationManagerName || "No manager assigned"} disabled className="bg-muted" />
                      </div>
                      <AssignManagerForm
                        stationId={stationId}
                        currentManagerId={stationManagerId}
                        onManagerAssigned={onManagerAssigned}
                        bigButton={true}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Assign a manager to oversee this station&apos;s operations
                    </p>
                  </div>
                </div>
              </div>

              {/* Settings Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  <h3 className="text-lg font-semibold">Station Settings</h3>
                </div>
                <Separator />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="isHQ"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <Crown className="h-4 w-4 text-amber-500" />
                            <FormLabel className="text-base font-medium">Headquarters Status</FormLabel>
                          </div>
                          <FormDescription>Mark this station as the main headquarters location</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isFormDisabled} />
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
                          <div className="flex items-center gap-2">
                            {field.value ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500" />
                            )}
                            <FormLabel className="text-base font-medium">Active Status</FormLabel>
                          </div>
                          <FormDescription>Station is currently operational and accepting business</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isFormDisabled} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" disabled={submitting} className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Delete Station
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="flex items-center gap-2">
                        <Trash2 className="h-5 w-5 text-destructive" />
                        Delete Station
                      </AlertDialogTitle>
                      <AlertDialogDescription className="space-y-3">
                        <span>
                          This action cannot be undone. This will permanently delete this station and all associated
                          data.
                        </span>
                        <span className="font-medium">
                          You can optionally transfer all employees to another station before deletion.
                        </span>
                      </AlertDialogDescription>
                    </AlertDialogHeader>

                    <div className="my-4">
                      <FormLabel htmlFor="transfer-branch" className="text-sm font-medium">
                        Transfer employees to (optional):
                      </FormLabel>
                      <Select value={transferBranchId} onValueChange={setTransferBranchId}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select a station to transfer employees" />
                        </SelectTrigger>
                        <SelectContent>
                          {(branches ?? [])
                            .filter((branch) => branch.id !== stationId)
                            .map((branch) => (
                              <SelectItem key={branch.id} value={branch.id}>
                                <div className="flex items-center gap-2">
                                  <Building2 className="h-4 w-4" />
                                  <span>{branch.name}</span>
                                  {branch.city && branch.state && (
                                    <span className="text-muted-foreground">
                                      - {branch.city}, {branch.state}
                                    </span>
                                  )}
                                </div>
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                      <Button variant="destructive" onClick={handleDeleteBranch} disabled={isDeleting}>
                        {isDeleting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {transferBranchId ? "Transferring & Deleting..." : "Deleting..."}
                          </>
                        ) : (
                          <>
                            <Trash2 className="mr-2 h-4 w-4" />
                            {transferBranchId ? "Transfer & Delete" : "Delete Station"}
                          </>
                        )}
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {editMode && (
                  <div className="flex gap-3">
                    <DialogClose asChild>
                      <Button type="button" variant="outline" disabled={submitting}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button type="submit" disabled={submitting}>
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default EditStationForm
