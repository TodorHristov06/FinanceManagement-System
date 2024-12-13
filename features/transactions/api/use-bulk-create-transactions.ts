import { InferRequestType, InferResponseType } from "hono"; // Importing helpers for type inference
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Importing React Query hooks
import { toast } from "sonner"; // Importing toast notifications
import { client } from "@/lib/hono"; // Importing the Hono API client

// Inferring the types for request and response from the Hono API endpoint
type ResponseType = InferResponseType<typeof client.api.transactions["bulk-create"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.transactions["bulk-create"]["$post"]>["json"];

// Custom hook for handling bulk create of transactions
export const useBulkCreateTransactions = () => {
    const queryClient = useQueryClient(); // React Query client for cache management
    // Using the mutation hook to handle the creation
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.transactions["bulk-create"]["$post"]({ json }); // Sending the API request
            return await response.json(); // Parsing the response JSON
        }, 
        onSuccess: () => {
            toast.success("Transactions created"); // Show success toast on creation
            queryClient.invalidateQueries({ queryKey: ["transactions"] }); // Invalidate the transactions query to refetch data
            queryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        onError: () => {
            toast.error("Failed to create transactions"); // Show error toast on failure
        },
    })

    return mutation; // Return the mutation object for use in components
}