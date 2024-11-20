import { HeaderLogo } from "@/components/header-logo";  // Importing HeaderLogo component to display logo
import { Navigation } from "@/components/navigation";  // Importing Navigation component for menu items
import { UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";  // Importing Clerk authentication components
import { Loader2 } from "lucide-react";  // Importing Loader2 icon for loading state
import { WelcomeMSG } from "@/components/welcome-msg";  // Importing WelcomeMSG component to display a welcome message

// Header component for the top section of the page
export const Header = () => {
    return (
        <header className="bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 lg:px-14 pb-36">
            {/* Container to center the content and set maximum width */}
            <div className="max-w-screen-2xl mx-auto">
                {/* Flex container for logo, navigation, and user button */}
                <div className="w-full flex items-center justify-between mb-14">
                    {/* Left side of the header with logo and navigation */}
                    <div className="flex items-center lg:gap-x-16">
                        <HeaderLogo />  {/* Displaying the header logo */}
                        <Navigation />  {/* Displaying the navigation menu */}
                    </div>
                     {/* ClerkLoaded is a wrapper that renders the UserButton once Clerk authentication is fully loaded */}
                    <ClerkLoaded>
                    <UserButton afterSignOutUrl="/" // Redirecting to home page after sign out
                    appearance={{
                        layout: {
                            unsafe_disableDevelopmentModeWarnings: true,   // Disabling development warnings for UserButton
                        },
                    }} />
                    </ClerkLoaded>
                    {/* ClerkLoading shows a loading spinner while the Clerk authentication is still loading */}
                    <ClerkLoading>
                        <Loader2 className="size-8 animate-spin text-slate-400"/>
                    </ClerkLoading>
                </div>
                 {/* WelcomeMSG component that displays a personalized welcome message */}
                <WelcomeMSG />
            </div>
        </header>
    );
};