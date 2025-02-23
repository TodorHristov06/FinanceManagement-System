import { create } from "zustand";

// Defining the state and methods for managing the New Account sheet
type NewAccountsState = {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};
// Creating a custom hook using `zustand` to manage the state of the New Account sheet
export const useNewAccounts = create<NewAccountsState>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}))