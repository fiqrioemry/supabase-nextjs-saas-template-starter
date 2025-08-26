// fields/NumberField.tsx
"use client";
import { Input } from "@/components/ui/input";
import { Controller, useFormContext } from "react-hook-form";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";

export function NumberField({
  name,
  label,
  placeholder,
  helperText,
  min,
  max,
  step = 1,
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
          <Input
            id={name}
            type="number"
            {...field}
            onChange={(e) =>
              field.onChange(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            placeholder={placeholder}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
          />
        </FieldWrapper>
      )}
    />
  );
}
