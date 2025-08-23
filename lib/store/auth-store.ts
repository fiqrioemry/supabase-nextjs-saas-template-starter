import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Session } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types/database";

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;

  setAuth: (user: User | null, session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      session: null,
      profile: null,
      isLoading: true,

      setAuth: (user, session) => set({ user, session, isLoading: false }),

      setProfile: (profile) => set({ profile }),

      setLoading: (isLoading) => set({ isLoading }),

      signOut: () =>
        set({ user: null, session: null, profile: null, isLoading: false }),
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
