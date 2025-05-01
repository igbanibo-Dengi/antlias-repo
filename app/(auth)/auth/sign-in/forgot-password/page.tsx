import { Button } from "@/components/ui/button";
import { findVerificationTokenByToken } from "@/resources/verification-token-queries";
import Link from "next/link";
import { ResetPasswordForm } from "../../_components/reset-password-form";
import { KeyRound, XCircle } from "lucide-react";
import { ForgotPasswordForm } from "../../_components/forgot-password-form";


export default async function Page() {

    return (
        <div>
            <ForgotPasswordForm />
        </div>

    );
};