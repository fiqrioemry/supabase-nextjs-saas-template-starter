// fields/ShortTextField.tsx
"use client";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Controller, useFormContext } from "react-hook-form";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";

interface ShortTextFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  minLength?: number;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
  reset?: boolean;
}

export function ShortTextField({
  name,
  label,
  placeholder,
  helperText,
  minLength,
  maxLength,
  disabled,
  className,
  reset,
}: ShortTextFieldProps) {
  const { control, formState } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FieldWrapper
          name={name}
          label={label}
          helperText={helperText}
          error={formState.errors?.[name]?.message as string}
          className={className}
        >
          <div className="relative">
            <Input
              id={name}
              type="text"
              {...field}
              value={field.value ?? ""}
              placeholder={placeholder}
              disabled={disabled}
              minLength={minLength}
              maxLength={maxLength}
            />
            {reset && field.value && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => field.onChange("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                tabIndex={-1}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </FieldWrapper>
      )}
    />
  );
}
