import { cookies } from "next/headers";
import { createUserProfile } from "@/lib/actions/user";
import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const redirectTo = requestUrl.searchParams.get("redirectTo") || "/dashboard";

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("Auth callback error:", error);
        return NextResponse.redirect(
          `${requestUrl.origin}/signin?error=auth_error`
        );
      }

      if (data.user) {
        // Check if user profile exists, create if not
        const { data: existingProfile } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", data.user.id)
          .single();

        if (!existingProfile) {
          // Create profile for OAuth users
          const userMetadata = data.user.user_metadata;
          await createUserProfile(data.user.id, {
            display_name:
              userMetadata.display_name ||
              userMetadata.full_name ||
              userMetadata.name ||
              "User",
            bio: "",
            website: "",
          });
        }
      }

      return NextResponse.redirect(`${requestUrl.origin}${redirectTo}`);
    } catch (error) {
      console.error("Unexpected error in auth callback:", error);
      return NextResponse.redirect(
        `${requestUrl.origin}/signin?error=unexpected_error`
      );
    }
  }

  // If no code, redirect to signin
  return NextResponse.redirect(`${requestUrl.origin}/signin`);
}
