import { Skeleton } from "@/components/ui/skeleton";
import { LoaderCircle } from "lucide-react";
import React from "react";

export default function Loading() {
  return (
    <section className="max-w-7xl w-full mx-auto py-8 px-4">
      <nav className="flex gap-2 mb-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-10 w-48 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"
          />
        ))}
      </nav>

      {/* Skeleton Content */}
      <Skeleton className="h-96 rounded-lg" />
    </section>
  );
}
