import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertAccountSchema } from "@/db/schema";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";

// Defining the schema for the form, only picking 'name' from the insertAccountSchema
const formSchema = insertAccountSchema.pick({
    name: true,
})

// Defining the type of form values based on the schema
type FormValues = z.input<typeof formSchema>

// Defining the props for the AccountForm component
type Props = {
    id?: string;  // Optional account ID, used for updating existing accounts
    defaultValues?: FormValues;  // Default values for the form (optional)
    onSubmit: (values: FormValues) => void;  // Function to handle form submission
    onDelete?: () => void;  // Optional function to handle account deletion
    disabled?: boolean;  // Flag to disable form inputs and buttons
};
// AccountForm component definition
export const AccountForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
}: Props) => {
    // Using react-hook-form to handle the form state, with validation from Zod
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    })

    // Handle form submission
    const handleSubmit = (values: FormValues) => {
        onSubmit(values); // Calling the onSubmit function passed via props
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
                name="name" 
                control={form.control} 
                render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Name
                        </FormLabel>
                        <FormControl>
                            <Input 
                            disabled={disabled}
                            placeholder="e.g Cash, Bank, Credit Card" 
                            {...field}/> 
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