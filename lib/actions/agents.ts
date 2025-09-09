"use server";

import { createServer } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export const createAgent = async (formData: FormData) => {
  const supabase = await createServer();

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  const { data, error } = await supabase
    .from("agents")
    .insert([{ name, description }]);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/bots");

  return { success: true, data, message: "Agent created successfully" };
};
