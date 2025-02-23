import {  useQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

// Custom hook for fetching category details by its `id`
export const useGetCategory = (id?: string) => {
    const query = useQuery({
        enabled: !!id, // Ensures the query is executed only if `id` is provided
        queryKey: ["category", { id }],
        queryFn: async() => {
             // Sends a GET request to the API to fetch category data for the provided `id`
            const response = await client.api.categories[":id"].$get({
                param: { id },
            })
            if (!response.ok) {
                throw new Error("Failed to fetch category");
            }
            // Parses and returns the JSON data from the response
            const { data } = await response.json();
            return data;
        }
    })

    // Returns the query object containing the status, data, and errors
    return query;
}
