"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Loader2, Info, User, Briefcase, CreditCard, Shield, Edit3 } from "lucide-react"
import { toast } from "sonner"
// import { editEmployeeFormSchema } from "@/validators/employee-form-validator"
import { editEmployeeAction } from "@/lib/actions/employee/employee"
import { editEmployeeFormSchema, EditEmployeeFormValues } from "@/validators/employee-form-validator"
import { useRouter } from "next/navigation"


// This type is for only editing Employee
interface Employee {
  id: string;
  address: string | null;
  salary: number | null;
  createdAt: Date | null;
  tenantId: string;
  isActive: boolean | null;
  userId: string;
  branchId: string;
  firstName: string;
  lastName: string;
  contactNumber: string | null;
  email: string | null;
  hireDate: string | null;
  position: string | null;
  commission: string | null;
  bankName: string | null;
  accountNumber: string | null;
  accountName: string | null;
  bvn: string | null;
  guarantorName: string | null;
  guarantorPhone: string | null;
  guarantorAddress: string | null;
  guarantorRelationship: string | null;
}



interface EditEmployeeDialogProps {
  employee: Employee
}

export function EditEmployeeDialog({ employee }: EditEmployeeDialogProps) {
  const [editMode, setEditMode] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const isFormDisabled = submitting || !editMode
  const router = useRouter()

  const form = useForm<EditEmployeeFormValues>({
    resolver: zodResolver(editEmployeeFormSchema),
    defaultValues: {
      branchId: employee.branchId,
      // role: employee.role ?? "",
      firstName: employee.firstName,
      lastName: employee.lastName,
      contactNumber: employee.contactNumber ?? "",
      email: employee.email ?? "",
      address: employee.address ?? "",
      position: employee.position ?? "",
      salary: employee.salary ?? 0,
      accountNumber: employee.accountNumber ?? "",
      accountName: employee.accountName ?? "",
      bankName: employee.bankName ?? "",
      bvn: employee.bvn ?? "",
      guarantorName: employee.guarantorName ?? "",
      guarantorPhone: employee.guarantorPhone ?? "",
      guarantorAddress: employee.guarantorAddress ?? "",
      guarantorRelationship: employee.guarantorRelationship ?? "",
      isActive: employee.isActive ?? true,
    },
  })

  const handleDialogOpenChange = (open: boolean) => {
    if (!open) {
      setEditMode(false)
      form.reset()
    }
    setDialogOpen(open)
  }

  const handleSubmit = async (values: EditEmployeeFormValues) => {
    console.log("Form submitted with values:", values)

    setSubmitting(true)

    try {
      const result = await editEmployeeAction(employee.id, values)

      if (result.success) {
        toast.success("Employee updated successfully")
        router.refresh()
        setEditMode(false)
        setDialogOpen(false)
        form.reset(values)
      } else {
        toast.error("Failed to update employee")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
      console.error("Submit error:", error)
    } finally {
      setSubmitting(false)
    }
  }

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
              <DialogDescription>View and edit employee information below.</DialogDescription>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Edit3 className="h-4 w-4" />
                <span className="text-sm font-medium">Edit Mode</span>
                <Switch checked={editMode} onCheckedChange={setEditMode} disabled={submitting} />
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
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={!editMode} // Fixed: Only disable when not in edit mode
                      />
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
            <div className="flex justify-end gap-3 pt-4 border-t">
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={submitting}>
                  Cancel
                </Button>
              </DialogClose>
              {editMode && (
                <Button type="submit" disabled={submitting}>
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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

// // Demo component to test the dialog
// export default function Component() {
//   const mockEmployee: Employee = {
//     id: "1",
//     firstName: "John",
//     lastName: "Doe",
//     email: "john.doe@example.com",
//     contactNumber: "+1234567890",
//     address: "123 Main St, City, State",
//     position: "Software Engineer",
//     salary: 75000,
//     accountNumber: "1234567890",
//     accountName: "John Doe",
//     bankName: "Example Bank",
//     bvn: "12345678901",
//     guarantorName: "Jane Smith",
//     guarantorPhone: "+0987654321",
//     guarantorAddress: "456 Oak Ave, City, State",
//     guarantorRelationship: "Sister",
//     isActive: true,
//   }

//   return (
//     <div className="p-8">
//       <h1 className="text-2xl font-bold mb-4">Employee Management</h1>
//       <p className="text-muted-foreground mb-6">Click the info button to open the employee dialog</p>
//       <EditEmployeeDialog employee={mockEmployee} />
//     </div>
//   )
// }
