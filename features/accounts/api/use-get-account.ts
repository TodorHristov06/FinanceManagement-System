// Importing the `useQuery` hook from react-query for managing data fetching
import {  useQuery } from "@tanstack/react-query";
// Importing the API client to handle requests
import { client } from "@/lib/hono";

// Custom hook for fetching account details by its `id`
export const useGetAccount = (id?: string) => {
    const query = useQuery({
        enabled: !!id, // Ensures the query is executed only if `id` is provided
        queryKey: ["account", { id }], // Unique key for caching and tracking the query
        queryFn: async() => {
             // Sends a GET request to the API to fetch account data for the provided `id`
            const response = await client.api.accounts[":id"].$get({
                param: { id },
            })
            // Throws an error if the response is not successful
            if (!response.ok) {
                throw new Error("Failed to fetch account");
            }
            // Parses and returns the JSON data from the response
            const { data } = await response.json();
            return data;
        }
    })

    // Returns the query object containing the status, data, and errors
    return query;
}
