import { InferRequestType, InferResponseType } from "hono"; // Import helpers for type inference
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Import React Query hooks
import { toast } from "sonner"; // Import toast notifications
import { client } from "@/lib/hono"; // Import the Hono API client

// Inferring the types for request and response from the Hono API endpoint
type ResponseType = InferResponseType<typeof client.api.accounts.$post>;
type RequestType = InferRequestType<typeof client.api.accounts.$post>["json"];

// Custom hook for handling account creation
export const useCreateAccount = () => {
    const queryClient = useQueryClient(); // React Query client for cache management

    // Using the mutation hook to handle the account creation
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.accounts.$post({ json }); // Sending the API request to create the account
            return await response.json(); // Parsing the response JSON
        }, 
        onSuccess: () => {
            toast.success("Account created"); // Show success toast on creation
            queryClient.invalidateQueries({ queryKey: ["accounts"] }); // Invalidate the accounts query to refetch data
        },
        onError: () => {
            toast.error("Failed to create account"); // Show error toast on failure
        },
    })

    return mutation; // Return the mutation object for use in components
}