// fields/TimeField.tsx
"use client";
import { Input } from "@/components/ui/input";
import { Controller, useFormContext } from "react-hook-form";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";

export function TimeField({ name, label, helperText, className }: any) {
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
          <Input id={name} type="time" {...field} />
        </FieldWrapper>
      )}
    />
  );
}
