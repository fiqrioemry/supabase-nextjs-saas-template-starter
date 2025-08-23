import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="max-w-7xl mx-auto" aria-busy="true" aria-live="polite">
      <div className="rounded-2xl shadow-sm border p-6">
        {/* Header */}
        <div className="mb-6 space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-64" />
        </div>

        {/* Read-only fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl border mb-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" /> {/* Label */}
            <Skeleton className="h-10 w-full rounded-lg" /> {/* Email */}
            <Skeleton className="h-3 w-40" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-28" /> {/* Label */}
            <Skeleton className="h-10 w-full rounded-lg" /> {/* Created At */}
            <Skeleton className="h-3 w-32" />
          </div>
        </div>

        {/* Editable fields */}
        <div className="space-y-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" /> {/* Label */}
              <Skeleton className="h-10 w-full rounded-lg" /> {/* Full Name */}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" /> {/* Label */}
              <Skeleton className="h-10 w-full rounded-lg" /> {/* Website */}
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" /> {/* Label */}
            <Skeleton className="h-24 w-full rounded-lg" /> {/* Bio */}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Skeleton className="h-4 w-40" /> {/* Unsaved changes text */}
          <div className="flex gap-3">
            <Skeleton className="h-10 w-24 rounded-md" /> {/* Cancel */}
            <Skeleton className="h-10 w-32 rounded-md" /> {/* Save */}
          </div>
        </div>
      </div>
    </div>
  );
}
