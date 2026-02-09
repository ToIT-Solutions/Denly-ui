import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            user: null,

            // Set user and token
            setUser: (data) => set(data),

            // Clear user and token (logout)
            clearUser: () => set({ user: null, token: null }),
        }),
        {
            name: 'auth-storage', // key in localStorage
        }
    )
);

export default useAuthStore;
