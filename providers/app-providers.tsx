"use client";

import {
  dehydrate,
  QueryClient,
  HydrationBoundary,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";
import { isLocalMode } from "@/lib/config";
import { AuthProvider } from "./auth-providers";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider, useTheme } from "next-themes";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { handleApiError } from "@/lib/error-handler";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000,
            gcTime: 5 * 60 * 1000,
            retry: (failureCount, error: any) => {
              if (error?.status >= 400 && error?.status < 500) return false;
              if (error?.status === 404) return false;
              return failureCount < 3;
            },
            refetchOnMount: true,
            refetchOnWindowFocus: true,
            refetchOnReconnect: "always",
          },
          mutations: {
            retry: (failureCount, error: any) => {
              if (error?.status >= 400 && error?.status < 500) return false;
              return failureCount < 1;
            },
            onError: (error: any) => {
              handleApiError(error, {
                operation: "perform action",
                silent: false,
              });
            },
          },
        },
      })
  );

  const { theme } = useTheme();
  const isLocal = isLocalMode();
  const dehydratedState = dehydrate(queryClient);

  return (
    <ThemeProvider
      enableSystem
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary state={dehydratedState}>
          <Toaster theme={theme as "light" | "dark" | "system"} richColors />
          <AuthProvider>{children}</AuthProvider>
          {isLocal && <ReactQueryDevtools initialIsOpen={false} />}
        </HydrationBoundary>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
