// Importing the `zustand` library for state management
import { create } from "zustand";

// Defining the state and methods for managing the Edit Account sheet
type OpenTransactionState = {
    id?: string;  // The ID of the account being edited, if any
    isOpen: boolean;  // State to indicate if the sheet is open or closed
    onOpen: (id: string) => void;  // Function to open the sheet with a specific account ID
    onClose: () => void;  // Function to close the sheet and clear the account ID
};

// Creating a custom hook using `zustand` to manage the state of the Edit Account sheet
export const useOpenAccount = create<OpenTransactionState>((set) => ({
    id: undefined, // Initial state: no account ID is selected
    isOpen: false, // Initial state: the sheet is closed
    onOpen: (id: string ) => set({ isOpen: true, id}), // Open the sheet and set the account ID
    onClose: () => set({ isOpen: false, id: undefined }), // Close the sheet and reset the account ID
}))