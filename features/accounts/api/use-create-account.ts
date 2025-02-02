import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";

// Defining the types for request and response from the Hono API endpoint
type ResponseType = InferResponseType<typeof client.api.accounts.$post>;
type RequestType = InferRequestType<typeof client.api.accounts.$post>["json"];

// Hook for account creation
export const useCreateAccount = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.accounts.$post({ json });
            return await response.json();
        }, 
        onSuccess: () => {
            toast.success("Account created");
            queryClient.invalidateQueries({ queryKey: ["accounts"] }); // Refresh accounts data
        },
        onError: () => {
            toast.error("Failed to create account");
        },
    })

    return mutation; // Return the mutation object for use in components
}