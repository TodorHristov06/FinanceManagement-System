// Importing necessary libraries and components
import { z } from "zod";  // For schema validation
import { Trash } from "lucide-react";  // Trash icon from Lucide
import { useForm } from "react-hook-form";  // React hook for managing forms
import { zodResolver } from "@hookform/resolvers/zod";  // Resolver for integrating Zod with react-hook-form
import { Input } from "@/components/ui/input";  // Custom Input component
import { Button } from "@/components/ui/button";  // Custom Button component
import { Select } from "@/components/select";
import { insertTransactionSchema } from "@/db/schema";  // Importing the schema for validation
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";  // Custom Form components

const formSchema = z.object({
    date: z.coerce.date(),
    accountId: z.string(),
    categoryID: z.string().nullable().optional(),
    payee: z.string(),
    amount: z.number(), 
    notes: z.string().nullable().optional(),
})

const apiSchema = insertTransactionSchema.omit({
    id: true
})

type FormValues = z.input<typeof formSchema>
type ApiFormValues = z.input<typeof apiSchema>

type Props = {
    id?: string;  
    defaultValues?: FormValues;  
    onSubmit: (values: ApiFormValues) => void;  
    onDelete?: () => void;  
    disabled?: boolean;
    accountOptions: {label: string, value: string}[];
    categoryOptions: {label: string, value: string}[];
    onCreateAccount: (name: string) => void;
    onCreateCategory: (name: string) => void;
};

export const TransactionForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
    accountOptions,
    categoryOptions,
    onCreateAccount,
    onCreateCategory
}: Props) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema), 
        defaultValues: defaultValues, 
    })

    const handleSubmit = (values: FormValues) => {
        console.log({ values });
        //onSubmit(values); 
    }

    // Handle account deletion
    const handleDelete = () => {
        onDelete?.(); // If onDelete function is provided, it gets called
    }

    return (
        // The Form component is a wrapper for the react-hook-form
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
                <FormField 
                name="accountId" 
                control={form.control} 
                render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Account
                        </FormLabel>
                        <FormControl>
                            <Select
                             placeholder="Select an account"
                             options={accountOptions}
                             onCreate={onCreateAccount}
                             value={field.value}
                             onChange={field.onChange}
                             disabled={disabled}
                            />
                        </FormControl>
                        <FormMessage /> 
                    </FormItem>
                )}/>
                
                <Button className="w-full" disabled={disabled}>
                    {id ? "Save changes" : "Create account"}
                </Button>
                {!!id && (<Button type="button" disabled={disabled} onClick={handleDelete} className="w-full" variant="outline">
                    <Trash className="size-4 mr-2"/> 
                    Delete account
                </Button>)}
            </form>
        </Form>
    )
}