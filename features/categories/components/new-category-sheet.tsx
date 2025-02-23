// Importing necessary libraries and components
import { useNewCategory } from "@/features/categories/hooks/use-new-category";
import { CategoryForm } from "@/features/categories/components/category-form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { insertCategorySchema } from "@/db/schema";
import { z } from "zod";
import { useCreateCategory } from "@/features/categories/api/use-create-category";

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
                onClose();
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
                <CategoryForm 
                    onSubmit={onSubmit}
                    disabled={mutation.isPending}  // Disable form inputs if the mutation is pending
                    defaultValues={{ name: "" }}
                />
            </SheetContent>
        </Sheet> 
    );
};