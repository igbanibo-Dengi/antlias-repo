"use client"

import { useState, useEffect, useCallback } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
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
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Loader2, Info, User, Briefcase, CreditCard, Shield, Edit3, Trash2 } from "lucide-react"
import { editEmployeeFormSchema, type EditEmployeeFormValues } from "@/validators/employee-form-validator"

interface Employee {
  id: string
  address: string | null
  salary: number | null
  createdAt: Date | null
  tenantId: string
  isActive: boolean | null
  userId: string
  branchId: string
  firstName: string
  lastName: string
  contactNumber: string | null
  email: string | null
  hireDate: string | null
  position: string | null
  commission: string | null
  bankName: string | null
  accountNumber: string | null
  accountName: string | null
  bvn: string | null
  guarantorName: string | null
  guarantorPhone: string | null
  guarantorAddress: string | null
  guarantorRelationship: string | null
}

interface OptimizedEditEmployeeDialogProps {
  employee: Employee
  onEmployeeUpdated?: (id: string, values: EditEmployeeFormValues) => Promise<any>
  onEmployeeDeleted?: (id: string) => Promise<any>
}

export function OptimizedEditEmployeeDialog({
  employee,
  onEmployeeUpdated,
  onEmployeeDeleted,
}: OptimizedEditEmployeeDialogProps) {
  const [editMode, setEditMode] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const isFormDisabled = submitting || !editMode

  const getDefaultValues = useCallback(
    (emp: Employee): EditEmployeeFormValues => ({
      branchId: emp.branchId,
      firstName: emp.firstName,
      lastName: emp.lastName,
      contactNumber: emp.contactNumber ?? "",
      email: emp.email ?? "",
      address: emp.address ?? "",
      position: emp.position ?? "",
      salary: emp.salary ?? 0,
      accountNumber: emp.accountNumber ?? "",
      accountName: emp.accountName ?? "",
      bankName: emp.bankName ?? "",
      bvn: emp.bvn ?? "",
      guarantorName: emp.guarantorName ?? "",
      guarantorPhone: emp.guarantorPhone ?? "",
      guarantorAddress: emp.guarantorAddress ?? "",
      guarantorRelationship: emp.guarantorRelationship ?? "",
      isActive: emp.isActive ?? true,
    }),
    [],
  )

  const form = useForm<EditEmployeeFormValues>({
    resolver: zodResolver(editEmployeeFormSchema),
    defaultValues: getDefaultValues(employee),
  })

  // Reset form when employee prop changes
  useEffect(() => {
    const newDefaultValues = getDefaultValues(employee)
    form.reset(newDefaultValues)
  }, [employee, form, getDefaultValues])

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setEditMode(false)
        form.reset(getDefaultValues(employee))
      } else {
        form.reset(getDefaultValues(employee))
      }
      setDialogOpen(open)
    },
    [employee, form, getDefaultValues],
  )

  const handleSubmit = useCallback(
    async (values: EditEmployeeFormValues) => {
      if (!onEmployeeUpdated) return

      setSubmitting(true)

      try {
        const result = await onEmployeeUpdated(employee.id, values)

        if (result.success) {
          setEditMode(false)
          setDialogOpen(false)
          form.reset(values)
        }
      } catch (error) {
        console.error("Submit error:", error)
      } finally {
        setSubmitting(false)
      }
    },
    [employee.id, onEmployeeUpdated, form],
  )

  const handleDelete = useCallback(async () => {
    if (!onEmployeeDeleted) return

    setDeleting(true)

    try {
      const result = await onEmployeeDeleted(employee.id)

      if (result.success) {
        setDialogOpen(false)
        setDeleteDialogOpen(false)
      }
    } catch (error) {
      console.error("Delete error:", error)
    } finally {
      setDeleting(false)
    }
  }, [employee.id, onEmployeeDeleted])

  return (
    <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto z-50">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">Employee Details</DialogTitle>
              <DialogDescription>
                View and edit employee information for {employee.firstName} {employee.lastName}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                <span className="text-sm font-medium">Edit Mode</span>
                <Switch checked={editMode} onCheckedChange={setEditMode} disabled={submitting || deleting} />
              </div>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Personal Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Personal Information</h3>
              </div>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter first name" {...field} disabled={isFormDisabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter last name" {...field} disabled={isFormDisabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email" {...field} disabled={isFormDisabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact number" {...field} disabled={isFormDisabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter full address"
                        className="min-h-[80px]"
                        {...field}
                        disabled={isFormDisabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Job Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Job Information</h3>
              </div>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter job position" {...field} disabled={isFormDisabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salary"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salary</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter salary amount"
                          {...field}
                          disabled={isFormDisabled}
                          onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormDescription>Monthly salary in your local currency</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={!editMode} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active Employee</FormLabel>
                      <FormDescription>Check this box if the employee is currently active</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            {/* Bank Details Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Bank Details</h3>
              </div>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter bank name" {...field} disabled={isFormDisabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="accountName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter account name" {...field} disabled={isFormDisabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="accountNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter account number" {...field} disabled={isFormDisabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bvn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>BVN</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter 11-digit BVN" maxLength={11} {...field} disabled={isFormDisabled} />
                      </FormControl>
                      <FormDescription>Bank Verification Number (11 digits)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Guarantor Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Guarantor Information</h3>
              </div>
              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="guarantorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guarantor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter guarantor's full name" {...field} disabled={isFormDisabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="guarantorPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guarantor Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter guarantor's phone number" {...field} disabled={isFormDisabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="guarantorRelationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Father, Friend, Colleague" {...field} disabled={isFormDisabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="guarantorAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guarantor Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter guarantor's full address"
                        className="min-h-[80px]"
                        {...field}
                        disabled={isFormDisabled}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4 border-t">
              <div className="flex gap-3">
                <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button type="button" variant="destructive" disabled={submitting || deleting}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Employee
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the employee{" "}
                        <strong>
                          {employee.firstName} {employee.lastName}
                        </strong>{" "}
                        and remove all their data from our servers. This will also delete their associated user account.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleting}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                      >
                        {deleting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Deleting...
                          </>
                        ) : (
                          "Delete Employee"
                        )}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="flex gap-3">
                <DialogClose asChild>
                  <Button type="button" variant="outline" disabled={submitting || deleting}>
                    Cancel
                  </Button>
                </DialogClose>
                {editMode && (
                  <Button type="submit" disabled={submitting || deleting}>
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
