"use server";

import { createServer } from "@/lib/supabase/server";
import { authProviders } from "@/lib/supabase/config";
import type { OtpVerificationInput } from "@/lib/schemas/auth";
import { redirect } from "next/navigation";

interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
  needsVerification?: boolean;
  email?: string;
}

// Get timezone and language from IP
const getLocationData = async () => {
  try {
    const response = await fetch("http://ip-api.com/json/");
    const data = await response.json();

    return {
      timezone: data.timezone || "UTC",
      language: data.countryCode || "ID",
    };
  } catch (error) {
    return {
      timezone: "UTC",
      language: "ID",
    };
  }
};

// Check if user exists and their signup method
export async function checkUserSignupMethod(email: string) {
  const supabase = await createServer();
  const { data, error } = await supabase.rpc("check_user_signup_method", {
    email_to_check: email,
  });

  if (error) throw error;
  return data;
}

export async function getSessions() {
  const supabase = await createServer();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data;
}

export async function signInWithPassword(
  formData: FormData
): Promise<AuthResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !email.includes("@")) {
    return { success: false, message: "Please enter a valid email address" };
  }

  if (!password) {
    return {
      success: false,
      message: "Password is required",
    };
  }

  const supabase = await createServer();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.toLowerCase(),
    password,
  });

  if (error) {
    return {
      success: false,
      message: error.message || "Could not authenticate user",
    };
  }

  // Redirect after successful login
  const redirectUrl = (formData.get("redirectUrl") as string) || "/dashboard";
  redirect(redirectUrl);
}

export async function signUpWithPassword(
  formData: FormData
): Promise<AuthResponse> {
  const fullname = formData.get("fullname") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectUrl = (formData.get("redirectUrl") as string) || "/dashboard";

  if (!email || !email.includes("@")) {
    return { success: false, message: "Please enter a valid email address" };
  }

  if (!password || password.length < 6) {
    return {
      success: false,
      message: "Password must be at least 6 characters",
    };
  }

  if (!fullname || fullname.trim().length < 2) {
    return { success: false, message: "Full name is required" };
  }

  const supabase = await createServer();

  try {
    // Check if user already exists with this email
    const existingUser = await checkUserSignupMethod(email);

    if (existingUser) {
      const { exists, providers, email_confirmed } = existingUser;

      if (exists) {
        // User already exists, check provider
        if (providers.includes("google")) {
          return {
            success: false,
            message:
              "This email is already registered with Google. Please sign in with Google instead.",
          };
        } else if (providers.includes("email") && email_confirmed) {
          return {
            success: false,
            message: "Email already registered. Please sign in instead.",
          };
        } else if (providers.includes("email") && !email_confirmed) {
          // User exists but hasn't confirmed email, resend OTP
          const { error: resendError } = await supabase.auth.resend({
            type: "signup",
            email: email,
          });

          if (resendError) {
            if (resendError.code === "over_email_send_rate_limit") {
              return {
                success: false,
                message:
                  "Please wait before requesting another verification code. You can request a new code in 60 seconds.",
              };
            }
            return {
              success: false,
              message: "Failed to send verification code. Please try again.",
            };
          }

          return {
            success: true,
            data: { user: null, session: null },
            needsVerification: true,
            email,
            message:
              "Account exists but not verified. Verification code sent to your email.",
          };
        }
      }
    }

    // Get location data
    const locationData = await getLocationData();

    // Generate avatar URL using UI Avatars service
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fullname.trim()
    )}&background=0D8ABC&color=fff&size=200&font-size=0.6`;

    // Email not registered, proceed with normal signup
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?redirectUrl=${redirectUrl}`,
        data: {
          bio: "",
          website: "",
          theme: "system",
          language: locationData.language,
          timezone: locationData.timezone,
          display_name: fullname.trim(),
          avatar_url: avatarUrl,
        },
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message || "Could not create account",
      };
    }

    if (data.user && !data.session) {
      return {
        success: true,
        data: { user: data.user, session: null },
        needsVerification: true,
        email,
        message: "Account created! Verification code sent to your email.",
      };
    } else if (data.session) {
      return {
        success: true,
        data,
        needsVerification: false,
        message: "Account created successfully!",
      };
    }

    return {
      success: false,
      message: "Failed to create account",
    };
  } catch (error) {
    console.error("Sign up error:", error);
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "An unexpected error occurred during sign up",
    };
  }
}

export async function verifyOtp(data: OtpVerificationInput): Promise<any> {
  const supabase = await createServer();

  try {
    const { data: authData, error } = await supabase.auth.verifyOtp({
      email: data.email,
      token: data.token,
      type: "email", // Changed from "signup" to "email" to match React version
    });

    if (error) {
      throw new Error("Invalid verification code");
    }

    if (authData.session && authData.user) {
      return {
        ...authData,
        verified: true,
        message: "Email verified successfully!",
      };
    }

    throw new Error("Verification failed");
  } catch (error) {
    console.error("OTP verification error:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function resendOtp(
  email: string
): Promise<{ success: boolean; message: string }> {
  const supabase = await createServer();

  try {
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });

    if (error) {
      if (error.code === "over_email_send_rate_limit") {
        return {
          success: false,
          message:
            "Please wait before requesting another verification code. You can request a new code in 60 seconds.",
        };
      }
      return {
        success: false,
        message: "Failed to send verification code. Please try again.",
      };
    }

    return {
      success: true,
      message: "Verification code sent successfully",
    };
  } catch (error) {
    console.error("Resend OTP error:", error);
    if (error instanceof Error) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "An unexpected error occurred",
    };
  }
}

type Provider = "google" | "github" | "discord" | "facebook";

export async function signInWithOAuth(provider: Provider, redirectTo?: string) {
  const supabase = await createServer();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo:
        redirectTo || `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) throw error;
  return data;
}

// Helper function untuk handle OAuth callback
export async function handleOAuthCallback() {
  const supabase = await createServer();
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data;
}

// Setup OAuth user metadata
export async function setupOAuthUserMetadata(user: any) {
  const supabase = await createServer();

  try {
    // Get location data
    const locationData = await getLocationData();

    // Extract display name from OAuth data
    const displayName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "User";

    // Generate avatar URL if not provided by OAuth
    let avatarUrl =
      user.user_metadata?.avatar_url || user.user_metadata?.picture;

    if (!avatarUrl) {
      avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        displayName
      )}&background=0D8ABC&color=fff&size=200&font-size=0.6`;
    }

    // Check if user already has complete metadata
    const hasCompleteMetadata =
      user.user_metadata?.display_name &&
      user.user_metadata?.theme &&
      user.user_metadata?.timezone;

    if (hasCompleteMetadata) {
      return { updated: false, user };
    }

    // Update user metadata with complete info
    const { data, error } = await supabase.auth.updateUser({
      data: {
        ...user.user_metadata,
        display_name: user.user_metadata?.display_name || displayName,
        avatar_url: avatarUrl,
        bio: user.user_metadata?.bio || "",
        website: user.user_metadata?.website || "",
        theme: user.user_metadata?.theme || "system",
        language: user.user_metadata?.language || locationData.language,
        timezone: user.user_metadata?.timezone || locationData.timezone,
      },
    });

    if (error) {
      console.error("Failed to update OAuth user metadata:", error);
      return { updated: false, user, error };
    }

    return { updated: true, user: data.user };
  } catch (error) {
    console.error("Error setting up OAuth user metadata:", error);
    return { updated: false, user, error };
  }
}

export async function signOut(): Promise<void> {
  const supabase = await createServer();

  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }

  redirect("/auth/signin");
}
