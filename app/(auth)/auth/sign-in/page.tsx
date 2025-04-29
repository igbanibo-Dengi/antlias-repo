import { Button } from "@/components/ui/button";
import { SignInForm } from "../_components/SignInForm";
import Link from "next/link";
import OAuthButtons, { OAuthButtonsSkeleton } from "@/components/OauthButtons";
import { Suspense } from "react";
import { ForgotPasswordForm } from "../_components/forgot-password-form";

const SignInPage = () => {
  return (
    <main className="h-full w-full">
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex h-full w-full flex-col gap-4 items-center justify-center border-r-2 lg:w-1/2">
          <h1>Sign In</h1>
          <div className="w-full space-y-4">
            <SignInForm />
            <Suspense fallback={<OAuthButtonsSkeleton />}>
              <OAuthButtons />
            </Suspense>

            <Button
              variant={"link"}
              className="text-muted-foreground"
              asChild
            >
              <Link href="/auth/sign-up" className="text-center w-full">
                Don&apos;t have an account?<span className="text-primary ml-1"> Sign Up</span>
              </Link>
            </Button>
            {/* Forgot Password Dialog
            <ForgotPasswordForm /> */}
          </div>
        </div>
        <div className="hidden h-screen lg:flex lg:w-1/2">
          <div className="relative h-full w-full bg-slate-950">
            <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]">
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignInPage;
