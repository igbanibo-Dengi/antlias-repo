import { Button } from "@/components/ui/button";
import { verifyCredentialsEmailAction } from "@/lib/actions/auth/verify-credentials-email-action";
import { findVerificationTokenByToken } from "@/resources/verification-token-queries";
import { CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";

type PageProps = { searchParams: Promise<{ token: string }> };

export default async function Page(props: PageProps) {
  const searchParams = await props.searchParams;
  const verificationToken = await findVerificationTokenByToken(
    searchParams.token,
  );

  if (!verificationToken?.expires) return <TokenIsInvalidState />;

  const isExpired = new Date(verificationToken.expires) < new Date();

  if (isExpired) return <TokenIsInvalidState />;

  const res = await verifyCredentialsEmailAction(searchParams.token);

  if (!res.success) return <TokenIsInvalidState />;

  return (
    <main className="h-full w-full">
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-8 md:border-r-2 lg:w-1/2">
          <div className="space-y-4 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h1 className="text-3xl font-bold tracking-tight">
              Email Verified
            </h1>
          </div>

          <div className="h-px w-full max-w-md bg-muted" />

          <div className="space-y-2 text-center">
            <p className="text-xl font-semibold">
              Your email has been successfully verified!
            </p>
            <p className="text-muted-foreground">
              You can now sign in to your account.
            </p>
          </div>

          <div className="h-px w-full max-w-md bg-muted" />

          <div className="w-full max-w-md space-y-4">
            <Button variant="default" className="w-full" asChild>
              <Link href="/auth/sign-in">Sign In</Link>
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

const TokenIsInvalidState = () => {
  return (
    <main className="h-full w-full">
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-8 md:border-r-2 lg:w-1/2">
          <div className="space-y-4 text-center">
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
            <h1 className="text-3xl font-bold tracking-tight">Invalid Token</h1>
          </div>

          <div className="h-px w-full max-w-md bg-muted" />

          <div className="space-y-2 text-center">
            <p className="text-xl font-semibold">
              The verification token is invalid or has expired.
            </p>
            <p className="text-muted-foreground">
              Please try signing up again to receive a new verification email.
            </p>
          </div>

          <div className="h-px w-full max-w-md bg-muted" />

          <div className="w-full max-w-md space-y-4">
            <Button variant="default" className="w-full" asChild>
              <Link href="/auth/sign-up">Sign Up Again</Link>
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
};
