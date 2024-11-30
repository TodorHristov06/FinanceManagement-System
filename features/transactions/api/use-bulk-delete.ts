import { InferRequestType, InferResponseType } from "hono"; // Importing helpers for type inference
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Importing React Query hooks
import { toast } from "sonner"; // Importing toast notifications
import { client } from "@/lib/hono"; // Importing the Hono API client

// Inferring the types for request and response from the Hono API endpoint
type ResponseType = InferResponseType<typeof client.api.accounts["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.accounts["bulk-delete"]["$post"]>["json"];

// Custom hook for handling bulk deletion of accounts
export const useBulkDeleteAccounts = () => {
    const queryClient = useQueryClient(); // React Query client for cache management
    // Using the mutation hook to handle the deletion
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.accounts["bulk-delete"]["$post"]({ json }); // Sending the API request
            return await response.json(); // Parsing the response JSON
        }, 
        onSuccess: () => {
            toast.success("Accounts deleted"); // Show success toast on deletion
            queryClient.invalidateQueries({ queryKey: ["accounts"] }); // Invalidate the accounts query to refetch data
            //TODO: invalidate summary
        },
        onError: () => {
            toast.error("Failed to delete accounts"); // Show error toast on failure
        },
    })

    return mutation; // Return the mutation object for use in components
}