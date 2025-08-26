"use server";

import { createServer } from "@/lib/supabase/server";
import { preferenceSchema, profileSchema } from "@/lib/schemas/user";

export async function getUser() {
  const supabase = await createServer();

  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;

  return { user: data.user };
}

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

  return { success: true, data };
}

export const deleteAccount = async () => {
  const supabase = await createServer();
  const { error } = await supabase.rpc("delete_account");
  if (error) throw error;
  return { success: true, message: "Account deleted successfully" };
};

export const updateProfile = async (form: FormData) => {
  const supabase = await createServer();

  // Extract and validate form data
  const formData = {
    bio: form.get("bio") as string,
    website: form.get("website") as string,
    display_name: form.get("display_name") as string,
  };

  const validation = profileSchema.safeParse(formData);

  if (!validation.success) {
    return {
      success: false,
      message: "Invalid form data input",
    };
  }

  const { data, error } = await supabase.auth.updateUser({
    data: { ...formData },
  });

  if (error) throw error;

  return {
    success: true,
    data: data.user,
  };
};

export const updatePreference = async (form: FormData) => {
  const supabase = await createServer();

  const formData = {
    theme: form.get("theme") as string,
    timezone: form.get("timezone") as string,
    language: form.get("language") as string,
  };

  const validation = preferenceSchema.safeParse(formData);

  if (!validation.success) {
    return {
      success: false,
      message: "Invalid form data input",
    };
  }

  const { data, error } = await supabase.auth.updateUser({
    data: { ...formData },
  });

  if (error) throw error;

  return {
    success: true,
    data: data.user,
  };
};
