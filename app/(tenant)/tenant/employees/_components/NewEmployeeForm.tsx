"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { employeeFormSchema, EmployeeFormValues } from "@/validators/employee-form-validator";
import { useRouter } from "next/navigation";
import { createEmployee } from "@/lib/actions/employee/employee";
import { BranchProps } from "@/types";


export function NewEmployeeForm({ branches }: BranchProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'personal' | 'account' | 'guarantor'>('personal');
  const router = useRouter();

  const form = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      contactNumber: "",
      address: "",
      hireDate: undefined,
      position: "",
      role: "",
      salary: undefined,
      // commission: undefined,
      bankName: "",
      accountNumber: "",
      accountName: "",
      bvn: "",
      guarantorName: "",
      guarantorPhone: "",
      guarantorAddress: "",
      guarantorRelationship: "",
    }
  });

  // Function to validate current section before proceeding
  const validateAndProceed = async (nextSection: 'personal' | 'account') => {
    let fieldsToValidate: (keyof EmployeeFormValues)[] = [];

    // Determine which fields to validate based on current section
    if (activeSection === 'personal') {
      fieldsToValidate = ['firstName', 'lastName', 'email', 'contactNumber', 'position', 'role', 'branchId', 'salary'];
    } else if (activeSection === 'account') {
      fieldsToValidate = ['bankName', 'accountNumber', 'accountName', 'bvn'];
    } else if (activeSection === 'guarantor') {
      fieldsToValidate = [];
    }

    // Trigger validation for the current section
    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      setActiveSection(nextSection);
      // Scroll to top of next section for better UX
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Find the first error and scroll to it
      const errorFields = fieldsToValidate.filter(field => form.formState.errors[field]);
      if (errorFields.length > 0) {
        const firstError = errorFields[0];
        const element = document.querySelector(`[name="${firstError}"]`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      toast.error("Please fill all required fields correctly before proceeding.");
    }
  };

  async function onSubmit(data: EmployeeFormValues) {
    setIsLoading(true);

    if (!data.branchId) {
      toast.error("Please select a branch");
      setIsLoading(false);
      return;
    }

    const newData = {
      ...data,
      branchId: data.branchId,
    }

    try {
      const response = await createEmployee(newData)

      if (!response.success) {
        toast.error(response.error || "An unknown error occurred.");
        throw new Error("Failed to create employee")
      }

      if (response.success) {
        toast.success(`${data.firstName} ${data.lastName} has been added to your staff.`, {
          action: {
            label: "View",
            onClick: () => console.log("View employee"),
          },
        });
      }

      router.push("/tenant/employees");
      form.reset();
    } catch (error) {
      return { success: false, error: "Internal Server Error", statusCode: 500 };
    }
    finally {
      setIsLoading(false);
    }
  }

  const sections = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'account', label: 'Account Details' },
    { id: 'guarantor', label: 'Guarantor' },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full flex items-end justify-between">
          <div className="text-2xl font-semibold">New Employee Form</div>

          {/* Navigation Tabs */}
          <div className="flex border-b mt-4">
            {sections.map((section) => (
              <button
                key={section.id}
                type="button"
                className={`px-4 py-2 font-medium ${activeSection === section.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground'
                  }`}
                onClick={() => {
                  // Only allow clicking on tabs that are before the current active section
                  const currentIndex = sections.findIndex(s => s.id === activeSection);
                  const clickedIndex = sections.findIndex(s => s.id === section.id);
                  if (clickedIndex <= currentIndex) {
                    setActiveSection(section.id as any);
                  }
                }}
              >
                {section.label}
              </button>
            ))}
          </div>
        </div>

        {/* Personal Information Section */}
        {activeSection === 'personal' && (
          <div className="space-y-4 border p-6 rounded-lg shadow-lg bg-white">
            <h3 className="text-lg font-medium">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John"
                        {...field}
                        autoCapitalize="words"
                        autoComplete="given-name"
                      />
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
                    <FormLabel>Last Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Doe"
                        {...field}
                        autoCapitalize="words"
                        autoComplete="family-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="johndoe@gmail.com"
                        {...field}
                        type="email"
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="08012345678"
                        {...field}
                        type="tel"
                        pattern="[0-9]{11}"
                        autoComplete="tel"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="cashier">Cashier</SelectItem>
                        <SelectItem value="attendant">Attendant</SelectItem>
                        <SelectItem value="accountant">Accountant</SelectItem>
                        <SelectItem value="driver">Driver</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">Administrative Staff</SelectItem>
                        <SelectItem value="user">Non-Administrative Staff</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />


              <FormField
                control={form.control}
                name="branchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Station <span className="text-red-500">*</span></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select station" />
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
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary (₦)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50000"
                        value={isNaN(field.value ?? NaN) ? "" : field.value}
                        onChange={(e) => {
                          const val = e.target.valueAsNumber;
                          field.onChange(isNaN(val) ? undefined : val);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* <FormField
                control={form.control}
                name="commission"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>commission (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0-100"
                        max={100}
                        value={isNaN(field.value ?? NaN) ? "" : field.value}
                        onChange={(e) => {
                          const val = e.target.valueAsNumber;
                          field.onChange(isNaN(val) ? undefined : val);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}
              <FormField
                control={form.control}
                name="hireDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HireDate</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        value={field.value ? field.value.toISOString().split('T')[0] : ""}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                      />
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
                      placeholder="123 Main Street, Lagos"
                      className="resize-none"
                      {...field}
                      autoComplete="street-address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                disabled={isLoading}
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button
                type="button"
                onClick={() => validateAndProceed('account')}
              >
                Next: Account Details
              </Button>
            </div>
          </div>
        )}

        {/* Account Details Section */}
        {activeSection === 'account' && (
          <div className="space-y-4 border p-6 rounded-lg shadow-lg bg-white">
            <h3 className="text-lg font-medium">Account Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Access Bank" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1234567890"
                        {...field}
                        type="text"
                        pattern="[0-9]*"
                        inputMode="numeric"
                      />
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
                    <FormLabel>Account Name <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                    <FormLabel>BVN <span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input
                        placeholder="12345678901"
                        {...field}
                        type="text"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        maxLength={11}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveSection('personal')}
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={() => setActiveSection('guarantor')}
              >
                Next: Guarantor
              </Button>
            </div>
          </div>
        )}

        {/* Guarantor Section */}
        {activeSection === 'guarantor' && (
          <div className="space-y-4 border p-6 rounded-lg shadow-lg bg-white">
            <h3 className="text-lg font-medium">Guarantor Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="guarantorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guarantor Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Smith" {...field} />
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
                      <Input
                        placeholder="08098765432"
                        {...field}
                        type="tel"
                        pattern="[0-9]{11}"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="guarantorRelationship"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relationship</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="relative">Relative</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="colleague">Colleague</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
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
                      placeholder="456 Second Street, Lagos"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveSection('account')}
              >
                Back
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Adding...
                  </div>
                ) : "Add Employee"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}