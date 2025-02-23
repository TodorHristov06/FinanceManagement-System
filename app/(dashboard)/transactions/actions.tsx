"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDeleteTransaction } from "@/features/transactions/api/use-delete-transaction";
import { useOpenTransaction } from "@/features/transactions/hooks/use-open-transaction";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useConfirm } from "@/hooks/use-confirm";

type Props = {
    id: string // Transaction ID passed as a prop
}
export const Actions = ({id}: Props) => {
    const[ConfirmDialog, confirm] = useConfirm( "Are you sure?", "You are about to delete this transaction."); 
    const deleteMutation = useDeleteTransaction(id); // Hook to handle transaction deletion
    const { onOpen } = useOpenTransaction(); // Hook to handle opening a transaction for editing

    const handleDelete = async() => {
        const ok = await confirm(); // Show confirmation dialog

        if (ok) {
            deleteMutation.mutate(); // Delete transaction if confirmed
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