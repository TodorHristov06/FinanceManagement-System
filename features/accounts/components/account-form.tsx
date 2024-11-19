// Importing necessary libraries and components
import { z } from "zod";  // For schema validation
import { useForm } from "react-hook-form";  // React hook for managing forms
import { zodResolver } from "@hookform/resolvers/zod";  // Resolver for integrating Zod with react-hook-form
import { Trash } from "lucide-react";  // Trash icon from Lucide
import { Input } from "@/components/ui/input";  // Custom Input component
import { Button } from "@/components/ui/button";  // Custom Button component
import { insertAccountSchema } from "@/db/schema";  // Importing the schema for validation
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";  // Custom Form components

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
        resolver: zodResolver(formSchema), // Integrating Zod schema for validation
        defaultValues: defaultValues, // Setting default form values
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
                {/* Field for account name */}
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
                            disabled={disabled} // Disables the input if the disabled prop is true
                            placeholder="e.g Cash, Bank, Credit Card" 
                            {...field}/> // Connecting the input with react-hook-form's field
                        </FormControl>
                        <FormMessage /> {/* Display validation errors */}
                    </FormItem>
                )}/>
                {/* Submit button for creating or saving an account */}
                <Button className="w-full" disabled={disabled}>
                    {id ? "Save changes" : "Create account"}
                </Button>
                {/* Delete button for deleting the account, only visible if there's an ID */}
                {!!id && (<Button type="button" disabled={disabled} onClick={handleDelete} className="w-full" variant="outline">
                    <Trash className="size-4 mr-2"/> {/* Trash icon */}
                    Delete account
                </Button>)}
            </form>
        </Form>
    )
}