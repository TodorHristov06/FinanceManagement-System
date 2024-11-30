// Importing the `useQuery` hook from react-query for managing data fetching
import {  useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
// Importing the API client to handle requests
import { client } from "@/lib/hono";

// Custom hook for fetching all transactions
export const useGetAccounts = () => {
    const params = useSearchParams();
    const from = params.get("from") || "";
    const to = params.get("to") || "";
    const accountId = params.get("account_id") || "";

    const query = useQuery({ 
        //TODO: Check if params are needed in the key
        queryKey: ["transactions", { from, to, accountId }], // Unique key for caching and tracking the query
        queryFn: async() => {
            // Sends a GET request to the API to fetch all transactions
            const response = await client.api.transactions.$get({
                query: {
                    from,
                    to,
                    accountId,
                }
            })
            // Throws an error if the response is not successful
            if (!response.ok) {
                throw new Error("Failed to fetch transactions");
            }
            // Parses and returns the JSON data from the response
            const { data } = await response.json();
            return data;
        }
    })

    // Returns the query object containing the status, data, and errors
    return query;
}
