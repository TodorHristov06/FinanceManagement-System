import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";

// Inferring the types for request and response from the Hono API endpoint
type ResponseType = InferResponseType<typeof client.api.categories["bulk-delete"]["$post"]>;
type RequestType = InferRequestType<typeof client.api.categories["bulk-delete"]["$post"]>["json"];

// Custom hook for handling bulk deletion of categories
export const useBulkDeleteCategories = () => {
    const queryClient = useQueryClient(); // React Query client for cache management

    // Using the mutation hook to handle the deletion
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.categories["bulk-delete"]["$post"]({ json });
            return await response.json();
        }, 
        onSuccess: () => {
            toast.success("Categories deleted");
            queryClient.invalidateQueries({ queryKey: ["categories"] });
            queryClient.invalidateQueries({ queryKey: ["summary"] }); 
        },
        onError: () => {
            toast.error("Failed to delete categories");
        },
    })

    return mutation; // Return the mutation object for use in components
}