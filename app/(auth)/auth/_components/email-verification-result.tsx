"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, ChevronLeft, XCircle } from "lucide-react"
import Link from "next/link"

type EmailVerificationResultProps = {
  status: "success" | "invalid"
}

export function EmailVerificationResult({ status }: EmailVerificationResultProps) {
  if (status === "success") {
    return (
      <main className="h-full w-full container">
        <div className="flex h-screen w-full items-center justify-center">
          <div className="flex h-full w-full flex-col items-center justify-center">
            <div className="space-y-4 text-center">
              <span className="flex flex-col xl:flex-row items-center gap-2">
                <CheckCircle className="h-10 w-10 text-green-500" />
                <h1 className="text-3xl font-bold tracking-tight">Email Verified</h1>
              </span>
            </div>

            <div className="space-y-2 text-center mt-2">
              <p className="text-xl font-semibold">Your email has been successfully verified!</p>
              <p className="text-muted-foreground">You can now sign in to your account.</p>
            </div>

            <div className="w-full max-w-md space-y-4 mt-4">
              <Button variant="default" className="w-full" asChild>
                <Link href="/auth/sign-in">Sign In</Link>
              </Button>
              {/* <Button variant="link" className="w-full" asChild>
                <Link href="/">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button> */}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="h-full w-full container">
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="space-y-4 text-center">
            <span className="flex flex-col xl:flex-row items-center gap-2">
              <XCircle className="h-10 w-10 text-red-500" />
              <h1 className="text-3xl font-bold tracking-tight">Invalid Verification Token</h1>
            </span>
          </div>

          <div className="space-y-2 text-center mt-4">
            <p className="text-xl font-semibold">The verification token is invalid or has expired.</p>
            <p className="text-muted-foreground">Please try signing up again to receive a new verification email.</p>
          </div>

          <div className="w-full max-w-md space-y-4 mt-4">
            <Button variant="default" className="w-full" asChild>
              <Link href="/auth/sign-up">Sign Up Again</Link>
            </Button>
            <Button variant="link" className="w-full" asChild>
              <Link href="/auth/sign-in">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to log in
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
