'use server'

import * as v from 'valibot'
import { SignupSchema } from "@/validators/signup-validator"
import bcrypt from 'bcrypt'
import db from '@/database/drizzle'
import { branches, lower, tenants, users } from '@/database/drizzle/schema'
import { eq } from 'drizzle-orm'
import { createVerificationTokenAction } from '../admin/create-verification-token-action'
import { headers } from 'next/headers'
import ratelimit from '@/lib/ratelimit'
import { sendEmail, workflowClient } from '@/lib/workflow'
import config from '@/lib/config'
import { sendForgotPasswordEmail } from '@/lib/emails/forgotPassword'
import { getWelcomeEmailHTML } from '@/lib/emails/WelcomeEmail'

type Res =
    | { success: true, redirectTo?: string }
    | { success: false; error: v.FlatErrors<undefined>; statusCode: 400, redirectTo?: string }
    | { success: false; error: string; statusCode: 409 | 500, redirectTo?: string }

export async function signUpAction(values: unknown): Promise<Res> {
    const parsedValues = v.safeParse(SignupSchema, values);

    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
    const { success } = await ratelimit.limit(ip);

    const productionUrl = config.env.prodApiEndpoint

    if (!success) {
        return {
            success: false,
            redirectTo: "/too-fast",
            error: "Too many requests",
            statusCode: 409,
        }
    }

    if (!parsedValues.success) {
        const flatErors = v.flatten(parsedValues.issues);
        console.log(flatErors)
        return { success: false, error: flatErors, statusCode: 400 }

    }
    const {
        // step 1
        email,
        password,
        //  step 2
        companyName,
        companyPhone,
        franchiseNumber,
        numberOfStations,
        // step 3
        branchName,
        branchAddress,
        branchCity,
        branchState,

    } = parsedValues.output;

    // Case-insensitive email handling in PostgreSQL with Drizzle
    try {
        const existingUser = await db
            .select({ id: users.id, email: users.email, emailVerified: users.emailVerified })
            .from(users)
            .where(eq(lower(users.email), email.toLowerCase()))
            .then(res => res[0] ?? null);

        if (existingUser?.id) {
            if (!existingUser.emailVerified) {
                const verificationToken = await createVerificationTokenAction(existingUser.email)
                // console.log('token', verificationToken.token, 'productionUrl', productionUrl);

                // send vefification email if user already exists

                const verifyEmailData = {
                    companyName,
                    token: verificationToken.token,
                    productionUrl,
                }

                await sendEmail({
                    email,
                    subject: "Welcome to Antlias 🎉",
                    message: getWelcomeEmailHTML(verifyEmailData),
                });


                return {
                    success: false,
                    error: "User exists, but is not verified. Verification link resent. Check your email",
                    statusCode: 409
                }
            } else {
                return { success: false, error: "A user with this email already exists", statusCode: 409 }
            }
        }
    } catch (err) {
        console.error(err);
        return { success: false, error: "Internal Server Error", statusCode: 500 };
    }

    // start transaction
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        // Step 1: Create tenant
        const newTenant = await db
            .insert(tenants)
            .values({
                name: companyName,
                contactPhone: companyPhone,
                franchiseNumber: franchiseNumber,
                numberOfStations: numberOfStations,
            })
            .returning()
            .then((res) => res[0]);

        if (!newTenant) throw new Error("Failed to create tenant");

        // Step 2: Create user
        const newUser = await db
            .insert(users)
            .values({
                email,
                password: hashedPassword,
                role: "tenant",
                isActive: true,
                tenantId: newTenant.id,
            })
            .returning()
            .then((res) => res[0]);

        if (!newUser) throw new Error("Failed to create user");

        // Step 3: Create branch
        const defaultBranch = await db
            .insert(branches)
            .values({
                tenantId: newTenant.id,
                name: branchName,
                address: branchAddress,
                city: branchCity,
                state: branchState,
                managerId: newUser.id,
                isActive: true,
                isHeadQuarters: true,
            })
            .returning()
            .then((res) => res[0]);

        if (!defaultBranch) throw new Error("Failed to create branch");


        // Step 4: Create verification token
        const verificationToken = await createVerificationTokenAction(
            newUser.email,
        );

        //  5tep 5:  Send welcome Email

        const verifyEmailData = {
            companyName,
            token: verificationToken.token,
            productionUrl,
        }

        await sendEmail({
            email,
            subject: "Welcome to Antlias 🎉",
            message: getWelcomeEmailHTML(verifyEmailData),
        });


        return { success: true };
    } catch (err) {
        console.error(err);
        return { success: false, error: "Internal Server Error", statusCode: 500 };
    }
}