import Image from "next/image"; // Importing Image component from Next.js for optimized image handling
import { Loader2 } from 'lucide-react'; // Importing Loader2 spinner icon from lucide-react
import { SignUp, ClerkLoaded, ClerkLoading } from '@clerk/nextjs'; // Importing Clerk authentication components

// Default export function for the Sign Up page
export default function Page() {
  return (
    // The main layout using CSS Grid to split the screen into two parts
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left section: Sign Up form */}
      <div className="h-full lg:flex flex-col items-center justify-center px-4">
        {/* Welcome text */}
        <div className="text-center space-y-4 pt-16">
          <h1 className="font-bold text-3xl text-[#2E2A47]">
            Welcome Back!
          </h1>
          <p className="text-base text-[#7E8CA0]">
            Log in or Create account to get back to your dashboard!
          </p>
        </div>
        {/* Sign Up form */}
        <div className="flex items-center justify-center mt-8"> 
          {/* ClerkLoaded: Display the SignUp component when Clerk is loaded */}
          <ClerkLoaded>
            <SignUp path="/sign-up" // Path for the SignUp component
            appearance={{
              layout: {
                unsafe_disableDevelopmentModeWarnings: true, // Disable development warnings for appearance
              },
            }} />
          </ClerkLoaded>
          {/* ClerkLoading: Show loading spinner while Clerk is loading */}
          <ClerkLoading>
            <Loader2 className="animate-spin text-muted-foreground" />
          </ClerkLoading>
        </div>
      </div>
      {/* Right section: Logo */}
      <div className="h-full bg-blue-600 hidden lg:flex items-center justify-center">
        <Image src="/logo.svg" height={100} width={100} alt="logo"/> {/* Display the logo on the right side */}
      </div>
    </div>  
  );
}