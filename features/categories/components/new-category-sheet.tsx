// Importing necessary libraries and components
import { useNewCategory } from "@/features/categories/hooks/use-new-category";  // Custom hook to manage the opening of the New Category sheet
import { CategoryForm } from "@/features/categories/components/category-form";// The CategoryForm component for creating new categories
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";  // UI components for sheet layout
import { insertCategorySchema } from "@/db/schema";  // Importing the schema for category data validation
import { z } from "zod";  // For schema validation using Zod
import { useCreateCategory } from "@/features/categories/api/use-create-category";  // Custom hook to handle category creation

// Defining the form schema, picking only the 'name' field for validation
const formSchema = insertCategorySchema.pick({
    name: true,
})
// Defining the type of form values based on the schema
type FormValues = z.input<typeof formSchema>


export const NewCategorySheet = () => {
    // Using custom hook to manage the visibility of the New Category sheet
    const { isOpen, onClose } = useNewCategory();
    // Mutation hook for creating a new category
    const mutation = useCreateCategory();
    // Form submission handler to create a new category
    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose(); // Close the sheet on successful category creation
            }
        });
    };
    return (
        // The Sheet component that contains the form for creating a new category
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New category
                    </SheetTitle>
                    <SheetDescription>
                        Create a new category to organize your transactions.    
                    </SheetDescription>
                </SheetHeader>
                 {/* The CategoryForm component used for category creation, passing necessary props */}
                <CategoryForm 
                    onSubmit={onSubmit}  // Handler for form submission
                    disabled={mutation.isPending}  // Disable form inputs if the mutation is pending
                    defaultValues={{ name: "" }}  // Default values for the form (empty name field)
                />
            </SheetContent>
        </Sheet> 
    );
};