import { getLocationData } from "@/lib/actions/auth";
import { NextRequest, NextResponse } from "next/server";
import { createServer } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (code) {
    const supabase = await createServer();

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (error) {
        console.error("Auth callback error:", error);
        return NextResponse.redirect(`${baseUrl}/signin?error=auth_error`);
      }

      if (data.user) {
        // get user raw metadata
        const userMetadata = data.user?.user_metadata;
        const locationData = await getLocationData();

        // update user data to synchronize with signup
        await supabase.auth.updateUser({
          data: {
            display_name: userMetadata.full_name,
            avatar_url: userMetadata?.avatar_url,
            bio: "",
            website: "",
            theme: "system",
            language: locationData.language,
            timezone: locationData.timezone,
          },
        });
      }

      return NextResponse.redirect(`${baseUrl}${redirectTo}`);
    } catch (error) {
      console.error("Unexpected error in auth callback:", error);
      return NextResponse.redirect(`${baseUrl}/signin?error=unexpected_error`);
    }
  }

  // If no code exchanged, redirect to signin
  return NextResponse.redirect(`${baseUrl}/signin`);
}
