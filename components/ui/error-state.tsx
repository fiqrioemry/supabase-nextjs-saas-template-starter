import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  showRetry?: boolean;
  className?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "We encountered an error while loading your data. Please try again.",
  onRetry,
  showRetry = true,
  className = "",
}: ErrorStateProps) {
  return (
    <Card className={`border-destructive/50 ${className}`}>
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 rounded-full bg-destructive/10 p-3">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {title}
        </h3>
        
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          {message}
        </p>
        
        {showRetry && onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Specific error states for common scenarios
export function DataLoadError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Failed to load data"
      message="We couldn't load your information. This might be due to a network issue or temporary server problem."
      onRetry={onRetry}
      showRetry={!!onRetry}
    />
  );
}

export function UserDataError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="User data unavailable"
      message="We're having trouble loading your profile information. Please check your connection and try again."
      onRetry={onRetry}
      showRetry={!!onRetry}
    />
  );
}

export function NetworkError({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="Connection error"
      message="It looks like you've lost your internet connection. Please check your network and try again."
      onRetry={onRetry}
      showRetry={!!onRetry}
    />
  );
}
