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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getTenantId, getUserBySession } from "@/lib/actions/user/user.action";
import { createBranch } from "@/lib/actions/branches/branch.action";

// Sample manager list (you'll probably fetch this from a backend)
const managers = [
  { id: "1", name: "John Doe", email: "johndoe@gmail.com" },
  { id: "2", name: "Jane Smith", email: "janesmith@gmail.com" },
  { id: "3", name: "Michael Johnson", email: "michaelj@gmail.com" },
];

// Schemas
const newStationSchema = z.object({
  branchName: z.string().min(2, { message: "Station name is required" }),
  location: z.string().min(2, { message: "Location is required" }),
  manager: z.string().optional(),
  phone: z
    .string()
    .regex(
      /^(?:\+234|234|0)?(7[0-9]|8[0-9]|9[0-9])[0-9]{8}$/,
      "Invalid phone number"
    ),
});

interface NewStationFormModalProps {
  onClose?: () => void;
}

const NewStationForm: React.FC<NewStationFormModalProps> = ({ onClose }) => {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState("");
  const [selectedManager, setSelectedManager] = React.useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [loadingNewManager, setLoadingNewManager] = React.useState(false);

  const stationForm = useForm<z.infer<typeof newStationSchema>>({
    resolver: zodResolver(newStationSchema),
    defaultValues: {
      branchName: "",
      location: "",
      manager: "",
      phone: "",
    },
  });

  const filteredManagers = React.useMemo(() => {
    const search = searchValue.toLowerCase();
    return search === ""
      ? managers
      : managers.filter(
        (m) =>
          m.name.toLowerCase().includes(search) ||
          m.email.toLowerCase().includes(search)
      );
  }, [searchValue]);

  const handleCreateManager = async (email: string) => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email.");
      return;
    }

    setLoadingNewManager(true);
    try {
      // Simulate an API call to create a new manager
      const newManager = {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email,
      };
      // Update the managers list
      // setManagers([...managers, newManager]);
      setSelectedManager(newManager);
      setSearchValue("");
      toast.success("Manager created successfully!");
    } catch (error) {
      toast.error("Failed to create manager.");
    } finally {
      setLoadingNewManager(false);
    }
  };

  async function onSubmitStation(values: z.infer<typeof newStationSchema>) {
    console.log(values);

  }

  return (
    <div>
      <Form {...stationForm}>
        <form
          onSubmit={stationForm.handleSubmit(onSubmitStation)}
          className="space-y-6 p-6 pt-2"
        >
          <FormField
            control={stationForm.control}
            name="branchName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-gray-500 font-normal">
                  Station Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Suggest a name to this station"
                    className="bg-white border-gray-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={stationForm.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base text-gray-500 font-normal">
                  Location
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Address of the station"
                    className="bg-white border-gray-200"
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

          <div className="space-y-2">
            <Label className="text-base text-gray-500 font-normal">
              Station Manager
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between bg-white border-gray-200 text-gray-500 font-normal"
                >
                  {selectedManager
                    ? selectedManager.name
                    : "Please select or create manager"}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search manager..."
                    value={searchValue}
                    onValueChange={(val) => {
                      setSearchValue(val);
                      setSelectedManager(null);
                    }}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {searchValue && !filteredManagers.length ? (
                        <div className="p-4 text-center space-y-2">
                          <p className="text-sm text-gray-500">
                            No existing manager found.
                          </p>
                          <Button
                            onClick={() => handleCreateManager(searchValue)}
                            className="bg-blue-600 hover:bg-blue-700 w-full"
                            disabled={loadingNewManager}
                          >
                            {loadingNewManager
                              ? "Adding..."
                              : `Add "${searchValue}" as new manager`}
                          </Button>
                        </div>
                      ) : (
                        <p className="py-6 text-center text-sm">
                          No manager found.
                        </p>
                      )}
                    </CommandEmpty>
                    <CommandGroup>
                      {filteredManagers.map((manager) => (
                        <CommandItem
                          key={manager.id}
                          onSelect={() => {
                            setSelectedManager(manager);
                            setOpen(false);
                            setSearchValue("");
                          }}
                        >
                          <div className="flex flex-col">
                            <span>{manager.name}</span>
                            <span className="text-sm text-muted-foreground">
                              {manager.email}
                            </span>
                          </div>
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              selectedManager?.id === manager.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={!selectedManager || stationForm.formState.isSubmitting}
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default NewStationForm;
