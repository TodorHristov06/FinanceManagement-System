import { create } from "zustand";
// Defining the state and methods for managing the New Transaction sheet
type NewTransactionState = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};
// Creating a custom hook using `zustand` to manage the state of the New Transaction sheet
export const useNewTransaction = create<NewTransactionState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))