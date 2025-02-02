"use client"

import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { useDeleteCategory } from "@/features/categories/api/use-delete-category";
import { useOpenCategory } from "@/features/categories/hooks/use-open-category";
import { useConfirm } from "@/hooks/use-confirm";

type Props = {
    id: string // Category ID passed as a prop
}
export const Actions = ({id}: Props) => {
    const[ConfirmDialog, confirm] = useConfirm( "Are you sure?", "You are about to delete this category.");
    const deleteMutation = useDeleteCategory(id); // Hook to handle category deletion
    const { onOpen } = useOpenCategory(); // Hook to handle opening a category for editing

    const handleDelete = async() => {
        const ok = await confirm(); // Show confirmation dialog

        if (ok) {
            deleteMutation.mutate(); // Delete category if confirmed
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