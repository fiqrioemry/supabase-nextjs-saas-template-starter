import { AlertCircle, RefreshCw, Wifi, Shield, Server, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useErrorHandler } from "@/hooks/use-error-handler";

interface EnhancedErrorStateProps {
  error: any;
  onRetry?: () => void;
  className?: string;
}

const getErrorIcon = (type: string) => {
  switch (type) {
    case "network":
      return <Wifi className="h-8 w-8 text-orange-500" />;
    case "auth":
      return <Shield className="h-8 w-8 text-red-500" />;
    case "server":
      return <Server className="h-8 w-8 text-purple-500" />;
    case "validation":
      return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
    default:
      return <AlertCircle className="h-8 w-8 text-destructive" />;
  }
};

const getErrorColor = (severity: string) => {
  switch (severity) {
    case "low":
      return "border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20";
    case "medium":
      return "border-orange-500/50 bg-orange-50 dark:bg-orange-950/20";
    case "high":
      return "border-red-500/50 bg-red-50 dark:bg-red-950/20";
    default:
      return "border-destructive/50 bg-destructive/10";
  }
};

export function EnhancedErrorState({ error, onRetry, className = "" }: EnhancedErrorStateProps) {
  const { categorizeError } = useErrorHandler();
  const errorInfo = categorizeError(error);

  return (
    <Card className={`${getErrorColor(errorInfo.severity)} ${className}`}>
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 rounded-full bg-background p-3 shadow-sm">
          {getErrorIcon(errorInfo.type)}
        </div>
        
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          {errorInfo.title}
        </h3>
        
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          {errorInfo.message}
        </p>
        
        {errorInfo.canRetry && onRetry && (
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

        {errorInfo.type === "auth" && (
          <Button
            onClick={() => window.location.href = "/signin"}
            variant="default"
            size="sm"
            className="gap-2 mt-2"
          >
            Sign In
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

// Specific error states for common scenarios
export function NetworkErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="border-orange-500/50 bg-orange-50 dark:bg-orange-950/20">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 rounded-full bg-background p-3 shadow-sm">
          <Wifi className="h-8 w-8 text-orange-500" />
        </div>
        
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          Connection Lost
        </h3>
        
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          It looks like you've lost your internet connection. Please check your network and try again.
        </p>
        
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry Connection
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export function ServerErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <Card className="border-purple-500/50 bg-purple-50 dark:bg-purple-950/20">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 rounded-full bg-background p-3 shadow-sm">
          <Server className="h-8 w-8 text-purple-500" />
        </div>
        
        <h3 className="mb-2 text-lg font-semibold text-foreground">
          Server Error
        </h3>
        
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          Our servers are experiencing issues. Please try again in a few minutes.
        </p>
        
        {onRetry && (
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
