import { z } from "zod";  
import { Loader2 } from "lucide-react";
import { insertTransactionSchema } from "@/db/schema";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction";
import { useCreateTransaction } from "@/features/transactions/api/use-create-transaction";
import { useCreateCategory } from "@/features/categories/api/use-create-category";
import { useGetCategories } from "@/features/categories/api/use-get-categories";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";
import { TransactionForm } from "@/features/transactions/components/transaction-form";
import { scanReceipt } from "@/features/transactions/api/use-scan-receipt"; // Import the receipt scanning hook
import { useToast } from "@/hooks/use-toast"; // For toast notifications
import { useRef, MutableRefObject } from "react"; // Import useRef and MutableRefObject

// Defining the form schema, picking only the 'name' field for validation
const formSchema = insertTransactionSchema.omit({
  id: true,
});

// Defining the type of form values based on the schema
type FormValues = z.input<typeof formSchema>;

export const NewTransactionSheet = () => {
  const { isOpen, onClose } = useNewTransaction();
  const createMutation = useCreateTransaction();
  const categoryQuery = useGetCategories();
  const categoryMutation = useCreateCategory();
  const accountQuery = useGetAccounts();
  const accountMutation = useCreateAccount();
  const scan = scanReceipt;
  const { toast } = useToast();
  const transactionFormRef = useRef<{ prefillForm: (data: any) => void } | null>(null); // Create a ref for the TransactionForm

  const categoryOptions = (categoryQuery.data ?? []).map((category) => ({
    label: category.name,
    value: category.id,
  }));

  const accountOptions = (accountQuery.data ?? []).map((account) => ({
    label: account.name,
    value: account.id,
  }));

  const isPending = createMutation.isPending || categoryMutation.isPending || accountMutation.isPending;
  const isLoading = categoryQuery.isLoading || accountQuery.isLoading;

  const onSubmit = (values: FormValues) => {
    createMutation.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  const handleReceiptUpload = async (file: File) => {
    try {
      const receiptData = await scan(file);
      const formValues: FormValues = {
        amount: receiptData.amount,
        date: new Date(receiptData.date),
        payee: receiptData.payee,
        categoryId: categoryOptions.find(opt => opt.label.toLowerCase() === receiptData.category.toLowerCase())?.value || "",
        accountId: accountOptions[0]?.value || "",
        notes: receiptData.note,
      };

      // Prefill the form with the scanned receipt data
      if (transactionFormRef.current) {
        transactionFormRef.current.prefillForm(formValues); // Use formValues instead of receiptData
      }

      toast({
        title: "Receipt Scanned Successfully",
        description: `Amount: ${receiptData.amount}, Merchant: ${receiptData.payee}`,
      });
    } catch (error) {
      toast({
        title: "Error Scanning Receipt",
        description: "Failed to scan the receipt. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>New Transaction</SheetTitle>
          <SheetDescription>Add new transaction</SheetDescription>
        </SheetHeader>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 text-muted-foreground animate-spin" />
          </div>
        ) : (
          <TransactionForm
            ref={transactionFormRef}
            onSubmit={onSubmit}
            disabled={isPending}
            categoryOptions={categoryOptions}
            onCreateCategory={(name) => categoryMutation.mutate({ name })}
            accountOptions={accountOptions}
            onCreateAccount={(name) => accountMutation.mutate({ name })}
            onReceiptUpload={handleReceiptUpload}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};