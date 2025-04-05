"use client";

import { usePathname, useRouter } from "next/navigation";
import { NavButton } from "@/components/nav-button";
import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMedia } from "react-use";
import { Button } from "@/components/ui/button";
 
// Navigation routes
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
        href: "/work-calculator",
        label: "Work Calculator",
    }
    // {
    //     href: "/settings",
    //     label: "Settings",
    // },
];

export const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);  // State to manage the opening/closing of the mobile menu
    const router = useRouter();  // Next.js router for navigation
    const pathname = usePathname();  // Current path in the URL
    const isMobile = useMedia("(max-width: 1024px)", false);  // Check if the screen width is under 1024px (mobile)

    //console.log({ isMobile})

    const onClick = (href: string) => {
        router.push(href);  // Navigate to the route
        setIsOpen(false);  // Close menu on navigation
    }

    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={setIsOpen}> 
                <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="font-normal bg-white/10 hover:text-white border-none 
                    focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition">
                        <Menu className="size-4"/>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="px-2"> 
                    <nav className="flex flex-col gap-y-2 pt-6">
                        {routes.map((route) => (
                            <Button key={route.href} variant={route.href === pathname ? "secondary" : "ghost"} onClick={() => onClick(route.href)} className="w-full justify-start"> {/* Change button style if the route is active */}
                                {route.label}
                            </Button>
                        ))}
                    </nav>
                </SheetContent> 
            </Sheet>
        )
    }

     // Desktop navigation: Show horizontal list of NavButton components
    return (
        <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
           {routes.map((route) => (
               <NavButton key={route.href} href={route.href} label={route.label} isActive={pathname === route.href}/> // Render NavButton for each route 
           ))}
        </nav>
    )
}