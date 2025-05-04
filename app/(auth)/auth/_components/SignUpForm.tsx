"use client";

import { type SignupInput, SignupSchema } from "@/validators/signup-validator";
import { useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUpAction } from "@/lib/actions/auth/signUp.actions";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const SignupForm = () => {
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState(1);
  const router = useRouter();

  const form = useForm<SignupInput>({
    resolver: valibotResolver(SignupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      companyPhone: "",
      franchiseNumber: "",
      numberOfStations: undefined,
      branchName: "",
      branchAddress: "",
      branchCity: "",
      branchState: "",
    },
    mode: "onChange", // Add this to validate on change
  });

  const {
    handleSubmit,
    control,
    formState,
    setError,
    getValues,
    trigger,
    watch,
  } = form;

  // Watch all fields to trigger validation
  watch();

  const handleNext = async () => {
    let isValid = false;

    if (step === 1) {
      isValid = await trigger(["email", "password", "confirmPassword"]);
      const { password, confirmPassword } = getValues();
      if (password !== confirmPassword) {
        setError("confirmPassword", {
          message: "Passwords do not match",
        });
        isValid = false;
      }
    } else if (step === 2) {
      isValid = await trigger([
        "companyName",
        "companyPhone",
        "franchiseNumber",
        "numberOfStations",
      ]);
    }

    if (isValid) {
      setStep((prev) => prev + 1);
    }
  };

  const isStepValid = () => {
    if (step === 1) {
      return (
        !formState.errors.email &&
        !formState.errors.password &&
        !formState.errors.confirmPassword &&
        getValues("password") === getValues("confirmPassword") &&
        getValues("email") &&
        getValues("password") &&
        getValues("confirmPassword")
      );
    } else if (step === 2) {
      return (
        !formState.errors.companyName &&
        !formState.errors.companyPhone &&
        !formState.errors.franchiseNumber &&
        !formState.errors.numberOfStations &&
        getValues("companyName") &&
        getValues("companyPhone") &&
        getValues("franchiseNumber") &&
        getValues("numberOfStations") !== undefined
      );
    }
    return true;
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const submit = async (values: SignupInput) => {
    const res = await signUpAction(values);

    if (res.redirectTo) {
      router.push(res.redirectTo);
      return;
    }

    if (res.success) {
      router.push("/auth/sign-up/success");
    } else {
      switch (res.statusCode) {
        case 400:
          const nestedErrors = res.error.nested;
          for (const key in nestedErrors) {
            setError(key as keyof SignupInput, {
              message: nestedErrors[key]?.[0],
            });
          }
          break;
        case 500:
        default:
          const error = res.error || "Internal Server Error";
          setError("confirmPassword", { message: error });
      }

      toast(
        typeof res.error === "string" ? res.error : "Internal Server Error",
      );
    }
  };

  if (success) {
    return (
      <div>
        <p>User Successfully Created</p>
        <span>
          Click{" "}
          <Button variant="link" size="sm" className="px-0" asChild>
            <Link href={"/auth/sign-in"}>here</Link>
          </Button>
        </span>
      </div>
    );
  }

  return (
    <div
      className={`h-screen w-screen overflow-hidden ${step === 1 ? "grid lg:grid-cols-5" : "grid-cols-1"}`}
    >
      <div className="col-span-2 hidden w-full items-center justify-center lg:flex">
        <div className="relative h-[90%] w-[70%]">
          <Image
            src="/images/auth_image.webp"
            alt="Illustration"
            fill
            priority
          />
        </div>
      </div>

      <div className="relative col-span-3 flex h-full w-full flex-col items-center justify-center">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="ml-4.5 flex items-center gap-2">
              <Image
                src="/icons/Logo.svg"
                alt="logo"
                width={20}
                height={20}
              />
              <h2 className="text-xl font-semibold">Antlias</h2>
            </div>
          </div>

          <div className="flex w-full flex-col justify-center md:min-w-[400px]">
            <Form {...form}>
              <form
                onSubmit={handleSubmit(submit)}
                className="w-full space-y-4"
                autoComplete="false"
              >
                {step === 1 && (
                  <>
                    <FormField
                      control={control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="e.g. john@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="e.g. ********"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="e.g. ********"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {step === 2 && (
                  <>
                    <FormField
                      control={control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="e.g. Entropy Ltd"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="companyPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Phone</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="e.g. 08012345678"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="franchiseNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Franchise Number</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g. 1234"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="numberOfStations"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Stations</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="e.g. 5"
                              value={isNaN(field.value) ? "" : field.value}
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
                  </>
                )}

                {step === 3 && (
                  <>
                    <FormField
                      control={control}
                      name="branchName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="e.g. Entropy Lagos Branch"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="branchAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch Address</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="e.g. 23 Awolowo Rd"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="branchCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch City</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="e.g. Lagos"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={control}
                      name="branchState"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch State</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="e.g. Lagos State"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <div className="flex justify-between gap-4 pt-4">
                  {step > 1 && (
                    <Button
                      type="button"
                      onClick={handleBack}
                      variant="outline"
                      className="w-full"
                    >
                      Back
                    </Button>
                  )}
                  {step < 3 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="w-full"
                      disabled={!isStepValid()}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={formState.isSubmitting}
                      className="w-full"
                    >
                      {formState.isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
            <Button variant={"link"} className="text-muted-foreground" asChild>
              <Link href="/auth/sign-in" className="w-full text-center">
                Already have an account?
                <span className="ml-1 text-primary"> Sign in</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
