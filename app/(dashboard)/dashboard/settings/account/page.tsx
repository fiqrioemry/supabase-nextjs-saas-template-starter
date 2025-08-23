"use client";

import { formatDate } from "@/lib/utils";
import { deleteAccount } from "@/lib/actions/user";
import { Calendar, Mail, User } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { DialogConfirm } from "@/components/shared/dialog-confirm";
import { ChangePassword } from "@/components/settings/change-password-dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function AccountPage() {
  const { user } = useAuthStore();

  const handleDeleteAccount = async () => {
    await deleteAccount();
  };

  return (
    <div className="space-y-6">
      {/* Account Heading - Improved */}
      <Card className="overflow-hidden border-0 p-0 bg-gradient-to-br from-card to-muted/20">
        {/* Background Header */}
        <div className="relative h-32 bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10">
          {/* Decorative pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.1),rgba(0,0,0,0))]" />

          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            <div className="h-full w-full bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)] bg-[size:20px_20px]" />
          </div>
        </div>

        <CardContent className="relative px-6 pb-6">
          {/* Avatar Section */}
          <div className="flex items-end justify-between -mt-16 mb-6">
            <div className="relative">
              {/* Avatar Container with improved styling */}
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-xl ring-1 ring-border/50">
                {user?.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata?.avatar_url}
                    alt={user.user_metadata?.display_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20 dark:from-primary/10 dark:to-accent/10">
                    {user?.user_metadata?.display_name ? (
                      <span className="text-foreground text-3xl font-bold">
                        {user.user_metadata.display_name
                          .charAt(0)
                          .toUpperCase()}
                      </span>
                    ) : (
                      <User className="w-12 h-12 text-muted-foreground" />
                    )}
                  </div>
                )}
              </div>

              {/* Online status indicator */}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-background shadow-sm" />
            </div>
          </div>

          {/* User Information */}
          <div className="space-y-4">
            {/* Name and basic info */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                {user?.user_metadata?.display_name || "Welcome"}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="font-medium">{user?.email}</span>
                </div>

                <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-full">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span className="font-medium">
                    Joined {formatDate(user?.created_at ?? "")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full" />
            Account Security
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-foreground">
                Change Password
              </h4>
              <p className="text-sm text-muted-foreground">
                Update your password regularly to keep your account secure.
              </p>
            </div>
            <ChangePassword />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone - Improved styling */}
      <Card className="border-destructive/20 bg-destructive/5 dark:bg-destructive/5">
        <CardHeader>
          <CardTitle className="text-destructive flex items-center gap-2">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-foreground">
                Delete Account
              </h4>
              <p className="text-sm text-muted-foreground">
                Once you delete your account, there is no going back. Please be
                certain.
              </p>
            </div>

            <DialogConfirm
              onConfirm={handleDeleteAccount}
              triggerButtonText="Delete Account"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
