"use client";
import z from "zod";

import {
  Card,
  CardTitle,
  CardContent,
  CardHeader,
  CardDescription,
} from "@/components/ui/card";
import { FormProvider } from "react-hook-form";
import { useFormSchema } from "@/hooks/use-form-schema";
import { SelectField } from "@/components/form-fields/select-field";
import { SliderField } from "@/components/form-fields/slider-field";
import { NumberField } from "@/components/form-fields/number-field";
import { LongTextField } from "@/components/form-fields/long-text-field";

const SystemPromptSchema = z.object({
  id: z.string(),
  system_prompt: z.string().optional(),
  model: z.string().min(3, "Model is required"),
  temperature: z.number().min(0).max(1),
});

type SystemPromptFormData = z.infer<typeof SystemPromptSchema>;

const modelsOptions = [
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "gpt-4", label: "GPT-4" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo" },
];

export function SystemPromptForm({ agent }: { agent: any }) {
  const form = useFormSchema({
    action: handleUpdatePrompt,
    mode: "onChange",
    state: agent,
    schema: SystemPromptSchema,
  });

  async function handleUpdatePrompt(data: any) {
    console.log("Update System Prompt", data);
  }

  return (
    <FormProvider {...form.methods}>
      <form
        onChange={form.handleSubmit}
        className="grid grid-cols-4 gap-6 items-start"
      >
        <Card className="col-span-4 md:col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>System Prompt</CardTitle>
            <CardDescription>
              Define the personality and behavior of your chatbot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LongTextField
              name="system_prompt"
              label="System Prompt"
              rows={10}
              maxLength={1000}
            />
          </CardContent>
        </Card>

        <Card className="col-span-4 md:col-span-4 lg:col-span-1">
          <CardHeader>
            <CardTitle>AI Model Configuration</CardTitle>
            <CardDescription>
              Configure the AI model and parameters for your chatbot
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <SelectField
              name="model"
              label="AI Model"
              options={modelsOptions}
            />
            <SliderField
              name="temperature"
              label="Temperature"
              max={1}
              min={0}
              step={0.1}
              helperText="Controls randomness. Lower values make responses more focused."
            />
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
}
