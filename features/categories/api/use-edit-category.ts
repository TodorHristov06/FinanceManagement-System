// Importing types and libraries
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client} from "@/lib/hono";

// Inferring the types for request and response from the Hono API endpoint
type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$patch"]>;   
type RequestType = InferRequestType<typeof client.api.categories[":id"]["$patch"]>["json"];

// Defining a hook for editing an category
export const useEditCategory = (id?: string) => {
    const queryClient = useQueryClient();
 
     // Initializing useMutation for the edit operation
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.categories[":id"]["$patch"]({ 
                param: { id },
                json
            });
            return await response.json(); // Returning the JSON response.
        },
        // Handling successful update
        onSuccess: () => {
            toast.success("Category updated");
            queryClient.invalidateQueries({ queryKey: ["category", { id }] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        onError: () => {
            toast.error("Failed to edit category");
        },
    })

    return mutation; // Returning the configured useMutation hook.
}