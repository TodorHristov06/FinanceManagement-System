"use client"

import { useUser } from "@clerk/nextjs"

export const WelcomeMSG = () => {
    const {user, isLoaded} = useUser();

    return(
        <div>
            <h2>
                Welcome Back
            </h2>
            <p>
                This is your Financial Overview Report
            </p>
        </div>
    )
}