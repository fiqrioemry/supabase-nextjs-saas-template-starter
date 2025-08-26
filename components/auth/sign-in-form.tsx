"use client";

import { toast } from "sonner";
import { useState } from "react";
import { XCircle } from "lucide-react";
import { FieldConfig } from "@/lib/types/form";
import { useAuth } from "@/providers/auth-providers";
import type { SignInInput } from "@/lib/schemas/auth";
import { signInWithPassword } from "@/lib/actions/auth";
import { AuthDivider } from "@/components/auth/auth-divider";
import { useRouter, useSearchParams } from "next/navigation";
import { GithubSignIn } from "@/components/auth/github-signin";
import { GoogleSignIn } from "@/components/auth/google-signin";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FormRenderer } from "@/components/form-control/form-renderer";
import { FormSubmitButton } from "@/components/form-control/form-submit";

const signInFields: FieldConfig[] = [
  {
    type: "email",
    name: "email",
    placeholder: "Enter your email",
    validation: {
      required: true,
    },
  },
  {
    type: "password",
    name: "password",
    placeholder: "Enter your password",
    validation: {
      required: true,
    },
  },
];

export function SignInForm() {
  const router = useRouter();
  const { setUser } = useAuth();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const returnUrl = params.get("returnUrl") || "/dashboard";

  // signin with password
  const onSubmit = async (data: SignInInput) => {
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

      <FormRenderer mode="onSubmit" fields={signInFields} onSubmit={onSubmit}>
        <FormSubmitButton label="Login" mode="onSubmit" />
      </FormRenderer>
    </div>
  );
}
