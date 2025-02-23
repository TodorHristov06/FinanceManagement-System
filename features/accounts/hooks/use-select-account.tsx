import { useRef, useState } from "react";

import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
import { useCreateAccount } from "@/features/accounts/api/use-create-account";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription ,DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select } from "@/components/select";


// Custom hook for selecting an account or creating a new one
export const useSelectAccount = (): [() => JSX.Element, () => Promise<unknown>] => {
    const accountQuery = useGetAccounts(); // Fetching accounts
    const accountMutation = useCreateAccount(); // Hook to create a new account

    // Function to handle account creation
    const onCreateAccount = (name: string) => accountMutation.mutate({
        name
    });

    // Preparing account options for the select dropdown
    const accountOptions = (accountQuery.data ?? []).map((account) => ({
        label: account.name,
        value: account.id
    }))

    const [promise, setPromise] = useState<{ 
        resolve: (value: string | undefined) => void 
    } | null>(null)

    const selectValue = useRef<string>(); // Ref to store selected account ID

    // Function to open the dialog and wait for user confirmation
    const confirm = () => new Promise((resolve, reject) => {
        setPromise({resolve}); // Set the resolve function for promise
    })

    // Close the dialog and clear promise
    const handleClose = () => {
        setPromise(null);
    };

    // Confirm selection and resolve the promise with the selected account ID
    const handleConfirm = () => {
        promise?.resolve(selectValue.current); 
        handleClose(); 
    };

    // Cancel selection and resolve the promise with undefined
    const handleCancel = () => {
        promise?.resolve(undefined); 
        handleClose(); 
    };

    // Dialog component for account selection
    const ConfirmationDialog = () => (
        <Dialog open={promise !== null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Select Account
                        </DialogTitle>
                    <DialogDescription>
                        Please select an account to continue
                    </DialogDescription>
                </DialogHeader>
                <Select
                    placeholder="Select an account"
                    options={accountOptions}
                    onCreate={onCreateAccount}
                    onChange={(value) => selectValue.current = value}
                    disabled={accountQuery.isLoading || accountMutation.isPending}
                />
                <DialogFooter className="pt-2">
                    <Button onClick={handleCancel} variant="outline">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirm} variant="destructive">
                        Confirm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
    
    return [ConfirmationDialog, confirm];
}