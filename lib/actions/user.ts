"use server";

import { revalidatePath } from "next/cache";
import { createServer } from "@/lib/supabase/server";
import { useAuthStore } from "@/lib/store/auth-store";
import { preferenceSchema, profileSchema } from "@/lib/schemas/user";

export async function updateUserProfile(formData: FormData) {
  const supabase = await createServer();

  // Get current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "User not authenticated" };
  }

  // Extract and validate form data
  const rawData = {
    display_name: formData.get("display_name") as string,
    bio: formData.get("bio") as string,
    website: formData.get("website") as string,
  };

  const validation = profileSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      error: "Invalid form data",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const updateData = validation.data;

  // Update profile in database
  const { data, error } = await supabase.auth.updateUser({
    data: {
      display_name: updateData.display_name,
      bio: updateData?.bio,
      website: updateData?.website,
    },
  });

  if (error) {
    return { error: "Failed to update profile" };
  }

  // Revalidate the dashboard page
  revalidatePath("/dashboard");

  return { success: true, data };
}

export const deleteAccount = async () => {
  const supabase = await createServer();
  const { clearAuth } = useAuthStore.getState();

  const { data, error } = await supabase.rpc("delete_account");
  if (error) throw error;

  clearAuth();
  return data;
};

export const changePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  const supabase = await createServer();
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      throw new Error("User not found");
    }

    // 1. Re-authenticate user dengan password lama
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      throw new Error("Current password is incorrect");
    }

    // 2. Jika berhasil, update password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      throw new Error("Failed to update password");
    }

    return { success: true, message: "Password updated successfully" };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const updateProfile = async (form: FormData) => {
  const { setUser } = useAuthStore.getState();
  const supabase = await createServer();

  // Extract and validate form data
  const rawData = {
    bio: form.get("bio") as string,
    website: form.get("website") as string,
    display_name: form.get("display_name") as string,
  };

  const validation = profileSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Invalid form data input",
    };
  }

  const { data, error } = await supabase.auth.updateUser({
    data: { ...form },
  });

  if (error) throw error;

  setUser(data.user);

  return {
    success: true,
    data: data.user,
  };
};

export const updatePreference = async (form: FormData) => {
  const { setUser } = useAuthStore.getState();
  const supabase = await createServer();

  // Extract and validate form data
  const rawData = {
    theme: form.get("theme") as string,
    location: form.get("location") as string,
    timezone: form.get("timezone") as string,
    language: form.get("language") as string,
  };

  const validation = preferenceSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      success: false,
      message: "Invalid form data input",
    };
  }

  const { data, error } = await supabase.auth.updateUser({
    data: { ...form },
  });

  if (error) throw error;

  setUser(data.user);

  return {
    success: true,
    data: data.user,
  };
};
