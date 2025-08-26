// fields/SwitchField.tsx
"use client";
import { Switch } from "@/components/ui/switch";
import { Controller, useFormContext } from "react-hook-form";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";

export function SwitchField({ name, label, helperText, className }: any) {
  const { control, formState } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={false}
      render={({ field }) => (
        <FieldWrapper
          name={name}
          label={label}
          helperText={helperText}
          error={formState.errors?.[name]?.message as string}
          className={className}
        >
          <Switch checked={!!field.value} onCheckedChange={field.onChange} />
        </FieldWrapper>
      )}
    />
  );
}
