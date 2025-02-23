
import {  useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";

export const useGetSummary = () => {
    // Accessing query parameters from the URL using `useSearchParams` to customize the fetched data
    const params = useSearchParams();
    const from = params.get("from") || "";
    const to = params.get("to") || "";
    const accountId = params.get("accountId") || "";

    const query = useQuery({ 
        //TODO: Check if params are needed in the key
        // Defining a unique key for caching the query using the parameters
        queryKey: ["summary", { from, to, accountId }], 
        queryFn: async() => {
            const response = await client.api.summary.$get({
                query: {
                    from,
                    to,
                    accountId,
                }
            })
            if (!response.ok) {
                throw new Error("Failed to fetch summary");
            }

            // Parsing the response data
            const { data } = await response.json();

            // Returning the formatted summary data after converting amounts from miliunits
            return {
                ...data,
                incomeAmount: convertAmountFromMiliunits(data.incomeAmount),
                expensesAmount: convertAmountFromMiliunits(data.expensesAmount),
                remainingAmount: convertAmountFromMiliunits(data.remainingAmount),
                categories: data.categories.map((category: any) => ({
                    ...category,
                    value: convertAmountFromMiliunits(category.value),
                })),
                days: data.days.map((day: any) => ({
                    ...day,
                    income: convertAmountFromMiliunits(day.income),
                    expenses: convertAmountFromMiliunits(day.expenses),
                }))
            };
        }
    })

    return query;
}
