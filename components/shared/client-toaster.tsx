// components/ClientToaster.tsx
"use client";

import { Toaster } from "@/components/ui/sonner";
import { useTheme } from "next-themes";

export function ClientToaster() {
  const { theme } = useTheme();
  return <Toaster theme={theme as "light" | "dark" | "system"} richColors />;
}
