import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";

// Defining the types for request and response from the Hono API endpoint
type ResponseType = InferResponseType<typeof client.api.accounts["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.accounts["bulk-delete"]["$post"]>["json"];

// Custom hook for handling bulk deletion of accounts
export const useBulkDeleteAccounts = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.accounts["bulk-delete"]["$post"]({ json });
            return await response.json();
        }, 
        onSuccess: () => {
            toast.success("Accounts deleted");
            queryClient.invalidateQueries({ queryKey: ["accounts"] }); // Refresh accounts data
            //TODO: invalidate summary
        },
        onError: () => {
            toast.error("Failed to delete accounts");
        },
    })

    return mutation; // Return the mutation object for use in components
}