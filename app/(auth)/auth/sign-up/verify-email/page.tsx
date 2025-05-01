import { Button } from "@/components/ui/button";
import { verifyCredentialsEmailAction } from "@/lib/actions/auth/verify-credentials-email-action";
import { findVerificationTokenByToken } from "@/resources/verification-token-queries";
import { CheckCircle, ChevronLeft, XCircle } from "lucide-react";
import Image from "next/image";
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
        <div className="flex h-full w-full flex-col items-center justify-center">


          <div className="space-y-4 text-center">
            <div className="space-y-4 text-center">
              <Image
                src="/icons/antlias.svg"
                alt="Antlias Logo"
                width={88}
                height={88}
                priority
                className="mx-auto"
              />
            </div>

            <span className="flex items-center gap-2">
              <CheckCircle className="mx-auto h-10 w-10 text-green-500" />
              <h1 className="text-3xl font-bold tracking-tight">
                Email Verified
              </h1>
            </span>
          </div>


          <div className="space-y-2 text-center mt-2">
            <p className="text-xl font-semibold">
              Your email has been successfully verified!
            </p>
            <p className="text-muted-foreground">
              You can now sign in to your account.
            </p>
          </div>


          <div className="w-full max-w-md space-y-4 mt-4">
            <Button variant="default" className="w-full" asChild>
              <Link href="/auth/sign-in">Sign In</Link>
            </Button>
            <Button variant="link" className="w-full" asChild>
              <Link href="/">
                <ChevronLeft />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

const TokenIsInvalidState = () => {
  return (
    <main className="h-full w-full">
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="space-y-4 text-center">
            <Image
              src="/icons/antlias.svg"
              alt="Antlias Logo"
              width={88}
              height={88}
              priority
              className="mx-auto"
            />

            <span className="flex items-center gap-2">
              <XCircle className="h-10 w-10 text-red-500" />
              <h1 className="text-3xl font-bold tracking-tight">
                Invalid Verification Token
              </h1>
            </span>
          </div>



          <div className="space-y-2 text-center mt-4">
            <p className="text-xl font-semibold">
              The verification token is invalid or has expired.
            </p>
            <p className="text-muted-foreground">
              Please try signing up again to receive a new verification email.
            </p>
          </div>



          <div className="w-full max-w-md space-y-4 mt-4">
            <Button variant="default" className="w-full" asChild>
              <Link href="/auth/sign-up">Sign Up Again</Link>
            </Button>
            <Button variant="link" className="w-full" asChild>
              <Link href="/">
                <ChevronLeft />
                Back to log in
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};
