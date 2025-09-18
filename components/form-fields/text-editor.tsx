'use client';

import 'react-quill/dist/quill.snow.css';

import React from 'react';
import dynamic from 'next/dynamic';
import { Controller, useFormContext } from 'react-hook-form';
import { FieldWrapper } from '@/components/form-fields/field-wrapper';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export function TextEditor({
  name,
  label,
  helperText,
  placeholder,
  disabled,
  className,
}: {
  name: string;
  label?: string;
  helperText?: string;
  placeholder?: string;
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
          <ReactQuill
            theme="snow"
            value={field.value || ''}
            onChange={val => field.onChange(val)}
            onBlur={field.onBlur}
            placeholder={placeholder}
            readOnly={disabled}
            className="bg-white" // bisa atur styling tailwind
          />
        </FieldWrapper>
      )}
    />
  );
}
