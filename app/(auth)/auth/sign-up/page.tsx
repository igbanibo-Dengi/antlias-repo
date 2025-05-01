import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { SignupForm } from "../_components/SignUpForm";

const SignUpPage = () => {
  return (
    // <div className="grid lg:grid-cols-5 w-screen h-screen overflow-hidden">
    //   <div className="col-span-2 w-full hidden lg:flex justify-center items-center">
    //     <div className="w-[70%] h-[90%] relative">
    //       <Image
    //         src="/images/auth_image.png"
    //         alt="Illustration"
    //         // width={600}
    //         // height={600}
    //         fill
    //         priority
    //       />
    //     </div>
    //   </div>

    //   <div className="relative flex flex-col items-center justify-center h-full col-span-3 w-full">
    //     <div className="flex flex-col gap-4">
    //       <div className="flex  gap-4 items-center">
    //         <div className="flex items-center gap-2 ml-4.5">
    //           <Image
    //             src="/icons/Logo.svg"
    //             alt="logo"
    //             width={20}
    //             height={20}
    //             priority
    //           />
    //           <h2 className="text-xl font-semibold">Antlias</h2>
    //         </div>
    //       </div>

    //       <div className="flex flex-col justify-center w-full max-w-md xl ">
    //         <SignupForm />
    //         <Button
    //           variant={"link"}
    //           className="text-muted-foreground"
    //           asChild
    //         >
    //           <Link href="/auth/sign-up" className="text-center w-full">
    //             Don&apos;t have an account?<span className="text-primary ml-1"> Sign Up</span>
    //           </Link>
    //         </Button>
    //       </div>
    //     </div>
    //   </div>
    // </div>

    <SignupForm />
  );
};

export default SignUpPage;
