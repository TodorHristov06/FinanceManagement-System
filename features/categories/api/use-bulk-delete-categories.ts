import { InferRequestType, InferResponseType } from "hono"; // Importing helpers for type inference
import { useMutation, useQueryClient } from "@tanstack/react-query"; // Importing React Query hooks
import { toast } from "sonner"; // Importing toast notifications
import { client } from "@/lib/hono"; // Importing the Hono API client

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
            const response = await client.api.categories["bulk-delete"]["$post"]({ json }); // Sending the API request
            return await response.json(); // Parsing the response JSON
        }, 
        onSuccess: () => {
            toast.success("Categories deleted"); // Show success toast on deletion
            queryClient.invalidateQueries({ queryKey: ["categories"] }); // Invalidate the categories query to refetch data
            queryClient.invalidateQueries({ queryKey: ["summary"] }); 
        },
        onError: () => {
            toast.error("Failed to delete categories"); // Show error toast on failure
        },
    })

    return mutation; // Return the mutation object for use in components
}