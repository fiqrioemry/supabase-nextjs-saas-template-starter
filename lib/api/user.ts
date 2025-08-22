import { createClient } from "@/lib/supabase/client";
import { createServer } from "@/lib/supabase/server";
import type { Profile } from "@/types/database";

export async function getUserProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
}

export async function getCurrentUserProfile(): Promise<Profile | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return getUserProfile(user.id);
}

// Server-side functions
export async function getServerUserProfile(
  userId: string
): Promise<Profile | null> {
  const supabase = await createServer();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
}

export async function getServerCurrentUserProfile(): Promise<Profile | null> {
  const supabase = await createServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return getServerUserProfile(user.id);
}
