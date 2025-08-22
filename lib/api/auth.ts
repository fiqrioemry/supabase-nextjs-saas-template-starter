import { createClient } from "@/lib/supabase/client";
import { authProviders } from "@/lib/supabase/server";
import type {
  SignInInput,
  SignUpInput,
  OtpVerificationInput,
} from "@/schemas/auth";

export async function signInWithPassword(data: SignInInput) {
  const supabase = createClient();

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return authData;
}

export async function signUpWithPassword(data: SignUpInput) {
  const supabase = createClient();

  const { data: authData, error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
      data: {
        display_name: data.display_name,
        bio: data.bio || "",
        website: data.website || "",
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return authData;
}

export async function signInWithOAuth(provider: "google" | "github") {
  const supabase = createClient();
  const config = authProviders[provider];

  const { data, error } = await supabase.auth.signInWithOAuth(config);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function verifyOtp(data: OtpVerificationInput) {
  const supabase = createClient();

  const { data: authData, error } = await supabase.auth.verifyOtp({
    email: data.email,
    token: data.token,
    type: "signup",
  });

  if (error) {
    throw new Error(error.message);
  }

  return authData;
}

export async function signOut() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
}

export async function resendOtp(email: string) {
  const supabase = createClient();

  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }
}
