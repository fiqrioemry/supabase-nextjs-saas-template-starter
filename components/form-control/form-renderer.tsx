"use client";

import { zodFromConfig } from "@/lib/schemas/form";
import type { FieldConfig } from "@/lib/types/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { fieldRegistry } from "@/components/form-fields/field-registry";
import React from "react";

interface FormRendererProps {
  fields: FieldConfig[];
  mode?: "onChange" | "onBlur" | "onSubmit";
  defaultValues?: Record<string, any>;
  onSubmit: (data: any) => Promise<void>;
  children?:
    | React.ReactNode
    | ((methods: ReturnType<typeof useForm>) => React.ReactNode);
}

export function FormRenderer({
  fields,
  defaultValues,
  mode,
  onSubmit,
  children,
}: FormRendererProps) {
  const schema = zodFromConfig(fields);
  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode,
  });

  const handleSubmit = async (data: any) => {
    await onSubmit(data);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        className="grid grid-cols-4  gap-4 w-full"
      >
        {fields.map((cfg, idx) => (
          <div key={cfg.name || idx} className={cfg.className || "col-span-4"}>
            {fieldRegistry[cfg.type]?.(cfg)}
          </div>
        ))}

        {/* pass mode + methods ke children */}
        {typeof children === "function" ? children({ ...methods }) : children}
      </form>
    </FormProvider>
  );
}
