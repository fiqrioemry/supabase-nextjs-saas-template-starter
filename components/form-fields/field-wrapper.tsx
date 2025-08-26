"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function FieldWrapper({
  name,
  label,
  helperText,
  error,
  children,
  className,
}: {
  name?: string;
  label?: string;
  helperText?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium">
          {label}
        </label>
      )}
      {children}
      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
