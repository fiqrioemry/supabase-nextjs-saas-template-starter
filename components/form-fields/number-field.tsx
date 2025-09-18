// fields/NumberField.tsx
'use client';
import { X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Controller, useFormContext } from 'react-hook-form';
import { FieldWrapper } from '@/components/form-fields/field-wrapper';

interface NumberFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  reset?: boolean;
  min?: number;
  max?: number;
  step?: number;
}

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
  reset,
}: NumberFieldProps) {
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
          <div>
            <Input
              id={name}
              type="number"
              {...field}
              onChange={e =>
                field.onChange(
                  e.target.value === '' ? '' : Number(e.target.value)
                )
              }
              placeholder={placeholder}
              min={min}
              max={max}
              step={step}
              disabled={disabled}
            />
            {reset && field.value && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => field.onChange(0)}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
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
