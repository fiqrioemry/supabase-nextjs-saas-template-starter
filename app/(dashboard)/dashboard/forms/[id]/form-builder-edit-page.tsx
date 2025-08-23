// app/form-builder/[id]/form-builder-edit-page.tsx
"use client";

import { useEffect } from "react";
import { FormElement } from "@/lib/types/form";
import { useFormBuilderStore } from "@/lib/store/form-store";
import { FormBuilderLayout } from "@/components/form-builder/form-builder-layout";

interface FormData {
  id: string;
  title: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  fields: any[];
}

interface FormBuilderEditPageProps {
  form: FormData;
}

export function FormBuilderEditPage({ form }: FormBuilderEditPageProps) {
  const { setFormData } = useFormBuilderStore();

  useEffect(() => {
    // Convert database fields back to form elements
    const elements: FormElement[] = form.fields.map((field) => ({
      id: field.name,
      type: field.type,
      position: field.position,
      properties: field.options || {},
    }));

    setFormData({
      id: form.id,
      title: form.title,
      description: form.description || "",
      elements: elements.sort((a, b) => a.position - b.position),
      isActive: form.is_active,
    });
  }, [form, setFormData]);

  return <FormBuilderLayout />;
}
