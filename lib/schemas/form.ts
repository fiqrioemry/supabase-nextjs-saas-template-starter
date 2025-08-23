// lib/schemas/form.ts
import { z } from "zod";

export const formElementPropertiesSchema = z.object({
  label: z.string().optional(),
  placeholder: z.string().optional(),
  required: z.boolean().optional(),
  defaultValue: z.string().optional(),
  text: z.string().optional(),
  height: z.number().optional(),
});

export const formElementSchema = z.object({
  id: z.string(),
  type: z.enum([
    "title",
    "subtitle",
    "paragraph",
    "separator",
    "spacer",
    "text-field",
    "number-field",
    "textarea",
    "date-field",
  ]),
  properties: formElementPropertiesSchema,
  position: z.number(),
});

export const formDataSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  elements: z.array(formElementSchema),
  isActive: z.boolean().optional(),
  expiresAt: z.string().optional(),
});

export const createFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  elements: z.array(formElementSchema),
});

export const updateFormSchema = createFormSchema.partial().extend({
  id: z.string(),
});
