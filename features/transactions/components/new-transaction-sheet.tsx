// Importing necessary libraries and components
import { z } from "zod";  // For schema validation using Zod
import { insertTransactionSchema } from "@/db/schema";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";  // UI components for sheet layout
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction"; // Custom hook to manage the opening of the New Transaction sheet
import { useCreateTransaction } from "@/features/transactions/api/use-create-transaction";  // Custom hook to handle transaction creation
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";

// Defining the form schema, picking only the 'name' field for validation
const formSchema = insertTransactionSchema.omit({
    id: true,
})
// Defining the type of form values based on the schema
type FormValues = z.input<typeof formSchema>


export const NewTransactionSheet = () => {
    // Using custom hook to manage the visibility of the New Transaction sheet
    const { isOpen, onClose } = useNewTransaction();
    // Mutation hook for creating a new transaction
    const mutation = useCreateTransaction();
    // Form submission handler to create a new transaction
    const categoryQuery = useGetCategories();
    const categoryMutation = useCreateCategory();
    const onCreateCategory = (name: string) => categoryMutation.mutate({ 
        name 
    });
    const categoryOptions = (categoryQuery.data ?? []).map((category) => ({ 
        label: category.name, 
        value: category.id 
    }));

    const accountQuery = useGetAccounts();
    const accountMutation = useCreateAccount();
    const onCreateAccount = (name: string) => accountMutation.mutate({ 
        name 
    });
    const accountOptions = (accountQuery.data ?? []).map((account) => ({ 
        label: account.name, 
        value: account.id 
    }));
    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
            onSuccess: () => {
                onClose(); // Close the sheet on successful transaction creation
            }
        });
    };
    return (
        // The Sheet component that contains the form for creating a new transaction
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Transaction
                    </SheetTitle>
                    <SheetDescription>
                        Add new transaction
                    </SheetDescription>
                </SheetHeader>
                <p> ToDo: Transaction Form</p>
            </SheetContent>
        </Sheet> 
    );
};