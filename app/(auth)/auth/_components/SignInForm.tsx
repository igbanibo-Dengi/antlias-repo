"use client";

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
import { useRouter } from "next/navigation";
import { SigninInput, SigninSchema } from "@/validators/signin-validator";
import { signInAction } from "@/lib/actions/auth/signIn.actions";
import { ForgotPasswordForm } from "./forgot-password-form";
import { toast } from "sonner";
import Link from "next/link";

export const SignInForm = () => {
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const form = useForm<SigninInput>({
    resolver: valibotResolver(SigninSchema),
    defaultValues: { email: "", password: "" },
  });

  const { handleSubmit, control, formState, setError, reset } = form;

  const submit = async (values: SigninInput) => {
    // console.log(values);
    const res = await signInAction(values);

    if (res.redirectTo) {
      router.push(res.redirectTo);
      return;
    }

    if (res.success) {
      // reset();
      window.location.href = "/"
    } else {
      switch (res.statusCode) {
        case 401:
          setError("password", { message: res.error })
          break;
        case 500:
        default:
          const error = res.error || "Internal Server Error";
          setError("password", { message: error });
      }
      toast(typeof res.error === "string" ? res.error : "Internal Server Error");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(submit)}
        className="w-full space-y-4"
        autoComplete="false"
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
                  placeholder="e.g. john.smith@example.com"
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
                <Input type="password" placeholder="e.g. ********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="w-full flex items-center justify-end">
          <Button
            variant={"link"}
            className="ml-auto"
          >
            <Link href={"/auth/sign-in/forgot-password"}>
              Forgot Password?
            </Link>
          </Button>
        </div>
        <Button
          type="submit"
          size={"lg"}
          disabled={formState.isSubmitting}
          className="w-full"
        >
          Sign In
        </Button>
      </form>
    </Form>
  );
};
