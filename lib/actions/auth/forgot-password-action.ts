"use server";

import { findUserByEmail } from "@/resources/user.queries";
import { ForgotPasswordSchema } from "@/validators/forgot-password-validator";
import * as v from "valibot";
import { createVerificationTokenAction } from "../admin/create-verification-token-action";
import { sendEmail } from "@/lib/workflow";
import { sendForgotPasswordEmail } from "@/lib/emails/forgotPassword";
import { headers } from "next/headers";
import ratelimit from "@/lib/ratelimit";

type Res =
    | { success: true; redirectTo?: string }
    | { success: false; error: v.FlatErrors<undefined>; statusCode: 400; redirectTo?: string }
    | { success: false; error: string; statusCode: 401 | 500 | 409; redirectTo?: string };

export async function forgotPasswordAction(values: unknown): Promise<Res> {
    const parsedValues = v.safeParse(ForgotPasswordSchema, values);

    if (!parsedValues.success) {
        const flatErrors = v.flatten(parsedValues.issues);
        return { success: false, error: flatErrors, statusCode: 400 };
    }


    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
    const { success } = await ratelimit.limit(ip);

    if (!success) {
        return {
            success: false,
            redirectTo: "/too-fast",
            error: "Too many requests",
            statusCode: 409,
        }
    }


    const email = parsedValues.output.email;

    try {
        const existingUser = await findUserByEmail(email);

        // this is a false positive, to deter malicious users
        if (!existingUser?.id) return { success: true };

        if (!existingUser.password) {
            return {
                success: false,
                error: "This user was created with OAuth, please sign in with OAuth",
                statusCode: 401,
            };
        }

        const verificationToken = await createVerificationTokenAction(
            existingUser.email,
        );

        // await sendForgotPasswordEmail({
        //     email: existingUser.email,
        //     token: verificationToken.token,
        // });

        const token = verificationToken.token;

        await sendEmail({
            email,
            subject: "Reset or password 🎉",
            message: sendForgotPasswordEmail(token),
        });

        return { success: true };
    } catch (err) {
        console.error(err);
        return { success: false, error: "Internal Server Error", statusCode: 500 };
    }
}