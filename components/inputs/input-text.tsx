"use client";

import { Input } from "@/components/ui/input";
import { Controller, useFormContext } from "react-hook-form";

const InputTextElement = ({
  name = "",
  label = "",
  maxLength = 255,
  type = "text",
  placeholder = "",
  disabled = false,
  rules = { required: true },
  isNumeric = false,
}) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
          if (isNumeric) {
            const allowedKeys = [
              "Backspace",
              "Tab",
              "Delete",
              "ArrowLeft",
              "ArrowRight",
            ];
            if (allowedKeys.includes(e.key)) return;
            if (!/^[0-9]$/.test(e.key)) {
              e.preventDefault();
            }
          }
        };

        return (
          <div className="space-y-1">
            {label && (
              <label
                htmlFor={name}
                className="block text-sm font-medium text-foreground"
              >
                {label}
              </label>
            )}

            <Input
              id={name}
              type={type}
              {...field}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
              inputMode={isNumeric ? "numeric" : undefined}
            />

            {fieldState.error && (
              <p className="text-xs text-red-600">{fieldState.error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
};

export { InputTextElement };
