"use client"

import { useGetSummary } from "@/features/summary/api/use-get-summary"
import { FaPiggyBank } from "react-icons/fa"
import { formatDateRange } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import { DataCard } from "@/components/data-card"
export const DataGrid = () => {
    const {data} = useGetSummary();
    const params = useSearchParams()
    const to = params.get("to") || undefined
    const from = params.get("from") || undefined

    const dataRangeLabel = formatDateRange({ to, from })
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-2 mb-8">
            <DataCard
                title="Remaining"
                value={data?.remainingAmount}
                PercentageChange={data?.remainingChange}
                icon={FaPiggyBank}
                variant="default"
                dataRange={dataRangeLabel}
            />
        </div>
    )
}