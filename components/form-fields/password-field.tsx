'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Controller, useFormContext } from 'react-hook-form';
import { FieldWrapper } from '@/components/form-fields/field-wrapper';

interface PasswordFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  reset?: boolean;
}

export function PasswordField({
  name,
  label,
  placeholder,
  helperText,
  disabled,
  className,
  reset = false,
}: PasswordFieldProps) {
  const { control, formState } = useFormContext();
  const [visible, setVisible] = useState(false);

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
            <Input
              id={name}
              type={visible ? 'text' : 'password'}
              {...field}
              value={field.value ?? ''}
              placeholder={placeholder}
              disabled={disabled}
              className={cn('pr-20', className)} // kasih space buat icon
            />

            {/* 👁 toggle visibility */}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setVisible(prev => !prev)}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
              tabIndex={-1}
            >
              {visible ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>

            {reset && field.value && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => field.onChange('')}
                className="absolute right-10 top-1/2 -translate-y-1/2 h-8 w-8"
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
