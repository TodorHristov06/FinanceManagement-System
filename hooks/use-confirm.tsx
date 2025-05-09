import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription ,DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// A custom hook that provides a confirmation dialog and a function to trigger it
export const useConfirm = (
    title: string,
    message: string,
): [() => JSX.Element, () => Promise<unknown>] => {
    // State to manage the confirmation promise
    const [promise, setPromise] = useState<{ resolve: (value: boolean) => 
    void } | null>(null)

    // Function to initiate the confirmation process and return a promise
    const confirm = () => new Promise((resolve, reject) => {
        setPromise({resolve});
    })

    // Function to close the dialog and reset the state
    const handleClose = () => {
        setPromise(null);
    };
    // Function to handle the "Confirm" action
    const handleConfirm = () => {
        promise?.resolve(true);
        handleClose();
    };

    // Function to handle the "Cancel" action
    const handleCancel = () => {
        promise?.resolve(false);
        handleClose();
    };

    // The dialog component to render when a confirmation is needed
    const ConfirmationDialog = () => (
        <Dialog open={promise !== null}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
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
    
    // Returning the dialog component and the confirm function
    return [ConfirmationDialog, confirm];
}