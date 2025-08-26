// fields/RatingField.tsx
"use client";
import { Controller, useFormContext } from "react-hook-form";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";

export function RatingField({
  name,
  label,
  helperText,
  min = 1,
  max = 5,
  className,
}: any) {
  const { control, formState } = useFormContext();
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={min}
      render={({ field }) => (
        <FieldWrapper
          name={name}
          label={label}
          helperText={helperText}
          error={formState.errors?.[name]?.message as string}
          className={className}
        >
          <div className="flex gap-1">
            {stars.map((s) => (
              <button
                key={s}
                type="button"
                aria-label={`rate-${s}`}
                onClick={() => field.onChange(s)}
                className={
                  s <= (Number(field.value) || 0)
                    ? "text-yellow-500"
                    : "text-muted-foreground"
                }
              >
                ★
              </button>
            ))}
          </div>
        </FieldWrapper>
      )}
    />
  );
}
