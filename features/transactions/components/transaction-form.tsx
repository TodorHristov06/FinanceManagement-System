import { z } from "zod";
import { Trash, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/select";
import { insertTransactionSchema } from "@/db/schema";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { AmountInput } from "@/components/amount-input";
import { convertAmountToMiliunits } from "@/lib/utils";
import { forwardRef, useImperativeHandle } from "react";
import { scanReceipt } from "../api/use-scan-receipt";

const formSchema = z.object({
  date: z.coerce.date(),
  accountId: z.string(),
  categoryId: z.string().nullable().optional(),
  payee: z.string(),
  amount: z.string(),
  notes: z.string().nullable().optional(),
});

const apiSchema = insertTransactionSchema.omit({
  id: true,
});

type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiSchema>;

type Props = {
  id?: string;
  defaultValues?: FormValues;
  onSubmit: (values: ApiFormValues) => void;
  onDelete?: () => void;
  disabled?: boolean;
  accountOptions: { label: string; value: string }[];
  categoryOptions: { label: string; value: string }[];
  onCreateAccount: (name: string) => void;
  onCreateCategory: (name: string) => void;
  onReceiptUpload?: (file: File) => void;
};

export const TransactionForm = forwardRef<{
  prefillForm: (data: any) => void;
} | null, Props>(({
  id,
  defaultValues,
  onSubmit,
  onDelete,
  disabled,
  accountOptions,
  categoryOptions,
  onCreateAccount,
  onCreateCategory,
  onReceiptUpload,
}, ref) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  useImperativeHandle(ref, () => ({
    prefillForm,
  }));

  const handleSubmit = (values: FormValues) => {
    const amount = parseFloat(values.amount);
    const amountInMiliunits = convertAmountToMiliunits(amount);
    console.log({ values });
  
    onSubmit({
      ...values,
      amount: amountInMiliunits,
    });
  };

  const handleDelete = () => {
    onDelete?.();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Show loading state if needed
      const receiptData = await scanReceipt(file);
      
      if (receiptData) {
        prefillForm(receiptData);
      }

      // Call the original onReceiptUpload if provided
      if (onReceiptUpload) {
        onReceiptUpload(file);
      }
    } catch (error) {
      console.error('Error processing receipt:', error);
      // Handle error (show toast notification, etc.)
    }
  };

  const prefillForm = (receiptData: {
    amount: number;
    date: Date;
    note: string; // Changed from description to note
    category: string;
    payee: string; // Changed from merchantName to payee
  }) => {
    try {
      // Format amount to string with 2 decimal places
      const formattedAmount = receiptData.amount.toFixed(2);
      form.setValue("amount", formattedAmount);

      // Ensure date is a valid Date object
      const parsedDate = new Date(receiptData.date);
      if (!isNaN(parsedDate.getTime())) {
        form.setValue("date", parsedDate);
      }

      // Set payee if not empty
      if (receiptData.payee && receiptData.payee.trim()) {
        form.setValue("payee", receiptData.payee.trim());
      }

      // Set notes if not empty
      if (receiptData.note && receiptData.note.trim()) {
        form.setValue("notes", receiptData.note.trim());
      }

      // Match and set category
      if (receiptData.category) {
        const matchedCategory = categoryOptions.find(
          (opt) => opt.label.toLowerCase() === receiptData.category.toLowerCase()
        );
        if (matchedCategory) {
          form.setValue("categoryId", matchedCategory.value);
        }
      }

      // Trigger form validation
      form.trigger();
      
      console.log("Updated form values:", {
        amount: formattedAmount,
        date: parsedDate,
        payee: receiptData.payee,
        notes: receiptData.note,
        category: receiptData.category
      });
    } catch (error) {
      console.error("Error prefilling form:", error);
    }
  };

  // Add this new function to handle button click
  const handleUploadClick = () => {
    document.getElementById('receipt-upload')?.click();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
        {onReceiptUpload && (
          <div className="flex justify-center">
            <Button 
              type="button" 
              variant="outline" 
              disabled={disabled}
              onClick={handleUploadClick}
              className="w-full md:w-auto"
            >
              <Upload className="size-4 mr-2" />
              Upload Receipt
            </Button>
            <input
              id="receipt-upload"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
              onChange={handleFileChange}
              disabled={disabled}
            />
          </div>
        )}

        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="accountId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select an account"
                  options={accountOptions}
                  onCreate={onCreateAccount}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="categoryId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  placeholder="Select a category"
                  options={categoryOptions}
                  onCreate={onCreateCategory}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="payee"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payee</FormLabel>
              <FormControl>
                <Input
                  disabled={disabled}
                  placeholder="Add a payee"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="amount"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <AmountInput
                  {...field}
                  disabled={disabled}
                  placeholder="0.00"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="notes"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  value={field.value ?? ""}
                  disabled={disabled}
                  placeholder="Optional notes"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="w-full" disabled={disabled}>
          {id ? "Save changes" : "Create transaction"}
        </Button>

        {!!id && (
          <Button
            type="button"
            disabled={disabled}
            onClick={handleDelete}
            className="w-full"
            variant="outline"
          >
            <Trash className="size-4 mr-2" />
            Delete transaction
          </Button>
        )}
      </form>
    </Form>
  );
});