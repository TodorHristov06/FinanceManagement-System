// Importing necessary libraries and components
import { z } from "zod";  // For schema validation
import { Loader2 } from "lucide-react";

import { CategoryForm } from "@/features/categories/components/category-form";
import { useOpenCategory } from "@/features/categories/hooks/use-open-category"; 
import { useGetCategory } from "@/features/categories/api/use-get-category";
import { useEditCategory } from "@/features/categories/api/use-edit-category";
import { useDeleteCategory } from "@/features/categories/api/use-delete-category";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { insertCategorySchema } from "@/db/schema";
import { useConfirm } from "@/hooks/use-confirm";

// Defining the schema for the form, only picking 'name' from the insertCategorySchema
const formSchema = insertCategorySchema.pick({
    name: true,
})
// Defining the type of form values based on the schema
type FormValues = z.input<typeof formSchema>


export const EditCategorySheet = () => {
    // Using custom hook to open the category sheet and manage its state
    const { isOpen, onClose, id } = useOpenCategory(); 

    // Confirm dialog for deletion, initialized with a message
    const [ConfirmDialog, confirm] = useConfirm("Are you sure>", "You are about to delete this category."); 
    const categoryQuery = useGetCategory(id) // Fetching category data for the given ID

    // Mutations for editing and deleting an category
    const editMutation = useEditCategory(id)
    const deleteMutation = useDeleteCategory(id)

    // Checking if there is any pending action (edit or delete)
    const isPending = editMutation.isPending || deleteMutation.isPending

    // Loading state for fetching category data
    const isLoading = categoryQuery.isLoading 

    // Handler for form submission to edit the category
    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        });
    };
    // Handler for deleting the category
    const onDelete = async() => {
        const ok = await confirm();         // Show confirmation dialog before deleting

        if (ok) {
            // Trigger the mutation for deleting the category
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
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
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>
                            Edit category
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing category 
                        </SheetDescription>
                    </SheetHeader>

                    {isLoading 
                        ?(
                            <div className="absolute inset-0 flex items-center justify-center" >
                                <Loader2 className="size-4 text-muted-foreground animate-spin" />
                            </div> 
                        ) : (
                            <CategoryForm 
                                id={id}
                                onSubmit={onSubmit}
                                disabled={isPending}
                                defaultValues={defaultValues}
                                onDelete={onDelete}
                            />
                        )
                    }  
                </SheetContent>
            </Sheet>
        </> 
    );
};