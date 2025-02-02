// Importing types and libraries
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client} from "@/lib/hono";

// Defining request and response types from the API endpoint
type ResponseType = InferResponseType<typeof client.api.accounts[":id"]["$patch"]>;
type RequestType = InferRequestType<typeof client.api.accounts[":id"]["$patch"]>["json"];

// Defining a hook for editing an account
export const useEditAccount = (id?: string) => {
    const queryClient = useQueryClient();
 
     // Initializing useMutation for the edit operation
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        // Function to execute the API request
        mutationFn: async (json) => {
            const response = await client.api.accounts[":id"]["$patch"]({ 
                param: { id },
                json
            });
            return await response.json();
        },
        onSuccess: () => {
            toast.success("Account updated");
            queryClient.invalidateQueries({ queryKey: ["account", { id }] });
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        onError: () => {
            toast.error("Failed to edit account");
        },
    })

    return mutation; // Returning the configured useMutation hook.
}