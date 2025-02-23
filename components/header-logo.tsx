import Link from "next/link"; // Import Link component from Next.js for routing
import Image from "next/image"; // Import Image component from Next.js for optimized image handling

// HeaderLogo component renders a logo and a navigation link to the home page
export const HeaderLogo = () => {
    return (
        // Link component navigates to the homepage when the logo is clicked
        <Link href="/">
            <div className="items-center hidden lg:flex">
                <Image src="/logo.svg" height={28} width={28} alt="logo"/>
                <p className="font-semibold text-white text-2xl ml-2.5">
                    AtlasVault
                </p>
            </div>
        </Link>
    )
}