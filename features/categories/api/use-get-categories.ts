// Importing the `useQuery` hook from react-query for managing data fetching
import {  useQuery } from "@tanstack/react-query";
// Importing the API client to handle requests
import { client } from "@/lib/hono";

// Custom hook for fetching all categories
export const useGetCategories = () => {
    const query = useQuery({ 
        queryKey: ["categories"], // Unique key for caching and tracking the query
        queryFn: async() => {
            // Sends a GET request to the API to fetch all categories
            const response = await client.api.categories.$get()
            // Throws an error if the response is not successful
            if (!response.ok) {
                throw new Error("Failed to fetch categories");
            }
            // Parses and returns the JSON data from the response
            const { data } = await response.json();
            return data;
        }
    })

    // Returns the query object containing the status, data, and errors
    return query;
}
