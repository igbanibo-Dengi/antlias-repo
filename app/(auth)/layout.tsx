import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            <Button variant={"link"} className="absolute top-10 left-10" asChild>
                <Link href={"/"} className="text-2x; font-semibold"><ArrowLeft className="w-4 h-4" /> Home</Link>
            </Button>
            {children}
        </div>
    )
}