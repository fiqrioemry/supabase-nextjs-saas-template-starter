// fields/RadioGroupField.tsx
"use client";
import type { Option } from "@/lib/types/form";
import { Controller, useFormContext } from "react-hook-form";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";

export function RadioGroupField({
  name,
  label,
  helperText,
  options = [],
  className,
}: {
  name: string;
  label?: string;
  helperText?: string;
  options?: Option[];
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
          <div className="space-y-2">
            {options.map((o) => (
              <label key={o.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={field.value === o.value}
                  onChange={() => field.onChange(o.value)}
                />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </FieldWrapper>
      )}
    />
  );
}
