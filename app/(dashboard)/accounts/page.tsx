"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteAccounts } from "@/features/accounts/api/use-bulk-delete";
import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useNewAccounts } from "@/features/accounts/hooks/use-new-accounts";


const AccountsPage = () => {
    const newAccounts = useNewAccounts();
    const deleteAccount = useBulkDeleteAccounts();
    const accountsQuery = useGetAccounts();
    const accounts = accountsQuery.data || [];

    const isDisabled =
        accountsQuery.isLoading ||
        deleteAccount.isPending;

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