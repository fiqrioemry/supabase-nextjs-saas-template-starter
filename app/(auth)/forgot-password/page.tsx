"use client";

import React, { useState } from "react";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import Link from "next/link";
import z from "zod";
import { toast } from "sonner";
import { Mail } from "lucide-react";
import { FormProvider } from "react-hook-form";
import { useFormSchema } from "@/hooks/use-form-schema";
import { EmailField } from "@/components/form-fields/email-field";
import { SubmitButton } from "@/components/form-control/submit-button";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email").min(1, "Email is required"),
});

type ForgotPasswordForm = z.infer<typeof ForgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [sentTo, setSentTo] = useState<string>("");

  const form = useFormSchema({
    action: handleForgotPassword,
    schema: ForgotPasswordSchema,
    mode: "onChange",
  });

  async function handleForgotPassword(data: ForgotPasswordForm) {
    setEmailSent(true);
    setSentTo(data.email);
    form.reset();
    toast.success(
      "If an account exists with this email, you will receive a reset link"
    );
  }

  return (
    <Card className="max-w-md w-full shadow bg-card z-20 font-mono">
      {!emailSent ? (
        <>
          <CardHeader className="space-y-2">
            <CardTitle className="text-center text-2xl">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your email to receive a password reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormProvider {...form.methods}>
              <form onSubmit={form.handleSubmit} className="space-y-3">
                <EmailField
                  name="email"
                  placeholder="john.doe@example.com"
                  reset
                />
                <div className="mt-4">
                  <SubmitButton
                    text="Send Reset Link"
                    isLoading={form.isSubmitting}
                    disabled={!form.isValid || form.isSubmitting}
                  />
                </div>
              </form>
            </FormProvider>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm">
              Remember your password?{" "}
              <Link
                href="/signin"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Sign In
              </Link>
            </div>
          </CardFooter>
        </>
      ) : (
        <>
          <CardHeader className="space-y-2">
            <div className="flex justify-center">
              <Mail className="h-12 w-12 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              Check your email
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              If an account exists, we have sent a password reset link to:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center font-medium">{sentTo}</p>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Please check your inbox and click the reset link to continue.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-sm text-muted-foreground text-center">
              Didn’t get the email? Check your spam folder.
            </p>
            <Link
              href="/signin"
              className="text-primary font-medium hover:underline text-center"
            >
              Back to Sign In
            </Link>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
