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
import { toast } from "sonner";

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
  });

  const { handleSubmit, control, formState, setError, getValues } = form;

  const handleNext = () => {
    if (step === 1) {
      const { password, confirmPassword } = getValues();
      if (password !== confirmPassword) {
        setError("confirmPassword", {
          message: "Passwords do not match",
        });
        return;
      }
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const submit = async (values: SignupInput) => {
    const res = await signUpAction(values);

    if (res.redirectTo) {
      router.push(res.redirectTo);
      return;
    }

    console.log(res);


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

      toast(typeof res.error === "string" ? res.error : "Internal Server Error")

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
    <Form {...form}>
      <form
        onSubmit={handleSubmit(submit)}
        className="w-full space-y-4 px-10 md:max-w-[600px] mx-auto md:px-20"
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
                    <Input type="email" placeholder="e.g. john@example.com" {...field} />
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
                    <Input type="password" placeholder="e.g. ********" {...field} />
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
                    <Input type="password" placeholder="e.g. ********" {...field} />
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
                    <Input type="text" placeholder="e.g. Entropy Ltd" {...field} />
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
                    <Input type="tel" placeholder="e.g. 08012345678" {...field} />
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
                    <Input type="text" placeholder="e.g. Entropy Lagos Branch" {...field} />
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
                    <Input type="text" placeholder="e.g. 23 Awolowo Rd" {...field} />
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
                    <Input type="text" placeholder="e.g. Lagos" {...field} />
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
                    <Input type="text" placeholder="e.g. Lagos State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <div className="flex justify-between gap-4 pt-4">
          {step > 1 && (
            <Button type="button" onClick={handleBack} variant="outline">
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button type="button" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={formState.isSubmitting}>
              Sign Up
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
