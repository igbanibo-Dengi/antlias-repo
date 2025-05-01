"use client";

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
import { forgotPasswordAction } from "@/lib/actions/auth/forgot-password-action";
import {
  ForgotPasswordInput,
  ForgotPasswordSchema,
} from "@/validators/forgot-password-validator";
import { valibotResolver } from "@hookform/resolvers/valibot";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export const ForgotPasswordForm = () => {
  const [success, setSuccess] = useState("");

  const form = useForm<ForgotPasswordInput>({
    resolver: valibotResolver(ForgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { handleSubmit, control, formState, setError } = form;

  const submit = async (values: ForgotPasswordInput) => {
    setSuccess("");

    const res = await forgotPasswordAction(values);

    if (res.success) {
      setSuccess("Password reset email sent.");
    } else {
      switch (res.statusCode) {
        case 400:
          const nestedErrors = res.error.nested;

          if (nestedErrors && "email" in nestedErrors) {
            setError("email", { message: nestedErrors.email?.[0] });
          } else {
            setError("email", { message: "Internal Server Error" });
          }
          break;
        case 401:
          setError("email", { message: res.error });
          break;
        case 500:
        default:
          const error = res.error || "Internal Server Error";
          setError("email", { message: error });
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-6">
      <Image
        src="/icons/antlias-logo.svg"
        alt="Antlias Logo"
        width={88}
        height={88}
        priority
      />

      <div className="space-y-2 text-center">
        <h2 className="text-lg font-semibold">Forgot Password?</h2>
        <p className="text-muted-foreground">
          No worries, we&apos;ll send you reset instructions.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={handleSubmit(submit)}
          className="min-w-[300px] space-y-4"
        >
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    {...field}
                    disabled={!!success}
                    className=""
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {success && (
            <p className="text-sm font-medium text-green-600">{success}</p>
          )}

          <Button
            type="submit"
            disabled={formState.isSubmitting || !!success}
            className="w-full"
          >
            {formState.isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </Form>
      <Link href="/auth/sign-up">
        <span className="text-sm text-blue-600 hover:underline">
          &lt; Back to log in
        </span>
      </Link>
    </div>
  );
};
