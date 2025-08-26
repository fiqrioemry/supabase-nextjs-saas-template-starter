"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SignUpForm } from "@/components/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardContent>
              <SignUpForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
