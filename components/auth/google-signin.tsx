"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { signInWithOAuth } from "@/lib/api/auth";

interface GoogleSignInProps {
  returnUrl?: string;
}

export function GoogleSignIn({ returnUrl }: GoogleSignInProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOAuthSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithOAuth("google", returnUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={() => handleOAuthSignIn()}
      disabled={isLoading}
      className="w-full h-12 flex items-center justify-center text-sm font-medium tracking-wide rounded-full bg-background text-foreground border border-border hover:bg-accent/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed font-sans"
      type="button"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <FcGoogle className="w-4 h-4 mr-2" />
      )}
      <span className="font-medium">
        {isLoading ? "Signing in..." : "Continue with Google"}
      </span>
    </button>
  );
}
