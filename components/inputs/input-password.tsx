"use client";

import { useState, useRef, useCallback } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { Eye, EyeOff, Lock, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InputPasswordProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;
  clearable?: boolean;
  minLength?: number;
  maxLength?: number;
  showStrengthIndicator?: boolean;
  rules?: Record<string, any>;
  className?: string;
}

export const InputPassword = ({
  name,
  label = "Password",
  placeholder = "Enter your password",
  disabled = false,
  readonly = false,
  required = true,
  clearable = false,
  minLength = 6,
  maxLength = 100,
  showStrengthIndicator = false,
  rules = { required: true },
  className,
}: InputPasswordProps) => {
  const { control, setValue } = useFormContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  const calculatePasswordStrength = useCallback((password: string): number => {
    let strength = 0;

    // Length check
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;

    // Character variety checks
    if (/[a-z]/.test(password)) strength += 10;
    if (/[A-Z]/.test(password)) strength += 10;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 15;

    return Math.min(strength, 100);
  }, []);

  const getStrengthLabel = useCallback((strength: number): string => {
    if (strength < 30) return "Weak";
    if (strength < 60) return "Fair";
    if (strength < 80) return "Good";
    return "Strong";
  }, []);

  const getStrengthColor = useCallback((strength: number): string => {
    if (strength < 30) return "bg-red-500 text-red-500";
    if (strength < 60) return "bg-yellow-500 text-yellow-500";
    if (strength < 80) return "bg-blue-500 text-blue-500";
    return "bg-green-500 text-green-500";
  }, []);

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, []);

  const handleClear = useCallback(() => {
    setValue(name, "", { shouldValidate: true, shouldDirty: true });
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  }, [name, setValue]);

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => {
        const passwordStrength =
          showStrengthIndicator && field.value
            ? calculatePasswordStrength(field.value)
            : 0;

        const showClear =
          clearable &&
          field.value &&
          field.value.length > 0 &&
          !readonly &&
          !disabled;

        return (
          <div className={cn("space-y-1", className)}>
            {/* Label */}
            {label && (
              <label
                htmlFor={name}
                className="text-sm font-medium text-muted-foreground"
              >
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </label>
            )}

            {/* Input Container */}
            <div className="relative">
              {/* Lock Icon */}
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                <Lock size={18} />
              </div>

              {/* Input Field */}
              <Input
                {...field}
                ref={(e) => {
                  field.ref(e);
                  inputRef.current = e;
                }}
                id={name}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readonly}
                minLength={minLength}
                maxLength={maxLength}
                required={required}
                className={cn(
                  "pl-10 pr-16", // Space for icons
                  fieldState.error &&
                    "border-red-500 focus-visible:ring-red-500"
                )}
              />

              {/* Right Side Controls */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {/* Clear Button */}
                {showClear && (
                  <button
                    type="button"
                    className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                    onClick={handleClear}
                    tabIndex={-1}
                    aria-label="Clear password"
                  >
                    <X size={16} />
                  </button>
                )}

                {/* Toggle Visibility Button */}
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {showStrengthIndicator && field.value && (
              <div className="space-y-1">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-300",
                      getStrengthColor(passwordStrength).split(" ")[0]
                    )}
                    style={{ width: `${passwordStrength}%` }}
                  />
                </div>
                <span
                  className={cn(
                    "text-xs font-medium",
                    getStrengthColor(passwordStrength).split(" ")[1]
                  )}
                >
                  {getStrengthLabel(passwordStrength)}
                </span>
              </div>
            )}

            {/* Error Message */}
            {fieldState.error && (
              <p className="text-xs text-red-600">{fieldState.error.message}</p>
            )}
          </div>
        );
      }}
    />
  );
};
