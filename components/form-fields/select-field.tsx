// fields/SelectField.tsx
"use client";
import type { Option } from "@/lib/types/form";
import { Controller, useFormContext } from "react-hook-form";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectField({
  name,
  label,
  placeholder,
  helperText,
  options = [],
  disabled,
  className,
}: {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  options?: Option[];
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
          <Select
            defaultValue={field.value}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger size="sm" className="min-w-40" id={name}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldWrapper>
      )}
    />
  );
}
