import { auth } from '@/auth'
import SignOutButton from '@/components/SignOutButton';
import { Button } from '@/components/ui/button';
import { type User } from 'next-auth';
import Link from 'next/link';
import React from 'react'
import { UpdateUserForm } from './_components/update-user-form';
import { findUserByAuth } from '@/resources/user.queries';
import { USER_ROLES } from '@/lib/constants';
import { LockIcon } from 'lucide-react';

const page = async () => {
    const session = await auth()
    const isAdmin = session?.user?.role === USER_ROLES.ADMIN

    return (
        <main className='mt-4'>
            <div className='container'>
                <span className='flex items-center justify-between'>
                    <h1 className="text-3xl font-bold tracking-light">Profile</h1>
                    {isAdmin &&
                        <Button size={"lg"} asChild>
                            <Link href={"/dashboard"}>
                                <LockIcon className='mr-2' />
                                Admin Dashboard
                            </Link>
                        </Button>
                    }
                </span>
                <div className="my-4 h-1 bg-muted" />
                {!!session?.user ? <SignedIn user={session.user} /> : <SignedOut />}
            </div>
        </main>
    )
}

export default page


const SignedIn = async ({ user }: { user: User }) => {
    // ***IF YOU WANT TO GET THE USER FROM THE DATABASE VIA AUTH***
    const dbUser = await findUserByAuth()

    return (
        <>
            <div className='flex items-center justify-between'>
                <h2 className='text-2xl font-bold tracking-tight'>User Information</h2>
                <UpdateUserForm user={user} />
            </div>
            <table className='mt-4 table-auto divide-y'>
                <thead>
                    <tr className=' divide-x'>
                        <th className='bg-gray-50 px-6 py-3 text-start'>name</th>
                        <th className='bg-gray-50 px-6 py-3 text-start'>email</th>
                        <th className='bg-gray-50 px-6 py-3 text-start'>role</th>
                        <th className='bg-gray-50 px-6 py-3 text-start'>id</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className='divide-x'>
                        <td className='px-6 py-3'>{dbUser.name || null}</td>
                        <td className='px-6 py-3'>{dbUser.email}</td>
                        <td className='px-6 py-3'>{dbUser.role}</td>
                        <td className='px-6 py-3'>{dbUser.id || null}</td>
                    </tr>
                </tbody>
            </table>
            <div className="my-4 h-1 bg-muted" />
            <SignOutButton />
        </>
    )
}

const SignedOut = () => {
    return (
        <>
            <h2 className='text-2xl font-bold tracking-tight'>User not signed in</h2>
            <div className='my-2 bg-muted' />

            <Button asChild>
                <Link href="/auth/sign-in">Sign In</Link>
            </Button>
        </>

    )
}
