import {  useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";

// Custom hook for fetching transaction details by its `id`
export const useGetTransaction = (id?: string) => {
    const query = useQuery({
        enabled: !!id, // Query runs only if `id` is provided
        queryKey: ["transaction", { id }], // Unique query key
        queryFn: async() => {
            const response = await client.api.transactions[":id"].$get({
                param: { id },
            })
            if (!response.ok) {
                throw new Error("Failed to fetch transaction");
            }
            const { data } = await response.json();
            return{
                ...data,
                amount: convertAmountFromMiliunits(data.amount),
            };
        }
    })

    // Returns the query object containing the status, data, and errors
    return query;
}
