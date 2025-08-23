import React from "react";
import { LoaderCircle } from "lucide-react";

export function DashboardLoading() {
  return (
    <section className="flex items-center justify-center h-screen bg-background">
      <div className="text-center ">
        <LoaderCircle className="animate-spin mx-auto h-12 w-12 mb-4" />
        <span className="text-muted-foreground">Loading, please wait ...</span>
      </div>
    </section>
  );
}
