'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, ChevronLeft } from "lucide-react";
import Image from "next/image";

export default function ResetPasswordConfirmation() {
  return (
    <main className="h-full w-full">
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Image
            src="/icons/antlias-logo.svg"
            alt="Antlias Logo"
            width={88}
            height={88}
            priority
          />

          <div className="mt-4 text-center">
            <h2 className="w-6xl text-lg font-semibold">
              Password Reset Successful
            </h2>
            <p className="text-sm text-muted-foreground">
              Your password has been successfully reset. <br /> Click below to
              log in.
            </p>
          </div>

          <div className="h-px w-full max-w-md bg-muted" />

          <div className="mt-8 w-full max-w-md space-y-4">
            <Button variant="default" className="w-full" asChild>
              <Link href="/auth/sign-in">Continue</Link>
            </Button>
            <Button variant="link" className="w-full" asChild>
              <Link href="/auth/sign-in">
                <ChevronLeft />
                Back to log in
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
