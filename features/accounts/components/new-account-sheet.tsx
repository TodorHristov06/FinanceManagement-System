import { useNewAccounts } from "@/features/accounts/hooks/use-new-accounts";
import { AccountForm } from "@/features/accounts/components/account-form";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet";



export const NewAccountSheet = () => {
    const { isOpen, onClose } = useNewAccounts();
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New account
                    </SheetTitle>
                    <SheetDescription>
                        Create a new account to track your transactions.
                    </SheetDescription>
                </SheetHeader>
                <AccountForm onSubmit={() => {}} disabled={false}/>
            </SheetContent>
        </Sheet> 
    );
};