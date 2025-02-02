import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { client } from "@/lib/hono";

// Inferring the types for request and response from the Hono API endpoint
type ResponseType = InferResponseType<typeof client.api.categories.$post>;
type RequestType = InferRequestType<typeof client.api.categories.$post>["json"];

// Custom hook for handling category creation
export const useCreateCategory = () => {
    const queryClient = useQueryClient(); // React Query client for cache management

    // Using the mutation hook to handle the category creation
    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const response = await client.api.categories.$post({ json });
            return await response.json();
        }, 
        onSuccess: () => {
            toast.success("Category created");
            queryClient.invalidateQueries({ queryKey: ["categories"] }); // Invalidate the categories query to refetch data
        },
        onError: () => {
            toast.error("Failed to create category");
        },
    })

    return mutation; // Return the mutation object for use in components
}