"use client"

import React from 'react'
import { Button } from './ui/button'
import { signoutAction } from '@/lib/actions/auth/signout.actions'

const SignOutButton = () => {
    const onClickHandler = async () => {
        await signoutAction();
        window.location.href = "/"
    }

    return (
        <Button variant={"destructive"} onClick={onClickHandler}>Sign Out</Button>
    )
}
export default SignOutButton