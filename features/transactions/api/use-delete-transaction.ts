// Importing types and libraries
import { InferRequestType, InferResponseType } from "hono"; // For extracting types from the Hono API client.
import { useMutation, useQueryClient } from "@tanstack/react-query"; // For managing async requests and caching.
import { toast } from "sonner"; // For displaying notifications.
import { client } from "@/lib/hono"; // Hono client for API interactions.

// Defining the response type for the DELETE request
type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$delete"]>;

// Defining a hook for deleting an transaction
export const useDeleteAccount = (id?: string) => {
    const queryClient = useQueryClient(); // Access to React Query's cache.

    // Initializing useMutation for the delete operation
    const mutation = useMutation<
        ResponseType, // Type for the response
        Error // Type for the error
    >({
        // Function to execute the API request
        mutationFn: async () => {
            // Executes a DELETE request to the API with the provided ID
            const response = await client.api.transactions[":id"]["$delete"]({ 
                param: { id } // Passing the ID as a parameter.
            }); 
            return await response.json(); // Returning the JSON response.
        },
        // Handling successful deletion
        onSuccess: () => {
            toast.success("Transaction deleted"); // Displaying success notification.
            queryClient.invalidateQueries({ queryKey: ["transaction", { id }] }); // Refreshing the cache for the specific transaction.
            queryClient.invalidateQueries({ queryKey: ["transactions"] }); // Refreshing the cache for the transactions list.
            //TODO: invalidate summary and transactions
        },
        // Handling errors
        onError: () => {
            toast.error("Failed to delete transaction"); // Displaying error notification.
        },
    })

    return mutation; // Returning the configured useMutation hook.
}