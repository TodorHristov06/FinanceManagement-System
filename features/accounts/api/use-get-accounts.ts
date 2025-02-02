import {  useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

// Hook for fetching all accounts
export const useGetAccounts = () => {
    const query = useQuery({ 
        queryKey: ["accounts"], // Unique key for caching and tracking the query
        queryFn: async() => {
            const response = await client.api.accounts.$get()
            if (!response.ok) {
                throw new Error("Failed to fetch accounts");
            }

            const { data } = await response.json();
            return data;
        }
    })

    // Returns the query object containing the status, data, and errors
    return query;
}
