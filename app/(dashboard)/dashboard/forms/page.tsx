// app/form-builder/page.tsx
"use client";

import { useEffect } from "react";
import { FormBuilderLayout } from "@/components/form-builder/form-builder-layout";
import { useFormBuilderStore } from "@/lib/store/form-store";

export default function FormsPage() {
  const { resetForm } = useFormBuilderStore();

  useEffect(() => {
    resetForm();
  }, [resetForm]);

  return <FormBuilderLayout />;
}
