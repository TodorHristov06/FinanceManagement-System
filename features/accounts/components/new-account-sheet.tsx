// Importing necessary libraries and components
import { useNewAccounts } from "@/features/accounts/hooks/use-new-accounts";  // Custom hook to manage the opening of the New Account sheet
import { AccountForm } from "@/features/accounts/components/account-form";  // The AccountForm component for creating new accounts
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";  // UI components for sheet layout
import { insertAccountSchema } from "@/db/schema";  // Importing the schema for account data validation
import { z } from "zod";  // For schema validation using Zod
import { useCreateAccount } from "@/features/accounts/api/use-create-account";  // Custom hook to handle account creation

// Defining the form schema, picking only the 'name' field for validation
const formSchema = insertAccountSchema.pick({
    name: true,
})
// Defining the type of form values based on the schema
type FormValues = z.input<typeof formSchema>


export const NewAccountSheet = () => {
    // Using custom hook to manage the visibility of the New Account sheet
    const { isOpen, onClose } = useNewAccounts();
    // Mutation hook for creating a new account
    const mutation = useCreateAccount();
    // Form submission handler to create a new account
    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose(); // Close the sheet on successful account creation
            }
        });
    };
    return (
        // The Sheet component that contains the form for creating a new account
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
                 {/* The AccountForm component used for account creation, passing necessary props */}
                <AccountForm 
                    onSubmit={onSubmit}  // Handler for form submission
                    disabled={mutation.isPending}  // Disable form inputs if the mutation is pending
                    defaultValues={{ name: "" }}  // Default values for the form (empty name field)
                />
            </SheetContent>
        </Sheet> 
    );
};