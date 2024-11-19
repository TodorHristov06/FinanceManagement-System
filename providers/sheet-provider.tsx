"use client";
// Importing a custom hook to check if the component is mounted
import { useMountedState } from "react-use";
// Importing the NewAccountSheet component
import { NewAccountSheet } from "@/features/accounts/components/new-account-sheet";
// Importing the EditAccountSheet component
import { EditAccountSheet } from "@/features/accounts/components/edit-account-sheet";
// SheetProvider component, acting as a central place to manage sheet components
export const SheetProvider = () => {
    // Using the useMountedState hook to ensure the component is only rendered on the client
    const isMounted = useMountedState();
    // If the component is not mounted yet, return null to avoid rendering
    if (!isMounted) return null;
    // Render the NewAccountSheet and EditAccountSheet components
    return (
        <>
            <NewAccountSheet/>
            <EditAccountSheet/>
        </>
    )
}