"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useFormContext } from "react-hook-form";

interface FormSubmitButtonProps {
  label?: string;
  mode?: "onChange" | "onBlur" | "onSubmit";
}

export function FormSubmitButton({
  label = "Submit",
  mode = "onChange",
}: FormSubmitButtonProps) {
  const { formState } = useFormContext();

  const disabled =
    formState.isSubmitting ||
    (mode !== "onSubmit" && (!formState.isDirty || !formState.isValid));

  return (
    <Button type="submit" className="col-span-4" disabled={disabled}>
      {formState.isSubmitting ? "Processing..." : label}
    </Button>
  );
}

interface FormActionsProps {
  submitLabel?: string;
  resetLabel?: string;
  defaultValues?: Record<string, any>;
  mode?: "onChange" | "onBlur" | "onSubmit";
}

export function FormActions({
  submitLabel = "Submit",
  resetLabel = "Reset",
  defaultValues = {},
  mode = "onChange",
}: FormActionsProps) {
  const { formState, reset } = useFormContext();

  const disabled =
    formState.isSubmitting ||
    (mode !== "onSubmit" && (!formState.isDirty || !formState.isValid));

  return (
    <div className="flex gap-2 col-span-4 w-full">
      <Button type="submit" className="w-1/2" disabled={disabled}>
        {formState.isSubmitting ? "Processing..." : submitLabel}
      </Button>
      <Button
        type="button"
        variant="outline"
        className="w-1/2"
        onClick={() => reset(defaultValues, { keepDefaultValues: true })}
        disabled={!formState.isDirty}
      >
        {resetLabel}
      </Button>
    </div>
  );
}
