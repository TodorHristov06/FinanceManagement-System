// Importing the `zustand` library for state management
import { create } from "zustand";
// Defining the state and methods for managing the New Transaction sheet
type NewTransactionState = {
    isOpen: boolean;  // State to determine if the sheet is open or closed
    onOpen: () => void;  // Function to open the sheet
    onClose: () => void;  // Function to close the sheet
};
// Creating a custom hook using `zustand` to manage the state of the New Transaction sheet
export const useNewTransaction = create<NewTransactionState>((set) => ({
    isOpen: false,  // Initial state: the sheet is closed
    onOpen: () => set({ isOpen: true }),  // Function to set `isOpen` to `true`
    onClose: () => set({ isOpen: false }),  // Function to set `isOpen` to `false`
}))