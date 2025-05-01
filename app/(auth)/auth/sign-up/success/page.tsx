import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function Page() {
  return (
    <main className="h-full w-full">
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-8 md:border-r-2 lg:w-1/2">
          <div className="space-y-4 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h1 className="text-3xl font-bold tracking-tight">
              Sign Up Successful
            </h1>
          </div>

          <div className="h-px w-full max-w-md bg-muted" />

          <div className="space-y-2 text-center">
            <p className="text-xl font-semibold">
              Verification email has been sent!
            </p>
            <p className="text-muted-foreground">
              Please check your email to verify your account.
            </p>
          </div>

          <div className="h-px w-full max-w-md bg-muted" />

          <div className="w-full max-w-md space-y-4">
            <Button variant="default" className="w-full" asChild>
              <Link href="/auth/sign-in">Go to Sign In</Link>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
        <div className="hidden h-screen bg-muted lg:flex lg:w-1/2"></div>
      </div>
    </main>
  );
}
