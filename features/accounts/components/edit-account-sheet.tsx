// Importing necessary libraries and components
import { z } from "zod";
import { AccountForm } from "@/features/accounts/components/account-form";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { useGetAccount } from "@/features/accounts/api/use-get-account";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { insertAccountSchema } from "@/db/schema";
import { Loader2 } from "lucide-react";
import { useEditAccount } from "@/features/accounts/api/use-edit-account";
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";
import { useConfirm } from "@/hooks/use-confirm";

// Defining the schema for the form, only picking 'name' from the insertAccountSchema
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
    
    // Form submission handler for editing account
    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        });
    };
    // Handler for deleting the account
    const onDelete = async() => {
        const ok = await confirm();  // Show confirmation dialog before deleting

        if (ok) {
            // Trigger the mutation for deleting the account
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
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
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>
                            Edit account
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing account 
                        </SheetDescription>
                    </SheetHeader>

                    {isLoading 
                        ?(
                            <div className="absolute inset-0 flex items-center justify-center" >
                                <Loader2 className="size-4 text-muted-foreground animate-spin" />
                            </div> 
                        ) : (
                            <AccountForm 
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