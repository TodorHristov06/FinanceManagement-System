import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";

// Inferring the types for request and response from the Hono API endpoint
type ResponseType = InferResponseType<typeof client.api.transactions.$post>;
type RequestType = InferRequestType<typeof client.api.transactions.$post>["json"];

// Custom hook for handling transaction creation
export const useCreateTransaction = () => {
    const queryClient = useQueryClient();

    // Using the mutation hook to handle the transaction creation
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.transactions.$post({ json });
            return await response.json();
        }, 
        onSuccess: () => {
            toast.success("Transaction created");
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        onError: () => {
            toast.error("Failed to create transaction");
        },
    })

    return mutation; // Return the mutation object for use in components
}