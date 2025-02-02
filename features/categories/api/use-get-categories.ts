import {  useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

// Custom hook for fetching all categories
export const useGetCategories = () => {
    const query = useQuery({ 
        queryKey: ["categories"],
        queryFn: async() => {
            // Sends a GET request to the API to fetch all categories
            const response = await client.api.categories.$get()
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
