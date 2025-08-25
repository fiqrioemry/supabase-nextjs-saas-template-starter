"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function NavbarSkeleton() {
  return (
    <header className="sticky z-50 flex justify-center top-4 mx-2 md:mx-0">
      <div className="mx-auto w-full max-w-7xl rounded-2xl border border-border backdrop-blur-lg bg-background/75 px-3 md:px-7">
        <div className="flex h-[56px] items-center justify-between p-2 md:p-4">
          {/* Left Section - Logo */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-full" /> {/* Theme Toggle */}
            <Skeleton className="h-8 w-24 rounded-full" /> {/* Button / Link */}
            <Skeleton className="h-8 w-8 rounded-md md:hidden" />{" "}
            {/* Mobile menu */}
          </div>
        </div>
      </div>
    </header>
  );
}
