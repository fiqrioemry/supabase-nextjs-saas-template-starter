"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, XCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInWithPassword } from "@/lib/actions/auth";
import { AuthDivider } from "@/components/auth/auth-divider";
import { useRouter, useSearchParams } from "next/navigation";
import { GithubSignIn } from "@/components/auth/github-signin";
import { GoogleSignIn } from "@/components/auth/google-signin";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signInSchema, type SignInInput } from "@/lib/schemas/auth";
import { useAuth } from "@/providers/auth-providers";
import { toast } from "sonner";

export function SignInForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const params = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const returnUrl = params.get("returnUrl") || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    mode: "onChange",
  });

  // signin with password
  const onSubmit = async (data: SignInInput) => {
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("email", data.email);
    formData.append("password", data.password);

    try {
      const result = await signInWithPassword(formData);
      if (result.success) {
        setUser(result.data.user);
        toast.success(result.message);
        router.push(returnUrl);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <GoogleSignIn returnUrl={returnUrl} />
        <GithubSignIn returnUrl={returnUrl} />
      </div>

      <AuthDivider />

      {error && (
        <Alert className="bg-destructive/10" variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
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
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            {...register("password")}
            disabled={isLoading}
          />
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading || !isDirty || !isValid}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>
    </div>
  );
}
