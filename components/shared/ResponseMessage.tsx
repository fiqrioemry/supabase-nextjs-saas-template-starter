import { CircleCheck, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export const ErrorMessageBox = ({ message }: { message: string | null }) => {
  if (!message) return null;
  return (
    <Alert className="flex items-center bg-destructive/10 border-destructive text-destructive mb-4">
      <div>
        <AlertCircle className="h-5 w-5 mr-2" />
      </div>
      <AlertDescription className="text-destructive">
        {message}
      </AlertDescription>
    </Alert>
  );
};

export const SuccessMessageBox = ({ message }: { message: string | null }) => {
  if (!message) return null;
  return (
    <Alert className="flex items-center bg-green-100 border-green-500 text-green-700 mb-4">
      <div>
        <CircleCheck className="h-5 w-5 mr-2" />
      </div>
      <AlertDescription className="text-green-700">{message}</AlertDescription>
    </Alert>
  );
};
