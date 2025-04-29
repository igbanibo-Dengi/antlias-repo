"use client"

import { Button } from "./ui/button"
import { GitHubIcon } from "./icons/auth.comp"
import { GoogleIcon } from "./icons/auth.comp"
import { oauthAction } from "@/lib/actions/auth/oauth.actions"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

type OAuthButtonsProps = {
    signup?: boolean
}

const OAuthButtons = ({ signup }: OAuthButtonsProps) => {
    const [errMessage, setErrMessage] = useState("");
    const searchParams = useSearchParams();
    const error = searchParams.get("error");

    useEffect(() => {
        if (!error) return;

        if (error === "OAuthAccountNotLinked") {
            setErrMessage("This account is already in use. Please sign in.");
        } else {
            setErrMessage("An error occured. Please try again.");
        }
    }, [error]);

    const handleCLick = async (provider: "google" | "github") => {
        try {
            await oauthAction(provider);
        } catch (err) {
            console.log(err);
        }
    };

    const text = signup ? "Sign up" : "Sign in"

    return (
        <div>
            <div className="mb-4">
                <p className="text-center text-muted-foreground font-semibold">or</p>
            </div>
            <div className="md:max-w-[600px] px-10 md:px-20 mx-auto flex gap-4 ">
                <Button
                    onClick={handleCLick.bind(null, "google")}
                    // onClick={() => handleCLick("google")}
                    variant={"outline"}
                    className="w-full flex items-center gap-4"
                >
                    <GoogleIcon />
                    {/* {text} with Google */}
                </Button>
                <Button
                    onClick={handleCLick.bind(null, "github")}
                    // onClick={() => handleCLick("github")}
                    variant={"outline"}
                    className="w-full flex items-center gap-4"
                >
                    <GitHubIcon />
                    {/* {text} with GitHub */}
                </Button>
                {errMessage && (
                    <p className="mt-2 text-sm font-medium text-destructive text-center">
                        {errMessage}
                    </p>
                )}
            </div>
        </div>
    )
}

export default OAuthButtons

type OAuthButtonsSkeletonProps = OAuthButtonsProps

export const OAuthButtonsSkeleton = ({ signup }: OAuthButtonsSkeletonProps) => {

    const text = signup ? "Sign-up" : "Sign in"
    return (
        <div className="w-[410px] flex flex-col gap-4">
            <Button
                variant={"outline"}
                className="w-full flex items-center gap-4"
            >
                <GoogleIcon />
                {text} with Google
            </Button>
            <Button
                variant={"outline"}
                className="w-full flex items-center gap-4"
            >
                <GitHubIcon />
                {text} with GitHub
            </Button>
        </div>
    )
}