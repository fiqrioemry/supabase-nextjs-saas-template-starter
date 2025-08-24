"use client";

import {
  QueryClient,
  HydrationBoundary,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";
import { isLocalMode } from "@/lib/config";
import { Toaster } from "@/components/ui/sonner";
import { handleApiError } from "@/lib/error-handler";
import { ThemeProvider, useTheme } from "next-themes";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function ReactQueryProvider({
  children,
  dehydratedState,
}: {
  children: React.ReactNode;
  dehydratedState?: unknown;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 10 * 1000,
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
            onError: (error: any, variables: any, context: any) => {
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

  return (
    <ThemeProvider
      enableSystem
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary
          state={
            dehydratedState as import("@tanstack/react-query").DehydratedState
          }
        >
          <Toaster theme={theme as "light" | "dark" | "system"} richColors />;
          {children}
          {isLocal && <ReactQueryDevtools initialIsOpen={false} />}
        </HydrationBoundary>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
