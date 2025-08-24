"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/store/auth-store";

export function useAuth() {
  const router = useRouter();
  const { user, session, isLoading, setAuth, setLoading } = useAuthStore();
  const supabase = createClient();

  // Listen for auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      setAuth(session?.user ?? null, session);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, setAuth, router]);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setAuth(session?.user ?? null, session);
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [supabase.auth, setAuth, setLoading]);

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!session,
  };
}
