// Importing the `zustand` library for state management
import { create } from "zustand";

// Defining the state and methods for managing the Edit Category sheet
type OpenCategoryState = {
    id?: string;  // The ID of the Category being edited, if any
    isOpen: boolean;  // State to indicate if the sheet is open or closed
    onOpen: (id: string) => void;  // Function to open the sheet with a specific Category ID
    onClose: () => void;  // Function to close the sheet and clear the Category ID
};

// Creating a custom hook using `zustand` to manage the state of the Edit Category sheet
export const useOpeCategory = create<OpenCategoryState>((set) => ({
    id: undefined, // Initial state: no Category ID is selected
    isOpen: false, // Initial state: the sheet is closed
    onOpen: (id: string ) => set({ isOpen: true, id}), // Open the sheet and set the Category ID
    onClose: () => set({ isOpen: false, id: undefined }), // Close the sheet and reset the Category ID
}))