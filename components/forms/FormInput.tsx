import { FormProvider } from "react-hook-form";
import { useFormSchema } from "@/hooks/use-form-schema";
import { SubmitButton } from "@/components/forms/SubmitButton";

interface FormInputProps {
  action: (data: any) => Promise<void>;
  state: any;
  schema: any;
  text: string;
  className?: string;
  isLoading?: boolean;
  children: React.ReactNode;
}

const FormInput = ({
  action,
  state,
  schema,
  text,
  className,
  isLoading,
  children,
}: FormInputProps) => {
  const { methods, handleSubmit } = useFormSchema({
    state,
    schema,
    action,
    mode: "onChange",
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit} className="grid-cols-2 space-y-2 space-y-4">
        {children}
        <SubmitButton
          text={text}
          className={className}
          isLoading={isLoading}
          disabled={!methods.formState.isValid || !methods.formState.isDirty}
        />
      </form>
    </FormProvider>
  );
};

export { FormInput };
