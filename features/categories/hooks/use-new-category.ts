import { create } from "zustand";
// Defining the state and methods for managing the New Category sheet
type NewCategoryState = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};
// Creating a custom hook using `zustand` to manage the state of the New Category sheet
export const useNewCategory = create<NewCategoryState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))