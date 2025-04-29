import Link from "next/link";
import { SignupForm } from "../_components/SignUpForm";
import { Button } from "@/components/ui/button";
import OAuthButtons, { OAuthButtonsSkeleton } from "@/components/OauthButtons";
import { Suspense } from "react";

const SignUpPage = () => {
  return (
    <main className="h-full w-full">
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-center md:border-r-2 gap-2 lg:w-1/2">
          <h1>Sign Up</h1>

          <div className="w-full space-y-4">
            <SignupForm />
            <Suspense fallback={<OAuthButtonsSkeleton signup />} >
              <OAuthButtons signup />
            </Suspense>
            <Button
              variant={"link"}
              className=" text-muted-foreground"
              asChild
            >
              <Link href="/auth/sign-in" className="text-center w-full">Already have an account?<span className="text-primary ml-1"> Sign in</span></Link>
            </Button>
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

export default SignUpPage;
