import { Bot } from "lucide-react";
import React from "react";

export function AppLogo() {
  return (
    <div className="flex gap-2 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
      <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
        <Bot className="size-4" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">Formgen.io</span>
        <span className="truncate text-xs">generate form easily</span>
      </div>
    </div>
  );
}
