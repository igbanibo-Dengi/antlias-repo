import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function Page() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-blue-100 p-4">
      <Card className="p-35 m-2 h-full w-full text-center shadow-lg">
        <CardContent className="flex h-full w-full flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-2">
            <Image
              src="/icons/antlias-logo.svg"
              alt="Antlias Logo"
              width={60}
              height={60}
              priority
            />
            <span className="text-lg font-semibold">Antlias</span>
          </div>

          <div className="rounded-full bg-primary/10 p-4 text-primary">
            <div className="rounded-full bg-primary/10 p-4 text-primary">
              <Mail className="size-10" />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold">Check your email</h2>
            <p className="text-gray-500">Welcome aboard!</p>
          </div>
          <p className="text-muted-foreground">
            Complete your sign-up by verifying your email.
          </p>

          <Link href="/auth/sign-in">
            <span className="text-sm text-blue-600 hover:underline">
              &lt; Back to log in
            </span>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
