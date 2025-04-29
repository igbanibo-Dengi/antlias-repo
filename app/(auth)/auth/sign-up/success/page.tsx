import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function Page() {
    return (
        <main className="h-full w-full">
            <div className="flex h-screen w-full items-center justify-center">
                <div className="flex h-full w-full flex-col items-center justify-center md:border-r-2 gap-6 lg:w-1/2 p-8">
                    <div className="text-center space-y-4">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                        <h1 className="text-3xl font-bold tracking-tight">Sign Up Successful</h1>
                    </div>

                    <div className="bg-muted h-px w-full max-w-md" />

                    <div className="text-center space-y-2">
                        <p className="text-xl font-semibold">Verification email has been sent!</p>
                        <p className="text-muted-foreground">Please check your email to verify your account.</p>
                    </div>

                    <div className="bg-muted h-px w-full max-w-md" />

                    <div className="space-y-4 w-full max-w-md">
                        <Button variant="default" className="w-full" asChild>
                            <Link href="/auth/sign-in">Go to Sign In</Link>
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