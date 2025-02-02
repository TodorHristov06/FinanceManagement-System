"use client"; 

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import { Loader2, Plus} from "lucide-react"; 
import { columns } from "./columns";
import { DataTable } from "@/components/data-table"; 
import { Skeleton } from "@/components/ui/skeleton"; 
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction"; 
import { useSelectAccount } from "@/features/accounts/hooks/use-select-account";
import { useState } from "react";
import { UploadButton } from "./upload-button";
import { ImportCard } from "./import-card";
import { transactions as transactionsSchema } from "@/db/schema";
import { toast } from "sonner";
import { useBulkCreateTransactions } from "@/features/transactions/api/use-bulk-create-transactions";

enum VARIANTS {
    LIST = "LIST", // Display transaction list
    IMPORT = "IMPORT" // Display import UI
}

const INITIAL_IMPORT_RESULTS = {
    data: [],
    errors: [],
    meta: {},
}

const TransactionsPage = () => {
    const [AccountDialog, confirm] = useSelectAccount(); // Hook to select an account
    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST); // Track current UI variant
    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS); // Store import 

    // Handle file upload
    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
        console.log(results);
        setImportResults(results);
        setVariant(VARIANTS.IMPORT); // Switch to import UI
    }

    // Cancel import and return to list view
    const onCancelImport = () => {
        setImportResults(INITIAL_IMPORT_RESULTS);
        setVariant(VARIANTS.LIST);
    }

    const newTransaction = useNewTransaction(); 
    const createTransactions = useBulkCreateTransactions();
    const deleteTransactions = useBulkDeleteTransactions(); 
    const transactionsQuery = useGetTransactions(); 
    const transactions = transactionsQuery.data || []; 

    const isDisabled =
    transactionsQuery.isLoading ||
    deleteTransactions.isPending; 

    // Handle import submission
    const onSubmitImport = async (
        values: typeof transactionsSchema.$inferInsert[],
    ) => {
        const accountId = await confirm(); // Prompt user to select an account

        if (!accountId) {
            return toast.error("Please select an account to continue");
        }

        const data = values.map((values) => ({
            ...values,
            accountId: accountId as string, // Add accountId to each transaction
        })) 

        createTransactions.mutate(data, {
            onSuccess: () => {
                onCancelImport(); // Return to list view after successful import
            },
        });
    };

    if (transactionsQuery.isLoading) {
        return(
            <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
                <Card className="border-none drop-shadow-sm">
                    <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                        <Skeleton className="h-8 w-48"/> {/* Loading skeleton for header */}
                    </CardHeader>
                    <CardContent>
                        <div className="h-[500px] w-full flex justify-center items-center">
                            <Loader2 className="size-6 text-slate-300 animate-spin" /> {/* Loading spinner */}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (variant === VARIANTS.IMPORT) {
        return (
            <>
                <AccountDialog />
                <ImportCard
                    data={importResults.data}
                    onCancel={onCancelImport}
                    onSubmit={onSubmitImport}
                />
            </>
        )
    }

    // Default list view
    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Transaction History
                    </CardTitle>
                    <div  className="flex flex-col lg:flex-row gap-y-2 item-center gap-x-2">
                        <Button 
                            onClick={newTransaction.onOpen} 
                            size="sm"
                            className="w-full lg:w-auto"
                        >
                            <Plus className="size-4 mr-2"/>
                            Add new
                        </Button>
                        <UploadButton onUpload={onUpload} />
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable 
                        filterKey="payee" 
                        columns={columns} 
                        data={transactions} 
                        onDelete={(row) => {
                            const ids = row.map((r) => r.original.id); 
                            deleteTransactions.mutate({ids});
                        }}
                        disabled={isDisabled} // Disable actions during loading or deletion
                    />
                </CardContent>
            </Card>
        </div>
    )   
}

export default TransactionsPage;