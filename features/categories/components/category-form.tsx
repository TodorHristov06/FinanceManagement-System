// Importing necessary libraries and components
import { z } from "zod";  // For schema validation
import { useForm } from "react-hook-form";  // React hook for managing forms
import { zodResolver } from "@hookform/resolvers/zod";  // Resolver for integrating Zod with react-hook-form
import { Trash } from "lucide-react";  // Trash icon from Lucide
import { Input } from "@/components/ui/input";  // Custom Input component
import { Button } from "@/components/ui/button";  // Custom Button component
import { insertCategorySchema } from "@/db/schema";  // Importing the schema for validation
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";  // Custom Form components

// Defining the schema for the form, only picking 'name' from the insertCategorySchema
const formSchema = insertCategorySchema.pick({
    name: true,
})

// Defining the type of form values based on the schema
type FormValues = z.input<typeof formSchema>

// Defining the props for the CategoryForm component
type Props = {
    id?: string;  // Optional category ID, used for updating existing categories
    defaultValues?: FormValues;  // Default values for the form (optional)
    onSubmit: (values: FormValues) => void;  // Function to handle form submission
    onDelete?: () => void;  // Optional function to handle category deletion
    disabled?: boolean;  // Flag to disable form inputs and buttons
};
// CategoryForm component definition
export const CategoryForm = ({
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

    // Handle category deletion
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
                            placeholder="e.g Food, Travel, etc." 
                            {...field}/> 
                        </FormControl>
                        <FormMessage /> 
                    </FormItem>
                )}/>
                <Button className="w-full" disabled={disabled}>
                    {id ? "Save changes" : "Create category"}
                </Button>
                {!!id && (<Button type="button" disabled={disabled} onClick={handleDelete} className="w-full" variant="outline">
                    <Trash className="size-4 mr-2"/> 
                    Delete category
                </Button>)}
            </form>
        </Form>
    )
}