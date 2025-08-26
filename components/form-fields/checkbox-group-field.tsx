// fields/CheckboxGroupField.tsx
"use client";
import { Controller, useFormContext } from "react-hook-form";
import type { Option } from "@/lib/types/form";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";

export function CheckboxGroupField({
  name,
  label,
  helperText,
  options = [],
  className,
}: any) {
  const { control, formState } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      defaultValue={[]}
      render={({ field }) => (
        <FieldWrapper
          name={name}
          label={label}
          helperText={helperText}
          error={formState.errors?.[name]?.message as string}
          className={className}
        >
          <div className="space-y-2">
            {options.map((o: Option) => {
              const checked =
                Array.isArray(field.value) && field.value.includes(o.value);
              return (
                <label key={o.value} className="flex items-center gap-2">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(v) => {
                      const set = new Set<string>(field.value || []);
                      v ? set.add(o.value) : set.delete(o.value);
                      field.onChange(Array.from(set));
                    }}
                  />
                  <span>{o.label}</span>
                </label>
              );
            })}
          </div>
        </FieldWrapper>
      )}
    />
  );
}
