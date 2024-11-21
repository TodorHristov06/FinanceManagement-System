"use client";  // This file should be treated as a client-side component by Next.js

import { usePathname, useRouter } from "next/navigation";  // Hooks for accessing current URL pathname and programmatically navigating
import { NavButton } from "@/components/nav-button";  // Importing the NavButton component to render navigation buttons
import { useState } from "react";  // React hook for managing component state
import { Menu } from "lucide-react";  // Icons from lucide-react for the mobile menu button
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";  // Importing the Sheet component (likely a sliding drawer)
import { useMedia } from "react-use";  // Hook for detecting screen size (responsive behavior)
import { Button } from "@/components/ui/button";  // The Button component from your UI library
 
// Defining the routes for the navigation
const routes = [
    {
        href: "/",
        label: "Overview",
    },
    {
        href: "/transactions",
        label: "Transactions",
    },
    {
        href: "/accounts",
        label: "Accounts",
    },
    {
        href: "/categories",
        label: "Categories",
    },
    {
        href: "/settings",
        label: "Settings",
    },
];

export const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);  // State to manage the opening/closing of the mobile menu
    const router = useRouter();  // Next.js router for navigation
    const pathname = usePathname();  // Current path in the URL
    const isMobile = useMedia("(max-width: 1024px)", false);  // Check if the screen width is under 1024px (mobile)

    //console.log({ isMobile})

    const onClick = (href: string) => {
        router.push(href);  // Navigate to the route
        setIsOpen(false);  // Close the mobile menu after clicking a link
    }

    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={setIsOpen}> {/* Sheet component is used for mobile navigation */}
                <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="font-normal bg-white/10 hover:text-white border-none 
                    focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition">
                        <Menu className="size-4"/> {/* Menu icon for mobile */}
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="px-2"> {/* Sheet content that holds the menu */}
                    <nav className="flex flex-col gap-y-2 pt-6"> {/* Navigation list */}
                        {routes.map((route) => (
                            <Button key={route.href} variant={route.href === pathname ? "secondary" : "ghost"} onClick={() => onClick(route.href)} className="w-full justify-start"> {/* Change button style if the route is active */}
                                {route.label} {/* Label of the route */}
                            </Button>
                        ))}
                    </nav>
                </SheetContent> 
            </Sheet>
        )
    }

     // Desktop navigation: Show horizontal list of NavButton components
    return (
        <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">  {/* Navigation for larger screens */}
           {routes.map((route) => (
               <NavButton key={route.href} href={route.href} label={route.label} isActive={pathname === route.href}/> // Render NavButton for each route 
           ))}
        </nav>
    )
}