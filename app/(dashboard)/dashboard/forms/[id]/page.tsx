// app/form-builder/[id]/page.tsx
import { notFound } from "next/navigation";
import { getForm } from "@/lib/actions/form";
import { FormBuilderEditPage } from "./form-builder-edit-page";

interface FormBuilderEditPageProps {
  params: {
    id: string;
  };
}

export default async function FormBuilderEdit({
  params,
}: FormBuilderEditPageProps) {
  const result = await getForm(params.id);

  if (!result.success) {
    notFound();
  }

  return <FormBuilderEditPage form={result.data} />;
}
