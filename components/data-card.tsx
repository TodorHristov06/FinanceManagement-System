import { VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { IconType } from "react-icons/lib";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const boxVariant = cva(
    "rounded-md p-3",
    {
        variants: {
            variant: {
                default: "bg-blue-500/20",
                success: "bg-emerald-500/20",
                danger: "bg-rose-500/20",
                warning: "bg-amber-500/20",
            }
        },
        defaultVariants: {
            variant: "default",
        }
    }
)

const iconVariant = cva(
    "size-6",
    {
        variants: {
            variant: {
                default: "fill-blue-500/20",
                success: "fill-emerald-500/20",
                danger: "fill-rose-500/20",
                warning: "fill-amber-500/20",
            }
        },
        defaultVariants: {
            variant: "default",
        }
    }
)

type BoxVariants = VariantProps<typeof boxVariant>;
type IconVariants = VariantProps<typeof iconVariant>;

interface DataCardProps extends BoxVariants, IconVariants {
    icon: IconType;
    title: string;
    value?: number;
    dateRange: string;
    PercentageChange?: number;
    
}
export const DataCard = ({
    icon: Icon,
    title,
    value = 0,
    variant,
    dateRange,
    PercentageChange = 0,
}: DataCardProps) => {
    return(
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-x-4">
                <CardTitle className="text-2xl line-clamp-1">
                    {title}
                </CardTitle>
                <CardDescription className="line-clamp1">
                    {dateRange}
                </CardDescription>
            </CardHeader>
        </Card>
    )
}