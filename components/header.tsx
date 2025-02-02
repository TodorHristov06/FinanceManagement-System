import { HeaderLogo } from "@/components/header-logo";  
import { Navigation } from "@/components/navigation";  
import { UserButton, ClerkLoading, ClerkLoaded } from "@clerk/nextjs";  
import { Loader2 } from "lucide-react";  
import { WelcomeMSG } from "@/components/welcome-msg";  
import { Filters } from "@/components/filters";

export const Header = () => {
    return (
        // Header container with gradient background and padding
        <header className="bg-gradient-to-b from-blue-700 to-blue-500 px-4 py-8 lg:px-14 pb-36">
            <div className="max-w-screen-2xl mx-auto">
                <div className="w-full flex items-center justify-between mb-14">
                    <div className="flex items-center lg:gap-x-16">
                        <HeaderLogo />  
                        <Navigation /> 
                    </div>
                    <ClerkLoaded>
                    <UserButton afterSignOutUrl="/" 
                    appearance={{
                        layout: {
                            unsafe_disableDevelopmentModeWarnings: true,   
                        },
                    }} />
                    </ClerkLoaded>
                    <ClerkLoading>
                        <Loader2 className="size-8 animate-spin text-slate-400"/>
                    </ClerkLoading>
                </div>
                <WelcomeMSG />
                <Filters/>
            </div>
        </header>
    );
};