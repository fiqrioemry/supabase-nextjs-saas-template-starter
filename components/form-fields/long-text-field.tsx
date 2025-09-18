"use client";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  reset,
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
          <div className="relative">
            <Textarea
              className="resize-none min-h-30"
              id={name}
              rows={rows}
              {...field}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
            />
            {reset && field.value && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => field.onChange("")}
                className="absolute right-2 top-5 -translate-y-1/2 h-8 w-8"
                tabIndex={-1}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </FieldWrapper>
      )}
    />
  );
}
