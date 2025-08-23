"use client";

import { cn } from "@/lib/utils";
import { FileText, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState, useRef, useCallback } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface InputTextareaElementProps {
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  required?: boolean;

  // Textarea specific props
  rows?: number;
  autoResize?: boolean;
  clearable?: boolean;
  showCharCount?: boolean;

  // Icon props
  Icon?: React.ElementType;
  showIcon?: boolean;

  // Validation props
  minLength?: number;
  maxLength?: number;

  // Form props
  rules?: Record<string, any>;
  className?: string;

  // Callbacks
  onClear?: () => void;
}

export const InputTextareaElement = ({
  name,
  label = "Description",
  placeholder = "Enter your text here...",
  disabled = false,
  readonly = false,
  required = true,
  rows = 4,
  autoResize = false,
  clearable = true,
  showCharCount = true,
  Icon = FileText,
  showIcon = true,
  minLength = 0,
  maxLength = 500,
  rules = { required: true },
  className,
  onClear,
}: InputTextareaElementProps) => {
  const { control, setValue } = useFormContext();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  // Auto-resize functionality
  const resizeTextarea = useCallback(() => {
    if (!textareaRef.current || !autoResize) return;

    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  }, [autoResize]);

  // Handle clear
  const handleClear = useCallback(() => {
    setValue(name, "", { shouldValidate: true, shouldDirty: true });
    setHasStartedTyping(false);
    onClear?.();

    // Reset height if auto-resize
    if (autoResize && textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [name, setValue, onClear, autoResize]);

  // Handle input change
  const handleInput = useCallback(
    (
      event: React.ChangeEvent<HTMLTextAreaElement>,
      onChange: (value: string) => void
    ) => {
      setHasStartedTyping(true);
      const value = event.target.value;
      onChange(value);

      // Auto-resize if enabled
      if (autoResize) {
        resizeTextarea();
      }
    },
    [autoResize, resizeTextarea]
  );

  // Custom validation
  const getValidationError = useCallback(
    (value: string) => {
      if (!hasStartedTyping || !value) return "";

      if (minLength > 0 && value.length < minLength) {
        return `${label} must be at least ${minLength} characters`;
      }

      if (maxLength > 0 && value.length > maxLength) {
        return `${label} must not exceed ${maxLength} characters`;
      }

      return "";
    },
    [hasStartedTyping, minLength, maxLength, label]
  );

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        ...rules,
        validate: (value: string) => {
          const customError = getValidationError(value);
          if (customError) return customError;

          // Run other validation rules
          if (rules.validate && typeof rules.validate === "function") {
            return rules.validate(value);
          }
          return true;
        },
      }}
      render={({ field, fieldState }) => {
        const charCount = field.value ? field.value.length : 0;
        const isOverLimit = maxLength && charCount > maxLength;
        const hasValue = field.value && field.value.length > 0;
        const showError = fieldState.error;
        const showClear = clearable && hasValue && !disabled && !readonly;

        // Calculate padding for textarea based on elements
        const getPaddingClasses = () => {
          const left = showIcon ? "pl-10" : "pl-3";
          let right = "pr-3";

          if (showClear && showCharCount) {
            right = "pr-16";
          } else if (showClear && !showCharCount) {
            right = "pr-10";
          } else if (!showClear && showCharCount) {
            right = "pr-12";
          }

          return `${left} ${right}`;
        };

        return (
          <div className={cn("space-y-1", className)}>
            {/* Label */}
            {label && (
              <label
                htmlFor={name}
                className={cn(
                  "text-sm font-medium",
                  showError ? "text-destructive" : "text-muted-foreground"
                )}
              >
                {label}
                {required && <span className="text-destructive ml-1">*</span>}
              </label>
            )}

            {/* Textarea Container */}
            <div className="relative">
              {/* Icon */}
              {showIcon && (
                <div
                  className={cn(
                    "pointer-events-none absolute top-3 left-3 z-10",
                    showError ? "text-destructive" : "text-muted-foreground"
                  )}
                >
                  <Icon size={18} />
                </div>
              )}

              {/* Textarea */}
              <Textarea
                {...field}
                ref={(e) => {
                  field.ref(e);
                  textareaRef.current = e;
                }}
                id={name}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readonly}
                rows={rows}
                maxLength={maxLength || undefined}
                minLength={minLength || undefined}
                onChange={(e) => handleInput(e, field.onChange)}
                className={cn(
                  "min-h-[80px] resize-none py-2 transition-colors",
                  getPaddingClasses(),
                  showError
                    ? "border-destructive focus-visible:ring-destructive"
                    : "border-input focus-visible:ring-ring",
                  autoResize && "overflow-y-hidden"
                )}
                style={
                  autoResize
                    ? {
                        height: "auto",
                        transition: "height 0.1s ease-out",
                      }
                    : undefined
                }
              />

              {/* Clear Button */}
              {showClear && (
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={handleClear}
                  aria-label="Clear text"
                  className="absolute top-3 right-3 rounded p-1 transition-colors hover:bg-muted"
                >
                  <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}

              {/* Character Count */}
              {showCharCount && (
                <div
                  className={cn(
                    "pointer-events-none absolute right-3 bottom-3 text-xs",
                    isOverLimit || showError
                      ? "text-destructive"
                      : "text-muted-foreground"
                  )}
                >
                  {charCount}
                  {maxLength && `/${maxLength}`}
                </div>
              )}
            </div>

            {/* Error message dengan fixed height untuk prevent layout shift */}
            <div className="h-4 flex items-start">
              {showError && (
                <p className="text-destructive text-xs">
                  {fieldState.error?.message}
                </p>
              )}
            </div>
          </div>
        );
      }}
    />
  );
};
