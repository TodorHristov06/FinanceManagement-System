"use client";

import { useMountedState } from "react-use";
import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet";
import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet";

import { NewCategorySheet } from "@/features/categories/components/new-category-sheet";
import { EditCategorySheet } from "@/features/categories/components/edit-category-sheet";

import { NewTransactionSheet } from "@/features/transactions/components/new-transaction-sheet";
import { EditTransactionSheet } from "@/features/transactions/components/edit-transaction-sheet";

// SheetProvider component, acting as a central place to manage sheet components
export const SheetProvider = () => {
    
    // Using the useMountedState hook to ensure the component is only rendered on the client
    const isMounted = useMountedState();

    // If the component is not mounted yet, return null to avoid rendering
    if (!isMounted) return null;

    // Render the NewAccountSheet and EditAccountSheet / NewCategorySheet and EditCategorySheet components
    return (
        <>
            <NewAccountSheet/>
            <EditAccountSheet/>

            <NewCategorySheet/>
            <EditCategorySheet/>

            <NewTransactionSheet/>
            <EditTransactionSheet/>
        </>
    )
}