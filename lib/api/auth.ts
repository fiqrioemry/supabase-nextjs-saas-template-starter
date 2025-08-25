"use client";

import { createClient } from "../supabase/client";

type Provider = "google" | "github" | "discord" | "facebook";

export async function signInWithOAuth(provider: Provider, returnUrl?: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL!}/auth/callback${
        returnUrl ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ""
      }`,
    },
  });
  if (error) throw error;
  return data;
}
