import { createServer } from "@/lib/supabase/server";

// get user balance
export const getUserBalance = async () => {
  const supabase = await createServer();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userId = user?.id;

  const { data, error } = await supabase
    .from("balance")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
