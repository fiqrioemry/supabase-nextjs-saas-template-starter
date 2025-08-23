"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuthStore } from "@/lib/store/auth-store";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserProfile } from "@/lib/api/user";

export function useAuth() {
  const router = useRouter();
  const { user, session, profile, isLoading, setAuth, setProfile, setLoading } =
    useAuthStore();
  const supabase = createClient();

  // Query for user profile data
  const { data: profileData, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => getCurrentUserProfile(),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Update profile in store when query data changes
  useEffect(() => {
    if (profileData && profileData !== profile) {
      setProfile(profileData);
    }
  }, [profileData, profile, setProfile]);

  // Listen for auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setAuth(session?.user ?? null, session);

      if (event === "SIGNED_OUT") {
        setProfile(null);
        router.push("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, setAuth, setProfile, router]);

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
    profile,
    isLoading: isLoading || isProfileLoading,
    isAuthenticated: !!session,
  };
}
