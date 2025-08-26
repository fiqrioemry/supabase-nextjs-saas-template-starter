"use server";

import { redirect } from "next/navigation";
import { createServer } from "@/lib/supabase/server";
import type { OtpVerificationInput } from "@/lib/schemas/auth";

interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
  email?: string;
  needsVerification?: boolean;
}

export const changePassword = async (
  newPassword: string,
  currentPassword: string
) => {
  const supabase = await createServer();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      throw new Error("User not found");
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email.toLowerCase(),
      password: currentPassword,
    });

    console.log(signInError);
    if (signInError) {
      throw new Error("Current password is incorrect");
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      throw new Error("Failed to update password");
    }

    return { success: true, message: "Password updated successfully" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};

// Create password for non-email provider
export async function createPassword(
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  const supabase = await createServer();
  // Get current session
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();
  if (sessionError || !session) {
    return { success: false, message: "No active session found" };
  }
  
  try {
    // Set password
    const { error: passwordError } = await supabase.auth.updateUser({ 
      password: newPassword 
    });
    
    if (passwordError) {
      return {
        success: false,
        message: passwordError.message || "Failed to set password",
      };
    }

    // Set a flag in user metadata to indicate they now have a password
    const { error: metadataError } = await supabase.auth.updateUser({
      data: { has_password: true }
    });

    if (metadataError) {
      console.warn("Failed to update user metadata:", metadataError);
      // Don't fail the whole operation if metadata update fails
    }

    return { success: true, message: "Password set successfully" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to set password",
    };
  }
}

export async function hasPassword(): Promise<{ hasPassword: boolean }> {
  const supabase = await createServer();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return { hasPassword: false };
    }

    // Check if user has email provider (original signup method)
    if (user.app_metadata?.provider === "email") {
      return { hasPassword: true };
    }

    // For OAuth users, check if they have a password set
    // Check if user has any password-related metadata
    const hasPasswordSet = user.user_metadata?.has_password === true || 
                          user.app_metadata?.has_password === true;
    
    return { hasPassword: hasPasswordSet };
  } catch (error) {
    // Fallback: check if provider is email
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return { hasPassword: user?.app_metadata?.provider === "email" };
  }
}

// Get timezone and language from IP
export const getLocationData = async () => {
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

  return { success: true, data, message: "Login Successfully" };
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
      type: "email",
    });

    if (error) {
      throw new Error("Invalid verification code");
    }

    if (authData.session && authData.user) {
      return {
        ...authData,
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

export async function signOut() {
  const supabase = await createServer();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log(error);
  }

  redirect("/signin");
}
