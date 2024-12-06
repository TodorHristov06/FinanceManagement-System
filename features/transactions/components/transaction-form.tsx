// Importing necessary libraries and components
import { z } from "zod";  // For schema validation
import { Trash } from "lucide-react";  // Trash icon from Lucide
import { useForm } from "react-hook-form";  // React hook for managing forms
import { zodResolver } from "@hookform/resolvers/zod";  // Resolver for integrating Zod with react-hook-form
import { Input } from "@/components/ui/input";  // Custom Input component
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";  // Custom Button component
import { Select } from "@/components/select";
import { insertTransactionSchema } from "@/db/schema";  // Importing the schema for validation
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";  // Custom Form components
import { Textarea } from "@/components/ui/textarea";
import { AmountInput } from "@/components/amount-input";
import { convertAmountToMiliunits } from "@/lib/utils";

const formSchema = z.object({
    date: z.coerce.date(),
    accountId: z.string(),
    categoryId: z.string().nullable().optional(),
    payee: z.string(),
    amount: z.string(), 
    notes: z.string().nullable().optional(),
})

const apiSchema = insertTransactionSchema.omit({
    id: true
})

type FormValues = z.input<typeof formSchema>
type ApiFormValues = z.input<typeof apiSchema>

type Props = {
    id?: string;  
    defaultValues?: FormValues;  
    onSubmit: (values: ApiFormValues) => void;  
    onDelete?: () => void;  
    disabled?: boolean;
    accountOptions: {label: string, value: string}[];
    categoryOptions: {label: string, value: string}[];
    onCreateAccount: (name: string) => void;
    onCreateCategory: (name: string) => void;
};

export const TransactionForm = ({
    id,
    defaultValues,
    onSubmit,
    onDelete,
    disabled,
    accountOptions,
    categoryOptions,
    onCreateAccount,
    onCreateCategory
}: Props) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema), 
        defaultValues: defaultValues, 
    })

    const handleSubmit = (values: FormValues) => {
        const amount = parseFloat(values.amount);
        const amountInMiliunits = convertAmountToMiliunits(amount);
        console.log({ values });

        onSubmit({
            ...values,
            amount: amountInMiliunits,
        }); 
    }

    // Handle account deletion
    const handleDelete = () => {
        onDelete?.(); // If onDelete function is provided, it gets called
    }

    return (
        // The Form component is a wrapper for the react-hook-form
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
            <FormField 
                name="date" 
                control={form.control} 
                render={({field}) => (
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
                )}/>
                <FormField 
                name="accountId" 
                control={form.control} 
                render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Account
                        </FormLabel>
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
                )}/>
                <FormField 
                name="categoryId" 
                control={form.control} 
                render={({field}) => (
                    <FormItem>
                        <FormLabel> 
                            Category
                        </FormLabel>
                        <FormControl>
                            <Select
                             placeholder="Select an category"
                             options={categoryOptions}
                             onCreate={onCreateCategory}
                             value={field.value}
                             onChange={field.onChange}
                             disabled={disabled}
                            />
                        </FormControl>
                        <FormMessage /> 
                    </FormItem>
                )}/>
                <FormField 
                name="payee" 
                control={form.control} 
                render={({field}) => (
                    <FormItem>
                        <FormLabel> 
                            Payee
                        </FormLabel>
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
                )}/>
                <FormField 
                name="amount" 
                control={form.control} 
                render={({field}) => (
                    <FormItem>
                        <FormLabel> 
                            Amount
                        </FormLabel>
                        <FormControl>
                            <AmountInput
                                {...field}
                                disabled={disabled}
                                placeholder="0.00"
                            />
                        </FormControl>
                        <FormMessage /> 
                    </FormItem>
                )}/>
                <FormField 
                name="notes" 
                control={form.control} 
                render={({field}) => (
                    <FormItem>
                        <FormLabel> 
                            Notes
                        </FormLabel>
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
                )}/>
                <Button className="w-full" disabled={disabled}>
                    {id ? "Save changes" : "Create account"}
                </Button>
                {!!id && (<Button type="button" disabled={disabled} onClick={handleDelete} className="w-full" variant="outline">
                    <Trash className="size-4 mr-2"/> 
                    Delete account
                </Button>)}
            </form>
        </Form>
    )
}