"use client";

import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { User } from "lucide-react";
import { useAuthQuery } from "@/hooks/use-auth-query";
import { ProfileForm } from "@/components/settings/profile-form";
import { ProfileSkeleton } from "@/components/settings/profile-skeleton";
import { EnhancedErrorState } from "@/components/ui/enhanced-error-state";

// TODO : error ui ux flicker not fixed

export default function ProfilePage() {
  const { data, isLoading, error, refetch } = useAuthQuery();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error || !data?.user) {
    return <EnhancedErrorState error={error} onRetry={() => refetch()} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          User Profile
        </CardTitle>
        <CardDescription>
          Manage your profile settings, including personal information and
          account details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <ProfileForm user={data.user} />
      </CardContent>
    </Card>
  );
}
