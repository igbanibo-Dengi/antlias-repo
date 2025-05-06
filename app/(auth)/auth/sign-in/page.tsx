'use client'

import { Button } from "@/components/ui/button";
import { SignInForm } from "../_components/SignInForm";
import Link from "next/link";
import Image from "next/image";
import heroImage from "../../../../public/images/auth_Image.webp"



const SignInPage = () => {
  return (
    <div className="grid h-screen w-screen overflow-hidden lg:grid-cols-5">
      <div className="col-span-2 hidden w-full items-center justify-center lg:flex">
        <div className="relative h-[90%] w-[70%]">
          <Image
            src={heroImage}
            alt="Illustration"
            fill
            priority
          />
        </div>
      </div>

      <div className="relative col-span-3 flex h-full w-full flex-col items-center justify-center">
        <div className="flex flex-col gap-4 xl:pr-20">
          <div className="flex items-center gap-4">
            <div className="ml-4.5 flex items-center gap-2">
              <Image
                src="/icons/Logo.svg"
                alt="logo"
                width={20}
                height={20}
              // priority
              />
              <h2 className="text-xl font-semibold">Antlias</h2>
            </div>
          </div>

          <div className="flex w-full flex-col justify-center md:min-w-[400px]">
            <SignInForm />
            <Button variant={"link"} className="text-muted-foreground" asChild>
              <Link href="/auth/sign-up" className="w-full text-center">
                Don&apos;t have an account?
                <span className="ml-1 text-primary"> Sign Up</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
