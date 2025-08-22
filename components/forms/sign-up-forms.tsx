"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type SignUpInput } from "@/schemas/auth";
import { signUpWithPassword } from "@/lib/api/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { OtpVerificationForm } from "./otp-verification-form";

export function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await signUpWithPassword(data);

      if (result.user && !result.session) {
        // User created but needs email verification
        setUserEmail(data.email);
        setShowOtpForm(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (showOtpForm) {
    return <OtpVerificationForm email={userEmail} />;
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            disabled={isLoading}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password (min. 6 characters)"
            {...register("password")}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-sm text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            {...register("confirmPassword")}
            disabled={isLoading}
          />
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="display_name">Display Name</Label>
          <Input
            id="display_name"
            type="text"
            placeholder="Enter your display name"
            {...register("display_name")}
            disabled={isLoading}
          />
          {errors.display_name && (
            <p className="text-sm text-destructive">
              {errors.display_name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio (Optional)</Label>
          <Textarea
            id="bio"
            placeholder="Tell us about yourself (max 160 characters)"
            {...register("bio")}
            disabled={isLoading}
            maxLength={160}
          />
          {errors.bio && (
            <p className="text-sm text-destructive">{errors.bio.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website (Optional)</Label>
          <Input
            id="website"
            type="url"
            placeholder="https://your-website.com"
            {...register("website")}
            disabled={isLoading}
          />
          {errors.website && (
            <p className="text-sm text-destructive">{errors.website.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>
      </form>
    </div>
  );
}
