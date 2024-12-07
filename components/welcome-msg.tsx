"use client"

import { useUser } from "@clerk/nextjs"

export const WelcomeMSG = () => {
    const {user, isLoaded} = useUser(); // Getting the current user's data from Clerk

    return(
        <div className="space-y-2 mb-4"> {/* Wrapper div for spacing */}
            <h2 className="text-2xl lg:text-4xl text-white font-medium">
                Welcome Back{isLoaded ? ", " : ""}{user?.username} {/* Conditionally renders the comma if data is loaded */}
            </h2>
            <p className="text-sm lg:text-base text-[#89b6fd]">
                This is your Financial Overview Report {/* Subheading with a lighter color */}
            </p>
        </div>
    )
}