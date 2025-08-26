"use client";
import { Textarea } from "@/components/ui/textarea";
import { Controller, useFormContext } from "react-hook-form";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";

export function LongTextField({
  name,
  label,
  placeholder,
  helperText,
  rows = 4,
  maxLength,
  disabled,
  className,
}: any) {
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
          <Textarea
            className="resize-none min-h-60"
            id={name}
            rows={rows}
            {...field}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
          />
        </FieldWrapper>
      )}
    />
  );
}
