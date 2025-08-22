"use server";

import { createServer } from "@/lib/supabase/server";
import { profileUpdateSchema, type ProfileUpdateInput } from "@/schemas/auth";
import { revalidatePath } from "next/cache";

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

  const validation = profileUpdateSchema.safeParse(rawData);

  if (!validation.success) {
    return {
      error: "Invalid form data",
      fieldErrors: validation.error.flatten().fieldErrors,
    };
  }

  const updateData = validation.data;

  // Update profile in database
  const { data, error } = await supabase
    .from("profiles")
    .update({
      display_name: updateData.display_name,
      bio: updateData.bio || null,
      website: updateData.website || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile" };
  }

  // Revalidate the dashboard page
  revalidatePath("/dashboard");

  return { success: true, data };
}

export async function createUserProfile(
  userId: string,
  profileData: ProfileUpdateInput
) {
  const supabase = createServer();

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      display_name: profileData.display_name,
      bio: profileData.bio || null,
      website: profileData.website || null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating profile:", error);
    return { error: "Failed to create profile" };
  }

  return { success: true, data };
}
