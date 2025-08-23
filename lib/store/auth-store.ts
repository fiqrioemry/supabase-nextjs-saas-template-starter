import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Session } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;

  signOut: () => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: User) => void;
  setAuth: (user: User | null, session: Session | null) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      isLoading: true,

      setUser: (user) => set({ user }),

      setLoading: (isLoading) => set({ isLoading }),

      setAuth: (user, session) => set({ user, session, isLoading: false }),

      signOut: () => set({ user: null, session: null, isLoading: false }),

      clearAuth: () => set({ user: null, session: null, isLoading: false }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        session: state.session,
      }),
    }
  )
);
