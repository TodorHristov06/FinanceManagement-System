// Importing types and libraries
import { InferRequestType, InferResponseType } from "hono"; // For extracting types from the Hono API client.
import { useMutation, useQueryClient } from "@tanstack/react-query"; // For managing async requests and caching.
import { toast } from "sonner"; // For displaying notifications.
import { client} from "@/lib/hono"; // Hono client for API interactions.

// Defining the response type for the PATCH request
type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$patch"]>;
// Defining the request type for the PATCH request
type RequestType = InferRequestType<typeof client.api.transactions[":id"]["$patch"]>["json"];

// Defining a hook for editing an transaction
export const useEditTransaction = (id?: string) => {
    const queryClient = useQueryClient(); // Access to React Query's cache.
 
     // Initializing useMutation for the edit operation
    const mutation = useMutation<
        ResponseType, // Type for the response
        Error,        // Type for the error
        RequestType   // Type for the request payload
    >({
        // Function to execute the API request
        mutationFn: async (json) => {
            // Executes a PATCH request to the API with the provided ID and data
            const response = await client.api.transactions[":id"]["$patch"]({ 
                param: { id }, // Passing the ID as a parameter.
                json // Passing the JSON payload for the update.
            });
            return await response.json(); // Returning the JSON response.
        },
        // Handling successful update
        onSuccess: () => {
            toast.success("Transaction updated"); // Displaying success notification.
            queryClient.invalidateQueries({ queryKey: ["transaction", { id }] }); // Refreshing the cache for the specific transaction.
            queryClient.invalidateQueries({ queryKey: ["transactions"] }); // Refreshing the cache for the transactions list.
            //TODO: invalidate summary and transactions 
        },
        // Handling errors
        onError: () => {
            toast.error("Failed to edit transaction"); // Displaying error notification.
        },
    })

    return mutation; // Returning the configured useMutation hook.
}