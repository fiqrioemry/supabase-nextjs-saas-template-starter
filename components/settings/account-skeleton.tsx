import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function AccountSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      {/* Header + Avatar */}
      <div className="rounded-2xl shadow-sm border mb-8 overflow-hidden">
        <div className="relative h-32 bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse" />
        <div className="relative px-6 pb-6">
          <div className="flex items-end justify-between -mt-16 mb-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Skeleton className="w-full h-full rounded-full" />
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <div className="flex flex-wrap items-center gap-4">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-40" />
            </div>
            <Skeleton className="h-4 w-[28rem] max-w-full" />
            <Skeleton className="h-4 w-[22rem] max-w-full" />
          </div>
        </div>
      </div>

      {/* Update Password Card */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-40" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-40 rounded-md" />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone Card */}
      <Card className="border-destructive bg-destructive/10">
        <CardHeader>
          <CardTitle className="text-destructive">
            <Skeleton className="h-5 w-32" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-72" />
            </div>
            <Skeleton className="h-10 w-44 rounded-md" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
