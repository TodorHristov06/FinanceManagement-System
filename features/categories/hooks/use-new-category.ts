// Importing the `zustand` library for state management
import { create } from "zustand";
// Defining the state and methods for managing the New Category sheet
type NewCategoryState = {
    isOpen: boolean;  // State to determine if the sheet is open or closed
    onOpen: () => void;  // Function to open the sheet
    onClose: () => void;  // Function to close the sheet
};
// Creating a custom hook using `zustand` to manage the state of the New Category sheet
export const useNewCategory = create<NewCategoryState>((set) => ({
    isOpen: false,  // Initial state: the sheet is closed
    onOpen: () => set({ isOpen: true }),  // Function to set `isOpen` to `true`
    onClose: () => set({ isOpen: false }),  // Function to set `isOpen` to `false`
}))