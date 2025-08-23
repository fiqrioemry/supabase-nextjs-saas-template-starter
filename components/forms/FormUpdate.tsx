// src/components/form/FormInput.tsx
import { FormProvider } from "react-hook-form";
import { useFormSchema } from "@/hooks/use-form-schema";

interface FormInputProps {
  action: (data: any) => Promise<void>;
  state: any;
  schema: any;
  children: React.ReactNode;
}

export function FormUpdate({
  action,
  state,
  schema,
  children,
}: FormInputProps) {
  const { methods, handleSubmit } = useFormSchema({
    state,
    schema,
    action,
    mode: "onChange",
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit}>{children}</form>
    </FormProvider>
  );
}
