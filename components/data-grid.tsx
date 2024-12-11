"use client"

import { useGetSummary } from "@/features/summary/api/use-get-summary"
import { FaPiggyBank } from "react-icons/fa"
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6"
import { formatDateRange } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import { Skeleton } from "./ui/skeleton"
import { DataCard } from "@/components/data-card"
import { Card, CardContent, CardHeader } from "./ui/card"
export const DataGrid = () => {
    const {data, isLoading} = useGetSummary();
    const params = useSearchParams()
    const to = params.get("to") || undefined
    const from = params.get("from") || undefined

    const dateRangeLabel = formatDateRange({ to, from })

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
                <DataCardLoading />
                <DataCardLoading />
                <DataCardLoading />
            </div>
        ) 
    }
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
            <DataCard
                title="Remaining"
                value={data?.remainingAmount}
                percentageChange={data?.remainingChange}
                icon={FaPiggyBank}
                variant="default"
                dateRange={dateRangeLabel}
            />
            <DataCard
                title="Income"
                value={data?.incomeAmount}
                percentageChange={data?.incomeChange}
                icon={FaArrowTrendUp}
                variant="default"
                dateRange={dateRangeLabel}
            />
            <DataCard
                title="Expenses"
                value={data?.remainingAmount}
                percentageChange={data?.expensesChange}
                icon={FaArrowTrendDown}
                variant="default"
                dateRange={dateRangeLabel}
            />
        </div>
    )
}


export const DataCardLoading = () => {
    return (
        <Card className="border-none drop-shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-x-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="size-12" />
            </CardHeader>
            <CardContent>
                <Skeleton className="shrink-0 h-10 w-24 mb-2" />
                <Skeleton className="shrink-0 h-4 w-40" />
            </CardContent>
        </Card>
    )
}