// Importing necessary libraries and components
import { z } from "zod";  // For schema validation
import { Loader2 } from "lucide-react";  // Loader icon from Lucide for showing loading state

import { CategoryForm } from "@/features/categories/components/category-form";  // The CategoryForm component for handling category details
import { useOpenCategory } from "@/features/categories/hooks/use-open-category";  // Custom hook to handle category opening logic   
import { useGetCategory } from "@/features/categories/api/use-get-category";  // Custom hook to fetch category data
import { useEditCategory } from "@/features/categories/api/use-edit-category";  // Custom hook for editing category
import { useDeleteCategory } from "@/features/categories/api/use-delete-category";  // Custom hook for deleting category
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";  // Custom sheet component for UI
import { insertCategorySchema } from "@/db/schema";  // Importing the schema for validation
import { useConfirm } from "@/hooks/use-confirm";  // Custom hook for confirmation dialogs

// Defining the schema for the form, only picking 'name' from the insertCategorySchema
const formSchema = insertCategorySchema.pick({
    name: true,
})
// Defining the type of form values based on the schema
type FormValues = z.input<typeof formSchema>


export const EditCategorySheet = () => {
    const { isOpen, onClose, id } = useOpenCategory(); // Using custom hook to open the category sheet and manage its state
    const [ConfirmDialog, confirm] = useConfirm("Are you sure>", "You are about to delete this category."); // Confirm dialog for deletion, initialized with a message
    const categoryQuery = useGetCategory(id) // Fetching category data for the given ID

    // Mutations for editing and deleting an category
    const editMutation = useEditCategory(id)
    const deleteMutation = useDeleteCategory(id)

    const isPending = editMutation.isPending || deleteMutation.isPending  // Checking if there is any pending action (edit or delete)
    const isLoading = categoryQuery.isLoading // Loading state for fetching category data

    // Handler for form submission to edit the category
    const onSubmit = (values: FormValues) => {
        // Trigger the mutation for editing the category
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose(); // Close the sheet on successful edit
            }
        });
    };
    // Handler for deleting the category
    const onDelete = async() => {
        // Show confirmation dialog before deleting
        const ok = await confirm();

        if (ok) {
            // Trigger the mutation for deleting the v
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose(); // Close the sheet on successful delete
                }
            });
        }
    }
    // Default values for the form, using the category data if available
    const defaultValues = categoryQuery.data ? {
        name: categoryQuery.data.name
    } : {
        name: ""
    };

    return (
        <>
            {/* Confirm dialog for delete category */}
            <ConfirmDialog />
            {/* The Sheet component for displaying the category form */}
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    {/* Header for the sheet */}
                    <SheetHeader>
                        <SheetTitle>
                            Edit category
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing category 
                        </SheetDescription>
                    </SheetHeader>

                     {/* Loading state or the category form */}
                    {isLoading 
                        ?(
                            <div className="absolute inset-0 flex items-center justify-center" >
                                <Loader2 className="size-4 text-muted-foreground animate-spin" />
                            </div> 
                        ) : (
                            <CategoryForm 
                                id={id}
                                onSubmit={onSubmit}  // Handler for form submission
                                disabled={isPending}  // Disable form if any mutation is in progress
                                defaultValues={defaultValues}  // Set the default values from category data
                                onDelete={onDelete}  // Handler for delete category
                            />
                        )
                    }  
                </SheetContent>
            </Sheet>
        </> 
    );
};