// src/hooks/useFormSchema.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface UseFormSchemaProps {
  mode: "onChange" | "onBlur" | "onSubmit";
  state?: any;
  schema: any;
  action: (data: any) => Promise<void>;
}

export function useFormSchema({
  state,
  schema,
  action,
  mode = "onChange",
}: UseFormSchemaProps) {
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues: state ? state : {},
    mode: mode,
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    await action(data);
  });

  return {
    methods,
    handleSubmit,
    reset: methods.reset,
    isDirty: methods.formState.isDirty,
    isValid: methods.formState.isValid,
    isSubmitting: methods.formState.isSubmitting,
  };
}
