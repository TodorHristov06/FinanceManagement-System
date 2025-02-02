import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client} from "@/lib/hono";

// Response and request types for the PATCH request
type ResponseType = InferResponseType<typeof client.api.transactions[":id"]["$patch"]>; 
type RequestType = InferRequestType<typeof client.api.transactions[":id"]["$patch"]>["json"];

// Defining a hook for editing an transaction
export const useEditTransaction = (id?: string) => {
    const queryClient = useQueryClient();
 
     // Initializing useMutation for the edit operation
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        // Function to execute the API request
        mutationFn: async (json) => {
            const response = await client.api.transactions[":id"]["$patch"]({ 
                param: { id },
                json
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Transaction updated");
            queryClient.invalidateQueries({ queryKey: ["transaction", { id }] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] }); 
            queryClient.invalidateQueries({ queryKey: ["summary"] }); 
        },
        onError: () => {
            toast.error("Failed to edit transaction");
        },
    })

    return mutation; // Returning the configured useMutation hook.
}