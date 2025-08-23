"use server";

import { revalidatePath } from "next/cache";
import { createServer } from "@/lib/supabase/server";
import { profileUpdateSchema } from "@/lib/schemas/auth";

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
