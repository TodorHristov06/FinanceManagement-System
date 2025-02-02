"use client"

import { useGetSummary } from "@/features/summary/api/use-get-summary"
import { Chart, ChartLoading } from "@/components/chart";
import { SpendingPie, SpendingPieLoading } from "@/components/spending-pie";

// DataCharts component renders charts showing transaction summary and spending breakdown
export const DataCharts = () => {
    // Fetch summary data with loading state using custom hook
    const { data, isLoading } = useGetSummary();

    // If the data is still loading, show loading states for charts
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            <div className="col-span-1 lg:col-span-3 xl:col-span-4">
                <ChartLoading />
            </div>
            <div className="col-span-1 lg:col-span-3 xl:col-span-2">
                <SpendingPieLoading/>
            </div>
        </div>
        )
    }
    // When data is available, display the actual charts
    return (
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            <div className="col-span-1 lg:col-span-3 xl:col-span-4">
                <Chart data={data?.days} />
            </div>
            <div className="col-span-1 lg:col-span-3 xl:col-span-2">
                <SpendingPie data={data?.categories} />
            </div>
        </div>
    )
}

