"use client";

import { useState } from "react";
import {
  CircleCheck,
  Loader2,
  ArrowLeft,
  Mail,
  X,
  XCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signUpWithPassword, verifyOtp, resendOtp } from "@/lib/actions/auth";
import {
  signUpSchema,
  otpVerificationSchema,
  type SignUpInput,
  type OtpVerificationInput,
} from "@/lib/schemas/auth";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { AuthDivider } from "@/components/auth/auth-divider";
import { GoogleSignIn } from "@/components/auth/google-signin";
import { GithubSignIn } from "@/components/auth/github-signin";

type SignUpStep = "signup" | "otp-verification" | "success";

export function SignUpForm() {
  const params = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const returnUrl = params.get("returnUrl") || "/dashboard";
  const [currentStep, setCurrentStep] = useState<SignUpStep>("signup");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");

  // Form for signup
  const signupForm = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    mode: "onChange",
  });

  // Form for OTP verification
  const otpForm = useForm<OtpVerificationInput>({
    resolver: zodResolver(otpVerificationSchema),
    mode: "onChange",
  });

  const onSignUp = async (data: SignUpInput) => {
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("fullname", data.fullname);
    formData.append("redirectUrl", returnUrl);

    try {
      const result = await signUpWithPassword(formData);

      if (result.success) {
        setUserEmail(data.email);

        // Check if verification is needed
        if (result.needsVerification) {
          setSuccessMessage(
            result.message || "Verification code sent to your email!"
          );
          setCurrentStep("otp-verification");
          // Pre-fill email in OTP form
          otpForm.setValue("email", data.email);
        } else {
          // Account created and verified immediately (development mode)
          setSuccessMessage(result.message || "Account created successfully!");
          setCurrentStep("success");

          // Auto-redirect after success
          setTimeout(() => {
            const redirectUrl = params.get("redirectUrl") || "/dashboard";
            router.push(redirectUrl);
          }, 2000);
        }
      } else {
        setError(result.message || "Failed to create account");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyOtp = async (data: OtpVerificationInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await verifyOtp(data);

      if (result) {
        setSuccessMessage("Account verified successfully! Redirecting...");
        setCurrentStep("success");

        setTimeout(() => {
          const redirectUrl = params.get("redirectUrl") || "/dashboard";
          router.push(redirectUrl);
        }, 2000);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invalid verification code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!userEmail) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await resendOtp(userEmail);
      if (result.success) {
        setSuccessMessage(result.message || "Verification code sent again!");
      } else {
        setError(result.message || "Failed to resend code");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend code");
    } finally {
      setIsLoading(false);
    }
  };

  const goBackToSignup = () => {
    setCurrentStep("signup");
    setError(null);
    setSuccessMessage(null);
    otpForm.reset();
  };

  // Signup Step
  if (currentStep === "signup") {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Create Account</h2>
          <p className="text-muted-foreground text-sm mt-2">
            Enter your details to create a new account
          </p>
        </div>

        <div className="space-y-2">
          <GoogleSignIn returnUrl={returnUrl} />
          <GithubSignIn returnUrl={returnUrl} />
        </div>

        <AuthDivider />

        {error && (
          <Alert className="bg-destructive/10 text-destructive">
            <XCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form
          onSubmit={signupForm.handleSubmit(onSignUp)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Input
              id="fullname"
              type="text"
              placeholder="Enter your full name"
              {...signupForm.register("fullname")}
              disabled={isLoading}
            />
            {signupForm.formState.errors.fullname && (
              <p className="text-sm text-destructive">
                {signupForm.formState.errors.fullname.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              {...signupForm.register("email")}
              disabled={isLoading}
            />
            {signupForm.formState.errors.email && (
              <p className="text-sm text-destructive">
                {signupForm.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              id="password"
              type="password"
              placeholder="Create a strong password (min. 6 characters)"
              {...signupForm.register("password")}
              disabled={isLoading}
            />
            {signupForm.formState.errors.password && (
              <p className="text-sm text-destructive">
                {signupForm.formState.errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              isLoading ||
              !signupForm.formState.isDirty ||
              !signupForm.formState.isValid
            }
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>
        <div>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <Link
              href="/signin"
              className="text-primary hover:underline font-medium"
            >
              Sign in
            </Link>
          </div>
          <div className=" mt-2 text-center">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:underline"
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // OTP Verification Step
  if (currentStep === "otp-verification") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold">Verify Your Email</h2>
          <p className="text-muted-foreground mt-2">
            We've sent a verification code to
          </p>
          <p className="font-medium text-sm">{userEmail}</p>
        </div>

        {error && (
          <Alert className="bg-destructive/10 text-destructive border-destructive">
            <X className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {successMessage && (
          <Alert className="bg-green-100 text-green-500 border-green-500">
            <CircleCheck className="h-4 w-4 mr-2" />
            <AlertDescription className="text-green-600">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        <form
          onSubmit={otpForm.handleSubmit(onVerifyOtp)}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              maxLength={6}
              className="text-center text-lg tracking-widest"
              {...otpForm.register("token")}
              disabled={isLoading}
            />
            {otpForm.formState.errors.token && (
              <p className="text-sm text-destructive">
                {otpForm.formState.errors.token.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Verify Code
          </Button>
        </form>

        <div className="text-center space-y-4">
          <div className="text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={isLoading}
              className="text-primary hover:underline font-medium"
            >
              Resend Code
            </button>
          </div>

          <button
            type="button"
            onClick={goBackToSignup}
            disabled={isLoading}
            className="flex items-center justify-center text-sm text-muted-foreground hover:text-primary transition-colors mx-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign Up
          </button>
        </div>
      </div>
    );
  }

  // Success Step
  if (currentStep === "success") {
    return (
      <div className="space-y-6 text-center">
        <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CircleCheck className="w-8 h-8 text-green-600" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-green-800">Welcome!</h2>
          <p className="text-muted-foreground mt-2">
            Your account has been verified successfully
          </p>
        </div>

        {successMessage && (
          <Alert className="bg-green-100 text-green-500 border-green-500">
            <CircleCheck className="h-4 w-4 mr-2" />
            <AlertDescription className="text-green-600">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return null;
}
