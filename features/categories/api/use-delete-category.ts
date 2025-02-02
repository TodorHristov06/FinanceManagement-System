// Importing types and libraries
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";

// Defining the response type for the DELETE request
type ResponseType = InferResponseType<typeof client.api.categories[":id"]["$delete"]>;

// Defining a hook for deleting an category
export const useDeleteCategory = (id?: string) => {
    const queryClient = useQueryClient();

    // Initializing useMutation for the delete operation
    const mutation = useMutation<
        ResponseType,
        Error
    >({
        mutationFn: async () => {
            const response = await client.api.categories[":id"]["$delete"]({ 
                param: { id }
            }); 
            return await response.json();
        },
        // Handling successful deletion / Refreshing the cache
        onSuccess: () => {
            toast.success("Category deleted");
            queryClient.invalidateQueries({ queryKey: ["category", { id }] });
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["transactions"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] });
        },
        onError: () => {
            toast.error("Failed to delete category");
        },
    })

    return mutation; // Returning the configured useMutation hook.
}