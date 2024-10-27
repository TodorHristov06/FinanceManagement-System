import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client} from "@/lib/hono";
type ResponceType = InferResponseType<typeof client.api.accounts.$post>;
type RequestType = InferRequestType<typeof client.api.accounts.$post>["json"];

export const useCreateAccount = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponceType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {
            const responce = await client.api.accounts.$post({ json });
            return await responce.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["accounts"] });
        },
        onError: () => {

        },
    })
}