"use client"; // Mark this component to be rendered on the client side

import { Button } from "@/components/ui/button"; // Import Button component from UI library
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components for layout
import { Loader2, Plus } from "lucide-react"; // Import icons for loading and adding
import { columns } from "./columns"; // Import column definitions for the table
import { DataTable } from "@/components/data-table"; // Import DataTable component for displaying accounts
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton component for loading state
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete"; // Import bulk delete hook
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts"; // Import hook for fetching accounts
import { useNewAccounts } from "@/features/accounts/hooks/use-new-accounts"; // Import hook for creating new accounts


const AccountsPage = () => {
    const newAccounts = useNewAccounts(); // Hook to manage new account creation
    const deleteAccount = useBulkDeleteAccounts(); // Hook to handle bulk delete of accounts
    const accountsQuery = useGetAccounts(); // Hook to fetch account data
    const accounts = accountsQuery.data || []; // Use fetched accounts data or empty array

    const isDisabled =
        accountsQuery.isLoading ||
        deleteAccount.isPending; // Disable actions if data is loading or deletion is in progress

    if (accountsQuery.isLoading) {
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

    return (
        <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Accounts Page  
                    </CardTitle>
                    <Button onClick={newAccounts.onOpen} size="sm">
                        <Plus className="size-4 mr-2"/>
                        Add new
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable 
                        filterKey="email" 
                        columns={columns} 
                        data={accounts} 
                        onDelete={(row: any[]) => {
                            const ids = row.map((r: any) => r.original.id); 
                            deleteAccount.mutate({ids});
                        }}
                        disabled={isDisabled}
                    />
                </CardContent>
            </Card>
        </div>
    )
}

export default AccountsPage;