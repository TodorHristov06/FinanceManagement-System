// Importing necessary libraries and components
import { useNewAccounts } from "@/features/accounts/hooks/use-new-accounts";
import { AccountForm } from "@/features/accounts/components/account-form";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { insertAccountSchema } from "@/db/schema";
import { z } from "zod";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";

// Defining the form schema, picking only the 'name' field for validation
const formSchema = insertAccountSchema.pick({
    name: true,
})
// Defining the type of form values based on the schema
type FormValues = z.input<typeof formSchema>

export const NewAccountSheet = () => {
    const { isOpen, onClose } = useNewAccounts(); // Hook for managing sheet state
    const mutation = useCreateAccount(); // Mutation hook for creating a new account

    // Handler for form submission
    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose();
            }
        });
    };
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New account
                    </SheetTitle>
                    <SheetDescription>
                        Create a new account to track your transactions.    
                    </SheetDescription>
                </SheetHeader>
                <AccountForm 
                    onSubmit={onSubmit}
                    disabled={mutation.isPending}
                    defaultValues={{ name: "" }}
                />
            </SheetContent>
        </Sheet> 
    );
};