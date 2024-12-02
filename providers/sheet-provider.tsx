"use client";

import { useMountedState } from "react-use"; // Importing a custom hook to check if the component is mounted
import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet"; // Importing the NewAccountSheet component
import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet"; // Importing the EditAccountSheet component

import { NewCategorySheet } from "@/features/categories/components/new-category-sheet"; // Importing the NewCategorySheet component
import { EditCategorySheet } from "@/features/categories/components/edit-category-sheet"; // Importing the EditCategorySheet component

import { NewTransactionSheet } from "@/features/transactions/components/new-transaction-sheet";

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
        </>
    )
}