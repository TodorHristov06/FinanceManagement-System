"use client" // Mark this component to be rendered on the client side

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDeleteAccount } from "@/features/accounts/api/use-delete-account";
import { useOpenAccount } from "@/features/accounts/hooks/use-open-account";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";

type Props = {
    id: string // Account ID passed as a prop
}
export const Actions = ({id}: Props) => {
    const[ConfirmDialog, confirm] = useConfirm( "Are you sure?", "You are about to delete this transaction."); // Use confirmation dialog for delete action
    const deleteMutation = useDeleteAccount(id); // Hook to manage account deletion
    const { onOpen } = useOpenAccount(); // Hook to manage opening an account

     // Handle the delete action with confirmation
    const handleDelete = async() => {
        const ok = await confirm(); // Wait for confirmation dialog result

        if (ok) {
            deleteMutation.mutate();// Delete account if confirmed
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