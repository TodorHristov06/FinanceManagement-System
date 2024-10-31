"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNewAccounts } from "@/features/accounts/hooks/use-new-accounts";
import { Plus } from "lucide-react";

const AccountsPage = () => {
    const newAccounts = useNewAccounts();
    
    return (
        <div className="max-w-screen-2xl mx-auto">
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
            </Card>
        </div>
    )
}

export default AccountsPage;