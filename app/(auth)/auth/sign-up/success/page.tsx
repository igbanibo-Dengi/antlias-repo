import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function Page() {
  return (
    <div className="flex items-center justify-center w-screen h-screen p-4 bg-blue-100">
      <Card className="w-full text-center shadow-lg p-35 h-full m-2">
        <CardContent className="flex flex-col justify-center items-center h-full w-full space-y-4">
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

          <div className=" p-4 rounded-full bg-primary/10 text-primary">
            <div className=" p-4 rounded-full bg-primary/10 text-primary">
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

          <Link href="/auth/sign-up">
            <span className="text-blue-600 text-sm hover:underline">
              &lt; Back to log in
            </span>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
