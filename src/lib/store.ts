import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    name: string;
    email: string;
    picture: string;
}

interface AppState {
    tokens: number;
    user: User | null;
    isLoggedIn: boolean;
    login: (user: User) => void;
    logout: () => void;
    spendTokens: (amount: number) => boolean;
    addTokens: (amount: number) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            tokens: 10, // Initial tokens
            user: null,
            isLoggedIn: false,
            login: (user) => set({ isLoggedIn: true, user }),
            logout: () => set({ isLoggedIn: false, user: null }),
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
