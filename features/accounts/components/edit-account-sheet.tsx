// Importing necessary libraries and components
import { z } from "zod";  // For schema validation
import { AccountForm } from "@/features/accounts/components/account-form";  // The AccountForm component for handling account details
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";  // Custom hook to handle account opening logic
import { useGetAccount } from "@/features/accounts/api/use-get-account";  // Custom hook to fetch account data
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";  // Custom sheet component for UI
import { insertAccountSchema } from "@/db/schema";  // Importing the schema for validation
import { Loader2 } from "lucide-react";  // Loader icon from Lucide for showing loading state
import { useEditAccount } from "@/features/accounts/api/use-edit-account";  // Custom hook for editing account
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";  // Custom hook for deleting account
import { useConfirm } from "@/hooks/use-confirm";  // Custom hook for confirmation dialogs

// Defining the schema for the form, only picking 'name' from the insertAccountSchem
const formSchema = insertAccountSchema.pick({
    name: true,
})
// Defining the type of form values based on the schema
type FormValues = z.input<typeof formSchema>


export const EditAccountSheet = () => {
    // Using custom hook to open the account sheet and manage its state
    const { isOpen, onClose, id } = useOpenAccount();
    // Confirm dialog for deletion, initialized with a message
    const [ConfirmDialog, confirm] = useConfirm("Are you sure>", "You are about to delete this transaction.");
    // Fetching account data for the given ID
    const accountQuery = useGetAccount(id)
    // Mutations for editing and deleting an account
    const editMutation = useEditAccount(id)
    const deleteMutation = useDeleteAccount(id)
    // Checking if there is any pending action (edit or delete)
    const isPending = editMutation.isPending || deleteMutation.isPending
    // Loading state for fetching account data
    const isLoading = accountQuery.isLoading
    // Handler for form submission to edit the account
    const onSubmit = (values: FormValues) => {
        // Trigger the mutation for editing the account
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose(); // Close the sheet on successful edit
            }
        });
    };
    // Handler for deleting the account
    const onDelete = async() => {
        // Show confirmation dialog before deleting
        const ok = await confirm();

        if (ok) {
            // Trigger the mutation for deleting the account
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose(); // Close the sheet on successful delete
                }
            });
        }
    }
    // Default values for the form, using the account data if available
    const defaultValues = accountQuery.data ? {
        name: accountQuery.data.name
    } : {
        name: ""
    };

    return (
        <>
            {/* Confirm dialog for delete action */}
            <ConfirmDialog />
            {/* The Sheet component for displaying the account form */}
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    {/* Header for the sheet */}
                    <SheetHeader>
                        <SheetTitle>
                            Edit account
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing account 
                        </SheetDescription>
                    </SheetHeader>

                     {/* Loading state or the account form */}
                    {isLoading 
                        ?(
                            <div className="absolute inset-0 flex items-center justify-center" >
                                <Loader2 className="size-4 text-muted-foreground animate-spin" />
                            </div> 
                        ) : (
                            <AccountForm 
                                id={id}
                                onSubmit={onSubmit}  // Handler for form submission
                                disabled={isPending}  // Disable form if any mutation is in progress
                                defaultValues={defaultValues}  // Set the default values from account data
                                onDelete={onDelete}  // Handler for delete action
                            />
                        )
                    }  
                </SheetContent>
            </Sheet>
        </> 
    );
};