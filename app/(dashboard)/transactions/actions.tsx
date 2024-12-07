"use client" // Mark this component to be rendered on the client side

import { Button } from "@/components/ui/button"; // Import Button component from UI library
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"; // Import dropdown menu components
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction"; // Import hook to handle account deletion
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction"; // Import hook to handle opening an account
import { Edit, MoreHorizontal, Trash } from "lucide-react"; // Import icons for edit, menu, and trash actions
import { useConfirm } from "@/hooks/use-confirm"; // Import custom hook for confirmation dialogs

type Props = {
    id: string // Define type for the component's props, specifically the account ID
}
export const Actions = ({id}: Props) => {
    const[ConfirmDialog, confirm] = useConfirm( "Are you sure?", "You are about to delete this transaction."); // Use confirmation dialog for delete action
    const deleteMutation = useDeleteTransaction(id); // Hook to manage account deletion
    const { onOpen } = useOpenTransaction(); // Hook to manage opening an account

     // Handle the delete action with confirmation
    const handleDelete = async() => {
        const ok = await confirm(); // Wait for confirmation dialog result

        if (ok) {
            deleteMutation.mutate(); // Trigger delete mutation if confirmed
        }
    }

    return (
        <>
            {/*Render confirmation dialog*/}
            <ConfirmDialog/>  
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0">
                        <MoreHorizontal className="size-4"/> {/* Menu icon */}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled={deleteMutation.isPending} onClick={() => onOpen(id)}> {/* Edit button */}
                        <Edit className="size-4 mr-2"/>
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={deleteMutation.isPending} onClick={handleDelete}> {/* Delete button */}
                        <Trash className="size-4 mr-2"/>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}