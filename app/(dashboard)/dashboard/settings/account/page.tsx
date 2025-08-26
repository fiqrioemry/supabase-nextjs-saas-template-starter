"use client";

import { useAuthQuery } from "@/hooks/use-auth-query";
import { AccountForm } from "@/components/settings/account-form";
import { AccountSkeleton } from "@/components/settings/account-skeleton";
import { EnhancedErrorState } from "@/components/ui/enhanced-error-state";

export default function AccountPage() {
  const { data, isLoading, error, refetch } = useAuthQuery();

  if (isLoading) {
    return <AccountSkeleton />;
  }

  if (error || !data?.user) {
    return <EnhancedErrorState error={error} onRetry={() => refetch()} />;
  }

  return <AccountForm user={data.user} />;
}
