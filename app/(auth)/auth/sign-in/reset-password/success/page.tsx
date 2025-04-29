import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function ResetPasswordConfirmation() {
    return (
        <main className="h-full w-full">
            <div className="flex h-screen w-full items-center justify-center">
                <div className="flex h-full w-full flex-col items-center justify-center md:border-r-2 gap-6 lg:w-1/2 p-8">
                    <div className="text-center space-y-4">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                        <h1 className="text-3xl font-bold tracking-tight">Password Reset Successful</h1>
                    </div>

                    <div className="bg-muted h-px w-full max-w-md" />

                    <div className="text-center space-y-2">
                        <p className="text-xl font-semibold">Your password has been successfully reset!</p>
                        <p className="text-muted-foreground">You can now sign in with your new password.</p>
                    </div>

                    <div className="bg-muted h-px w-full max-w-md" />

                    <div className="space-y-4 w-full max-w-md">
                        <Button variant="default" className="w-full" asChild>
                            <Link href="/auth/sign-in">Sign In</Link>
                        </Button>
                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/">Back to Home</Link>
                        </Button>
                    </div>
                </div>
                <div className="hidden h-screen lg:flex lg:w-1/2 bg-muted"></div>
            </div>
        </main>
    )
}