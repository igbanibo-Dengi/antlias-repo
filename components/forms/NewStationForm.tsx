"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Label } from "@/components/ui/label";
import { Textarea } from "../ui/textarea";
import { Branch, BranchProps, Employee } from "@/types";
import { NewEmployeeForm } from "@/app/(tenant)/tenant/employees/_components/NewEmployeeForm";
import { createBranch } from "@/lib/actions/tenant/tenant.action";
import { newStationSchema } from "@/validators/branch-validator";
import { toast } from "sonner";
import { format } from "path";


interface NewStationFormProps {
  branches: Branch[];
  employees: Employee[];
}



const NewStationForm = ({ branches, employees }: NewStationFormProps) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("")
  const [submitting, setSubmitting] = React.useState(false);

  console.log(value)
  const stationForm = useForm<z.infer<typeof newStationSchema>>({
    resolver: zodResolver(newStationSchema),
    defaultValues: {
      branchName: "",
      city: "",
      state: "",
      address: "",
      managerId: "",
      phone: "",
    },
  });

  async function onSubmitStation(values: z.infer<typeof newStationSchema>) {
    setSubmitting(true);
    const response = await createBranch(values)

    if (!response.success) {
      toast.error("error creating station", {
        description: response.error ?? "error creating station"
      })
      setSubmitting(false);
    } else {
      toast.success("station created successfully")
      stationForm.reset();
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full mx-auto  border rounded-lg bg-white shadow-md p-6">

      <div className="space-y-6 p-6 pt-2">
        <h2 className="text-2xl font-semibold" >Create new station</h2>
      </div>

      <Form {...stationForm}>
        <form
          onSubmit={stationForm.handleSubmit(onSubmitStation)}
          className="space-y-6 p-6 pt-2"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={stationForm.control}
              name="branchName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel >
                    Station Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter station name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <FormField
              control={stationForm.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel >
                    City
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter city"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={stationForm.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel >
                    State
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter state"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={stationForm.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Station Phone</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="Enter station phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={stationForm.control}
              name="address"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Station Address</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter station address"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>


          <div className="flex items-end gap-6">


            <FormField
              control={stationForm.control}
              name="managerId"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full">
                  <FormLabel>Manager</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                      >
                        {field.value
                          ? `${employees.find((employee) => employee.userId === field.value)?.firstName} ${employees.find((employee) => employee.userId === field.value)?.lastName}`
                          : "Select employee..."}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] p-0">
                      <Command>
                        <CommandInput placeholder="Search employee..." />
                        <CommandList>
                          <CommandEmpty>No employee found.</CommandEmpty>
                          <CommandGroup>
                            {employees.map((employee) => (
                              <CommandItem
                                value={employee.userId}
                                key={employee.userId}
                                onSelect={() => {
                                  stationForm.setValue("managerId", employee.userId);
                                  setOpen(false)
                                }}
                              >
                                <div className="flex items-center gap-2 w-full justify-between">
                                  <p className="">{`${employee.firstName} ${employee.lastName} `}</p>
                                  <p className="text-xs  text-muted-foreground">{`${employee.position}`}</p>
                                </div>
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    field.value === employee.userId ? "opacity-100" : "opacity-0"
                                  )}
                                />

                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button>
                    Add new employee
                  </Button>
                </SheetTrigger>
                <SheetContent className="min-w-[800px] overflow-y-scroll">
                  <SheetHeader>
                    <SheetTitle className="sr-only">New employee form</SheetTitle>
                    <SheetDescription className="sr-only">
                      new employee form
                    </SheetDescription>
                  </SheetHeader>

                  <div>
                    <NewEmployeeForm branches={branches} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {submitting ? "Creating..." : "Create Station"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewStationForm;
