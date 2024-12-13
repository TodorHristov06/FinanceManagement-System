// Importing the `useQuery` hook from react-query for managing data fetching
import {  useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
// Importing the API client to handle requests
import { client } from "@/lib/hono";
import { convertAmountFromMiliunits } from "@/lib/utils";

// Custom hook for fetching all transactions
export const useGetTransactions = () => {
    const params = useSearchParams();
    const from = params.get("from") || "";
    const to = params.get("to") || "";
    const accountId = params.get("accountId") || "";

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
            return data.map((transaction) => ({
                ...transaction,
                amount: convertAmountFromMiliunits(transaction.amount),
   
            }));
            // return data;
        }
    })

    // Returns the query object containing the status, data, and errors
    return query;
}
