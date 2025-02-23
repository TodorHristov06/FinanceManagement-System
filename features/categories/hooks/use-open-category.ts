import { create } from "zustand";

// Defining the state and methods for managing the Edit Category sheet
type OpenCategoryState = {
    id?: string;
    isOpen: boolean;
    onOpen: (id: string) => void;
    onClose: () => void;
};

// Creating a custom hook using `zustand` to manage the state of the Edit Category sheet
export const useOpenCategory = create<OpenCategoryState>((set) => ({
    id: undefined,
    isOpen: false,
    onOpen: (id: string ) => set({ isOpen: true, id}),
    onClose: () => set({ isOpen: false, id: undefined }),
}))