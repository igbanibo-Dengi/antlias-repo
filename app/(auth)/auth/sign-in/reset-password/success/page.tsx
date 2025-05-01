import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, ChevronLeft } from "lucide-react"
import Image from "next/image"

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

                    <div className="text-center mt-4">
                        <h2 className="text-lg w-6xl font-semibold">Password Reset Successful</h2>
                        <p className="text-muted-foreground text-sm">
                            Your password has been successfully reset. <br /> Click below to log in.
                        </p>
                    </div>

                    <div className="bg-muted h-px w-full max-w-md" />

                    <div className="space-y-4 w-full max-w-md mt-8">
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
    )
}