"use client";

import { useAuthQuery } from "@/hooks/use-auth-query";
import { PreferenceForm } from "@/components/settings/preference-form";
import { EnhancedErrorState } from "@/components/ui/enhanced-error-state";
import { PreferenceSkeleton } from "@/components/settings/preference-skeleton";

export default function PreferencePage() {
  const { data, isLoading, error, refetch } = useAuthQuery();

  if (isLoading) {
    return <PreferenceSkeleton />;
  }

  if (error || !data?.user) {
    return <EnhancedErrorState error={error} onRetry={() => refetch()} />;
  }

  return <PreferenceForm user={data.user} />;
}
