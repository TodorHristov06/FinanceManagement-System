import { Button } from "@/components/ui/button"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Props = {
    href: string  // The URL the button will navigate to
    label: string  // The text label displayed on the button
    isActive?: boolean  // Optional prop to indicate if the button is currently active
}
// NavButton component that renders a styled button with a link and optional active state
export const NavButton = ({href, label, isActive}: Props) => {
    return (
        <Button asChild  size="sm" variant="outline" className={cn(
            "w-full lg:w-auto justify-between font-normal hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition" ,
             isActive ? "bg-white/10 text-white" : "bg-transparent",)}>
            <Link href={href}>
                {label}
            </Link>
        </Button>
    )
}