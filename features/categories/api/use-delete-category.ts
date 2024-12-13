// Importing types and libraries
import { InferRequestType, InferResponseType } from "hono"; // For extracting types from the Hono API client.
import { useMutation, useQueryClient } from "@tanstack/react-query"; // For managing async requests and caching.
import { toast } from "sonner"; // For displaying notifications.
import { client } from "@/lib/hono"; // Hono client for API interactions.

// Defining the response type for the DELETE request
type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$delete"]>;

// Defining a hook for deleting an category
export const useDeleteCategory = (id?: string) => {
    const queryClient = useQueryClient(); // Access to React Query's cache.

    // Initializing useMutation for the delete operation
    const mutation = useMutation<
        ResponseType, // Type for the response
        Error // Type for the error
    >({
        // Function to execute the API request
        mutationFn: async () => {
            // Executes a DELETE request to the API with the provided ID
            const response = await client.api.categories[":id"]["$delete"]({ 
                param: { id } // Passing the ID as a parameter.
            }); 
            return await response.json(); // Returning the JSON response.
        },
        // Handling successful deletion
        onSuccess: () => {
            toast.success("Category deleted"); // Displaying success notification.
            queryClient.invalidateQueries({ queryKey: ["category", { id }] }); // Refreshing the cache for the specific category.
            queryClient.invalidateQueries({ queryKey: ["categories"] }); // Refreshing the cache for the categories list.
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        // Handling errors
        onError: () => {
            toast.error("Failed to delete category"); // Displaying error notification.
        },
    })

    return mutation; // Returning the configured useMutation hook.
}