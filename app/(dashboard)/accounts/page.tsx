import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

const AccountsPage = () => {
    return (
        <div>
            <Card className="border-none drop-shadow-sm">
                <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
                    <CardTitle className="text-xl line-clamp-1">
                        Accounts Page  
                    </CardTitle>
                    <Button>
                        <Plus>
                            Add new
                        </Plus>
                    </Button>
                </CardHeader>
            </Card>
        </div>
    )
}

export default AccountsPage;