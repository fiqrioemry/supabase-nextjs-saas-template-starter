import { useCallback } from "react";

export interface ErrorInfo {
  type: "network" | "auth" | "server" | "validation" | "unknown";
  title: string;
  message: string;
  canRetry: boolean;
  severity: "low" | "medium" | "high";
}

export const useErrorHandler = () => {
  const categorizeError = useCallback((error: any): ErrorInfo => {
    // Network errors
    if (error?.message?.includes("fetch") || error?.message?.includes("network")) {
      return {
        type: "network",
        title: "Connection Error",
        message: "Please check your internet connection and try again.",
        canRetry: true,
        severity: "medium",
      };
    }

    // Authentication errors
    if (error?.status === 401 || error?.message?.includes("auth")) {
      return {
        type: "auth",
        title: "Authentication Required",
        message: "Please sign in again to continue.",
        canRetry: false,
        severity: "high",
      };
    }

    // Server errors
    if (error?.status >= 500 || error?.message?.includes("server")) {
      return {
        type: "server",
        title: "Server Error",
        message: "Our servers are experiencing issues. Please try again later.",
        canRetry: true,
        severity: "medium",
      };
    }

    // Validation errors
    if (error?.status === 400 || error?.message?.includes("validation")) {
      return {
        type: "validation",
        title: "Invalid Data",
        message: "Please check your input and try again.",
        canRetry: true,
        severity: "low",
      };
    }

    // Unknown errors
    return {
      type: "unknown",
      title: "Something Went Wrong",
      message: "An unexpected error occurred. Please try again.",
      canRetry: true,
      severity: "medium",
    };
  }, []);

  const getErrorComponent = useCallback((error: any, onRetry?: () => void) => {
    const errorInfo = categorizeError(error);
    
    // You can import and return different error components based on error type
    return {
      errorInfo,
      canRetry: errorInfo.canRetry && !!onRetry,
      onRetry,
    };
  }, [categorizeError]);

  return {
    categorizeError,
    getErrorComponent,
  };
};
