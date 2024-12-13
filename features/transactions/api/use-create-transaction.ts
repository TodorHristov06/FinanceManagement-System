import { InferRequestType, InferResponseType } from "hono"; // Import helpers for type inference
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import React Query hooks
import { toast } from "sonner"; // Import toast notifications
import { client } from "@/lib/hono"; // Import the Hono API client

// Inferring the types for request and response from the Hono API endpoint
type ResponseType = InferResponseType<typeof client.api.transactions.$post>;
type RequestType = InferRequestType<typeof client.api.transactions.$post>["json"];

// Custom hook for handling transaction creation
export const useCreateTransaction = () => {
    const queryClient = useQueryClient(); // React Query client for cache management

    // Using the mutation hook to handle the transaction creation
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.transactions.$post({ json }); // Sending the API request to create the transaction
            return await response.json(); // Parsing the response JSON
        }, 
        onSuccess: () => {
            toast.success("Transaction created"); // Show success toast on creation
            queryClient.invalidateQueries({ queryKey: ["transactions"] }); // Invalidate the transactions query to refetch data\
            queryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        onError: () => {
            toast.error("Failed to create transaction"); // Show error toast on failure
        },
    })

    return mutation; // Return the mutation object for use in components
}