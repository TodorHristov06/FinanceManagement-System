"use client"; // Mark this component to be rendered on the client side

import { Button } from "@/components/ui/button"; // Import Button component from UI library
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components for layout
import { Loader2, Plus, Upload } from "lucide-react"; // Import icons for loading and adding
import { columns } from "./columns"; // Import column definitions for the table
import { DataTable } from "@/components/data-table"; // Import DataTable component for displaying transactions
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component for loading state
import { useBulkDeleteTransactions } from "@/features/transactions/api/use-bulk-delete-transactions";
import { useGetTransactions } from "@/features/transactions/api/use-get-transactions";
import { useNewTransaction } from "@/features/transactions/hooks/use-new-transaction"; // Import hook for creating new transactions
import { useState } from "react";
import { UploadButton } from "./upload-button";
import { on } from "events";

enum VARIANTS {
    LIST = "LIST",
    IMPORT = "IMPORT"
}

const INITIAL_IMPORT_RESULTS = {
    data: [],
    errors: [],
    meta: {},
}

const TransactionsPage = () => {
    const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
    const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULTS);

    const onUpload = (results: typeof INITIAL_IMPORT_RESULTS) => {
        setImportResults(results);
        setVariant(VARIANTS.IMPORT);
    }

    const onCancelImport = () => {
        setImportResults(INITIAL_IMPORT_RESULTS);
        setVariant(VARIANTS.LIST);
    }

    const newTransaction = useNewTransaction(); // Hook to manage new transaction creation
    const deleteTransactions = useBulkDeleteTransactions(); // Hook to handle bulk delete of transactions
    const transactionsQuery = useGetTransactions(); // Hook to fetch transaction data
    const transactions = transactionsQuery.data || []; // Use fetched transactions data or empty array

    const isDisabled =
    transactionsQuery.isLoading ||
    deleteTransactions.isPending; // Disable actions if data is loading or deletion is in progress

    if (transactionsQuery.isLoading) {
        return(
            <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
                <Card className="border-none drop-shadow-sm">
                    <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                        <Skeleton className="h-8 w-48"/>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[500px] w-full flex justify-center items-center">
                            <Loader2 className="size-6 text-slate-300 animate-spin" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (variant === VARIANTS.IMPORT) {
        return (
            <>
                <ImportCard/>
            </>
        )
    }

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Transaction History
                    </CardTitle>
                    <div className="flex items-center gap-x-2">
                        <Button onClick={newTransaction.onOpen} size="sm">
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
                        disabled={isDisabled}
                    />
                </CardContent>
            </Card>
        </div>
    )   
}

export default TransactionsPage;