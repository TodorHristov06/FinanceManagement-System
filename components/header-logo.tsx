import Link from "next/link"; // Import Link component from Next.js for routing
import Image from "next/image"; // Import Image component from Next.js for optimized image handling

// HeaderLogo component that renders the logo and navigation link
export const HeaderLogo = () => {
    return (
        // Link component for navigating to the home page when the logo is clicked
        <Link href="/">
            {/* Wrapper div with responsive styling to show logo only on large screens */}
            <div className="items-center hidden lg:flex">
                {/* Image component for rendering the logo with specified dimensions and alt text */}
                <Image src="/logo.svg" height={28} width={28} alt="logo"/>
                {/* Logo text displayed next to the logo image */}
                <p className="font-semibold text-white text-2xl ml-2.5">
                    AtlasVault  {/* Name of the application */}
                </p>
            </div>
        </Link>
    )
}