// fields/SliderField.tsx
"use client";
import { Slider } from "@/components/ui/slider";
import { Controller, useFormContext } from "react-hook-form";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";

export function SliderField({
  name,
  label,
  helperText,
  min = 0,
  max = 100,
  step = 1,
  className,
}: any) {
  const { control, formState } = useFormContext();
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
          <Slider
            value={[Number(field.value ?? min)]}
            onValueChange={(v) => field.onChange(v?.[0])}
            min={min}
            max={max}
            step={step}
          />
        </FieldWrapper>
      )}
    />
  );
}
