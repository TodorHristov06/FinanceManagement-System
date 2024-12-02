// Importing necessary libraries and components
import { z } from "zod";  // For schema validation using Zod
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";  // UI components for sheet layout
import { insertTransactionSchema } from "@/db/schema";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction"; // Custom hook to manage the opening of the New Transaction sheet
import { useCreateTransaction } from "@/features/transactions/api/use-create-transaction";  // Custom hook to handle transaction creation

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