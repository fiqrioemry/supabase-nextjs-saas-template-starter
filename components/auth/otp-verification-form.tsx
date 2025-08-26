"use client";

import {
  otpVerificationSchema,
  type OtpVerificationInput,
} from "@/lib/schemas/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtp, resendOtp } from "@/lib/actions/auth";
import { Loader2, CheckCircle, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface OtpVerificationFormProps {
  email: string;
}

export function OtpVerificationForm({ email }: OtpVerificationFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpVerificationInput>({
    resolver: zodResolver(otpVerificationSchema),
    defaultValues: { email },
  });

  const onSubmit = async (data: OtpVerificationInput) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await verifyOtp(data);
      setSuccess("Email verified successfully! Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid verification code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setError(null);
    setSuccess(null);

    try {
      await resendOtp(email);
      setSuccess("Verification code sent! Check your email.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <Mail className="w-6 h-6 text-primary" />
        </div>
        <h2 className="text-2xl font-bold">Check your email</h2>
        <p className="text-muted-foreground">
          We sent a verification code to <strong>{email}</strong>
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register("email")} />

        <div className="space-y-2">
          <Label htmlFor="token">Verification Code</Label>
          <Input
            id="token"
            type="text"
            placeholder="Enter 6-digit code"
            maxLength={6}
            {...register("token")}
            disabled={isLoading}
            className="text-center text-lg tracking-widest"
          />
          {errors.token && (
            <p className="text-sm text-destructive">{errors.token.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Verify Email
        </Button>
      </form>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Didn't receive the code?{" "}
          <Button
            variant="link"
            className="p-0 h-auto font-normal"
            onClick={handleResendOtp}
            disabled={isResending}
          >
            {isResending ? "Sending..." : "Resend code"}
          </Button>
        </p>
      </div>
    </div>
  );
}
