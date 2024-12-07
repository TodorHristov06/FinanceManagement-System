// Importing the `useQuery` hook from react-query for managing data fetching
import {  useQuery } from "@tanstack/react-query";
// Importing the API client to handle requests
import { client } from "@/lib/hono";

// Custom hook for fetching all accounts
export const useGetAccounts = () => {
    const query = useQuery({ 
        queryKey: ["accounts"], // Unique key for caching and tracking the query
        queryFn: async() => {
            // Sends a GET request to the API to fetch all accounts
            const response = await client.api.accounts.$get()
            // Throws an error if the response is not successful
            if (!response.ok) {
                throw new Error("Failed to fetch accounts");
            }
            // Parses and returns the JSON data from the response
            const { data } = await response.json();
            return data;
        }
    })

    // Returns the query object containing the status, data, and errors
    return query;
}
