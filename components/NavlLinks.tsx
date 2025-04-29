"use client"

import Link from "next/link"
import { Button } from "./ui/button"
import SignOutButton from "./SignOutButton"
import { useSession } from "next-auth/react"
import { Loader } from 'lucide-react'

export const NavlLinks = () => {
    const session = useSession()
    // console.log(session);
    switch (session.status) {
        case "unauthenticated":
            return <SignedOut />
        case "authenticated":
            return <SignedIn />
        case "loading":
            return <Loading />
        default:
            null
    }
    return <p>Hello</p>
}

const Loading = () => {
    return <p className="text-4xl font-bold"><Loader className="animate-spin" /></p>
}

export const SignedIn = () => {
    return (
        <div>
            <ul className="flex items-center gap-x-4">
                <li>
                    <Button size={"sm"} asChild>
                        <Link href="/profile">Profile</Link>
                    </Button>
                </li>
                <li>
                    <SignOutButton />
                </li>
            </ul>
        </div>
    )
}

export const SignedOut = () => {
    return (
        <div>
            <ul className="flex items-center gap-x-4">
                <li>
                    <Button variant={"outline"} size={"sm"} asChild>
                        <Link href="/auth/sign-in">Sign In</Link>
                    </Button>
                </li>
                <li>
                    <Button variant={"outline"} size={"sm"} asChild>
                        <Link href="/auth/sign-up">Sign Up</Link>
                    </Button>
                </li>
            </ul>
        </div>
    )
}
