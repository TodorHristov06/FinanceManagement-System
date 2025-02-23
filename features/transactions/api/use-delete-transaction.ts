import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";

// Defining the response type for the DELETE request
type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$delete"]>;

// Defining a hook for deleting an transaction
export const useDeleteTransaction = (id?: string) => {
    const queryClient = useQueryClient(); // Access to React Query's cache.

    // Initializing useMutation for the delete operation
    const mutation = useMutation<
        ResponseType,
        Error
    >({
        // Function to execute the API request
        mutationFn: async () => {
            const response = await client.api.transactions[":id"]["$delete"]({ 
                param: { id }
            }); 
            return await response.json();
        },
        // Handling successful deletion / cache refresh 
        onSuccess: () => {
            toast.success("Transaction deleted");
            queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        // Handling errors
        onError: () => {
            toast.error("Failed to delete transaction");
        },
    })

    return mutation; // Returning the configured useMutation hook.
}