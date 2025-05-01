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
import { ReceiptStorage } from "@/components/receipt-storage";

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

  const prefillForm = (data: any) => {
    console.log('Prefilling form with data:', data);
    
    // Directly set form values
    form.setValue('amount', data.amount.toString());
    form.setValue('date', new Date(data.date));
    form.setValue('payee', data.payee || '');
    form.setValue('notes', data.note || '');
    form.setValue('categoryId', data.categoryId || '');
    form.setValue('accountId', data.accountId || '');

    // Log the form values after setting
    console.log('Form values after setting:', form.getValues());
    
    // Force form update
    form.trigger();
  };

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
      // Create FormData for upload
      const formData = new FormData();
      formData.append("file", file);
      if (id) formData.append("transactionId", id);

      // Scan receipt first
      const receiptData = await scanReceipt(file);
      console.log("Scanned receipt data:", receiptData);
      
      if (receiptData) {
        prefillForm({
          ...receiptData,
          amount: receiptData.amount.toString(),
          note: String(receiptData.note || ''),
          payee: String(receiptData.payee || ''),
          category: String(receiptData.category || '')
        });
      }

      // Call onReceiptUpload with FormData if provided
      if (onReceiptUpload) {
        onReceiptUpload(file);
      }
    } catch (error) {
      console.error('Error processing receipt:', error);
    }
  };

  const handleSelectReceipt = async (receipt: any) => {
    try {
      // Convert base64 to file for upload
      const response = await fetch(receipt.imageData);
      const blob = await response.blob();
      const file = new File([blob], receipt.fileName, { type: receipt.fileType });
      
      // Upload the receipt if handler provided
      if (onReceiptUpload) {
        onReceiptUpload(file);
      }

      // Scan the receipt using the imageData
      const receiptData = await scanReceipt(receipt.imageData);
      console.log("Scanned receipt data:", receiptData);
      
      if (receiptData) {
        form.setValue('amount', receiptData.amount.toString());
        form.setValue('date', new Date(receiptData.date));
        form.setValue('payee', receiptData.payee || '');
        form.setValue('notes', receiptData.note || '');

        // Find matching category from options
        const categoryOption = categoryOptions.find(cat => 
          cat.label.toLowerCase() === receiptData.category?.toLowerCase()
        );
        if (categoryOption) {
          form.setValue('categoryId', categoryOption.value);
        }
      }
    } catch (error) {
      console.error('Error processing receipt:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
        <FormField
          name="receipts"
          render={() => (
            <FormItem>
              <FormControl>
                <ReceiptStorage 
                  transactionId={id} 
                  onSelectReceipt={(receipt) => {
                    handleSelectReceipt(receipt);
                    return false; // Prevent form submission
                  }}
                />
              </FormControl>
            </FormItem>
          )}
        />

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