"use client";

import { z } from "zod";
import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import React from "react";
import { toast } from "sonner";
import { FormProvider } from "react-hook-form";
import { useAutoSave } from "@/hooks/use-debounce";
import { updateAgent } from "@/lib/actions/agents";
import { useFormSchema } from "@/hooks/use-form-schema";
import { SelectField } from "@/components/form-fields/select-field";
import { LongTextField } from "@/components/form-fields/long-text-field";
import { ShortTextField } from "@/components/form-fields/short-text-field";

const GeneralInfoSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(3, "Name required min. 3 characters"),
  description: z
    .string()
    .trim()
    .min(5, "Description required min. 5 characters"),
  status: z.enum(["active", "inactive"]).default("active"),
});

type GeneralInfoFormData = z.infer<typeof GeneralInfoSchema>;

export function GeneralInfoForm({ data }: { data: GeneralInfoFormData }) {
  const form = useFormSchema({
    mode: "onChange",
    action: handleUpdateGeneralInfo,
    schema: GeneralInfoSchema,
    state: data,
  });

  async function handleUpdateGeneralInfo(values: GeneralInfoFormData) {
    const { id, name, description, status } = values;
    const result = await updateAgent(id, { name, description, status });
    if (result.success) {
      toast.success("auto saving success ...");
    } else {
      toast.error(result.message);
    }
  }

  useAutoSave<GeneralInfoFormData>({
    form: form.methods,
    onSave: handleUpdateGeneralInfo,
    delay: 1500,
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>General Settings</CardTitle>
        <CardDescription>
          Configure basic information about your chatbot
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <FormProvider {...form.methods}>
          <form className="space-y-6">
            <ShortTextField name="name" label="Name" />
            <LongTextField name="description" label="Description" />
            <SelectField
              name="status"
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
              ]}
              label="Status"
            />
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
