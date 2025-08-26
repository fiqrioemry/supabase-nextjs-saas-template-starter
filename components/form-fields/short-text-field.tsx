// fields/ShortTextField.tsx
"use client";
import { Input } from "@/components/ui/input";
import { Controller, useFormContext } from "react-hook-form";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";

export function ShortTextField({
  name,
  label,
  placeholder,
  helperText,
  minLength,
  maxLength,
  disabled,
  className,
}: {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  minLength?: number;
  maxLength?: number;
  disabled?: boolean;
  className?: string;
}) {
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
        </FieldWrapper>
      )}
    />
  );
}
