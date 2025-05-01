import { Button } from "@/components/ui/button";
import { findVerificationTokenByToken } from "@/resources/verification-token-queries";
import Link from "next/link";
import { ResetPasswordForm } from "../../_components/reset-password-form";
import { KeyRound, XCircle } from "lucide-react";
import Image from "next/image";

type PageProps = { searchParams: Promise<{ token: string }> };

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const verificationToken = await findVerificationTokenByToken(
    searchParams.token,
  );

  if (!verificationToken?.expires) return <TokenIsInvalidState />;

  const isExpired = new Date(verificationToken.expires) < new Date();

  if (isExpired) return <TokenIsInvalidState />;

  return (
    <main className="h-full w-full">
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-center">
          <Image
            src="/icons/antlias-logo.svg"
            alt="Antlias Logo"
            width={60}
            height={60}
            priority
          />

          <div className="mt-4 text-center">
            <h2 className="w-6xl text-lg font-semibold">Set new password</h2>
            <p className="text-sm text-muted-foreground">
              Your new password must be different from the <br /> previously
              used password.
            </p>
          </div>

          <div className="w-full max-w-md">
            <ResetPasswordForm
              email={verificationToken.identifier}
              token={searchParams.token}
            />
          </div>

          <div className="h-px w-full max-w-md bg-muted" />

          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              No longer need to reset your password?{" "}
              <Button variant="link" size="sm" className="px-0" asChild>
                <Link href="/auth/sign-in">Sign in here</Link>
              </Button>
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}

const TokenIsInvalidState = () => {
  return (
    <main className="h-screen w-full">
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-8 md:border-r-2 lg:w-1/2">
          <div className="space-y-4 text-center">
            <Image
              src="/icons/antlias-logo.svg"
              alt="Antlias Logo"
              width={88}
              height={88}
              priority
              className="mx-auto"
            />

            <span className="flex items-center gap-2">
              <XCircle className="h-10 w-10 text-red-500" />
              <h1 className="text-3xl font-bold tracking-tight">
                Invalid Reset Token
              </h1>
            </span>
          </div>

          <div className="h-px w-full max-w-md bg-muted" />

          <div className="space-y-2 text-center">
            <p className="text-xl font-semibold">
              The password reset token is invalid or has expired.
            </p>
            <p className="text-muted-foreground">
              Please request a new password reset email.
              <Button variant={"link"} className="px-2 text-base" asChild>
                <Link href={"/auth/sign-in/forgot-password"}>Click here</Link>
              </Button>
            </p>
          </div>

          <div className="h-px w-full max-w-md bg-muted" />
        </div>
        <div className="hidden h-screen bg-muted lg:flex lg:w-1/2"></div>
      </div>
    </main>
  );
};
