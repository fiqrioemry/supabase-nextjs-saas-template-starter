// src/hooks/useFormSchema.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface UseFormSchemaProps {
  state: any;
  schema: any;
  mode: "onChange" | "onSubmit" | "onBlur";
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
    defaultValues: state,
    mode,
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    await action(data);
  });

  return { methods, handleSubmit };
}
