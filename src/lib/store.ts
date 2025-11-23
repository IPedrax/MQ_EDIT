import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
    tokens: number;
    isLoggedIn: boolean;
    login: () => void;
    logout: () => void;
    spendTokens: (amount: number) => boolean;
    addTokens: (amount: number) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            tokens: 10, // Initial tokens
            isLoggedIn: false,
            login: () => set({ isLoggedIn: true }),
            logout: () => set({ isLoggedIn: false }),
            spendTokens: (amount) => {
                const currentTokens = get().tokens;
                if (currentTokens >= amount) {
                    set({ tokens: currentTokens - amount });
                    return true;
                }
                return false;
            },
            addTokens: (amount) => set((state) => ({ tokens: state.tokens + amount })),
        }),
        {
            name: 'cv-analyzer-storage',
        }
    )
);
