import { z } from "zod";  
import { Loader2 } from "lucide-react";  
import { TransactionForm } from "@/features/transactions/components/transaction-form";  
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";  
import { insertTransactionSchema } from "@/db/schema";  
import { useConfirm } from "@/hooks/use-confirm";  
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { useGetTransaction } from "@/features/transactions/api/use-get-transaction";
import { useEditTransaction } from "@/features/transactions/api/use-edit-transaction";  
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";  
import { date } from "drizzle-orm/mysql-core";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { ne } from "drizzle-orm";


// Defining the form schema for the transaction, excluding the id
const formSchema = insertTransactionSchema.omit({
    id: true,
})
type FormValues = z.input<typeof formSchema>


export const EditTransactionSheet = () => {
    // Open/close state and transaction ID from the custom hook
    const { isOpen, onClose, id } = useOpenTransaction();
    const [ConfirmDialog, confirm] = useConfirm("Are you sure>", "You are about to delete this transaction.");
    
    // Fetch transaction data using the ID
    const transactionQuery = useGetTransaction(id)

    // Mutation hooks for editing and deleting the transaction
    const editMutation = useEditTransaction(id)
    const deleteMutation = useDeleteTransaction(id)

    // Fetch categories and create new ones
    const categoryQuery = useGetCategories();
    const categoryMutation = useCreateCategory();
    const onCreateCategory = (name: string) => categoryMutation.mutate({ 
        name 
    });
    const categoryOptions = (categoryQuery.data ?? []).map((category) => ({ 
        label: category.name, 
        value: category.id 
    }));

    // Fetch accounts and create new ones
    const accountQuery = useGetAccounts();
    const accountMutation = useCreateAccount();
    const onCreateAccount = (name: string) => accountMutation.mutate({ 
        name 
    });
    const accountOptions = (accountQuery.data ?? []).map((account) => ({ 
        label: account.name, 
        value: account.id 
    }));

    // Checking if any of the mutations or queries are pending
    const isPending = 
    editMutation.isPending || 
    deleteMutation.isPending ||
    transactionQuery.isLoading ||
    categoryMutation.isPending ||
    accountMutation.isPending

    // Checking if any of the queries are loading
    const isLoading = 
        transactionQuery.isLoading ||
        categoryQuery.isLoading ||
        accountQuery.isLoading

    // Handling form submission to update the transaction
    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose(); 
            }
        });
    };

    // Handling deletion of the transaction with confirmation
    const onDelete = async() => {
        const ok = await confirm();
        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose(); 
                }
            });
        }
    }

    // Default form values when transaction data is available
    const defaultValues = transactionQuery.data ? {
        accountId: transactionQuery.data.accountId,
        categoryId: transactionQuery.data.categoryId,
        amount: transactionQuery.data.amount.toString(),
        date: transactionQuery.data.date 
            ? new Date(transactionQuery.data.date) 
            : new Date(),
        payee: transactionQuery.data.payee,
        notes: transactionQuery.data.notes
    } : {
        accountId: "",
        categoryId: "",
        amount: "",
        date: new Date(),
        payee: "",
        notes: ""
    };

    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>
                            Edit Transaction
                        </SheetTitle>
                        <SheetDescription>
                            Edit an existing transaction
                        </SheetDescription>
                    </SheetHeader>

                    {isLoading 
                        ?(
                            <div className="absolute inset-0 flex items-center justify-center" >
                                <Loader2 className="size-4 text-muted-foreground animate-spin" />
                            </div> 
                        ) : (
                            <TransactionForm 
                                id={id}
                                defaultValues={defaultValues}   
                                onSubmit={onSubmit}
                                onDelete={onDelete}
                                disabled={isPending}
                                categoryOptions={categoryOptions}
                                onCreateCategory={onCreateCategory}
                                accountOptions={accountOptions}
                                onCreateAccount={onCreateAccount}
                            />
                        )
                    }  
                </SheetContent>
            </Sheet>
        </> 
    );
};