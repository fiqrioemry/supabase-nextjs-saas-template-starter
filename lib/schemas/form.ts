// lib/schemas/form.ts
import { z } from "zod";
import type { FieldConfig } from "@/lib/types/form";

export function zodFromConfig(fields: FieldConfig[]) {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const f of fields) {
    let base: z.ZodTypeAny;

    switch (f.type) {
      case "shortText":
      case "longText":
        base = z.string();
        break;
      case "password":
        base = z.string();
        break;
      case "email":
        base = z.string().email("Invalid email address").toLowerCase().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
        break;
      case "number":
        base = z
          .union([z.number(), z.nan()])
          .transform((v) => (Number.isNaN(v) ? undefined : v))
          .pipe(z.number({ message: "Must be a number" }));
        break;
      case "select":
      case "radio":
        base = z.string();
        break;
      case "checkbox":
        base = z.array(z.string()).default([]);
        break;
      case "switch":
        base = z.boolean().default(false);
        break;
      case "slider":
      case "rating":
        base = z.number();
        break;
      case "date":
      case "time":
        base = z.string();
        break;
      case "file":
        base = z.any();
        break;
      default:
        base = z.any();
    }

    const v = f.validation || {};

    if (v.required) {
      base = base.refine((val: any) => {
        if (Array.isArray(val)) return val.length > 0;
        return val !== undefined && val !== null && val !== "";
      }, `${f.label || f.name} is required`);
    }

    if (typeof v.minLength === "number" && base instanceof z.ZodString) {
      base = base.min(
        v.minLength,
        `${f.label || f.name} must be at least ${v.minLength} characters`
      );
    }
    if (typeof v.maxLength === "number" && base instanceof z.ZodString) {
      base = base.max(
        v.maxLength,
        `${f.label || f.name} must be at most ${v.maxLength} characters`
      );
    }
    if (typeof v.min === "number" && base instanceof z.ZodNumber) {
      base = base.min(v.min, `${f.label || f.name} must be at least ${v.min}`);
    }
    if (typeof v.max === "number" && base instanceof z.ZodNumber) {
      base = base.max(v.max, `${f.label || f.name} must be at most ${v.max}`);
    }
    if (typeof v.minItems === "number" && base instanceof z.ZodArray) {
      base = base.min(
        v.minItems,
        `${f.label || f.name} must be at least ${v.minItems} items`
      );
    }
    if (typeof v.maxItems === "number" && base instanceof z.ZodArray) {
      base = base.max(
        v.maxItems,
        `${f.label || f.name} must be at most ${v.maxItems} items`
      );
    }

    if (f.type === "password" && v.pattern && base instanceof z.ZodString) {
      base = base
        .refine(
          (val) => /[A-Z]/.test(val),
          `${f.label || f.name} must contain an uppercase letter`
        )
        .refine(
          (val) => /[a-z]/.test(val),
          `${f.label || f.name} must contain a lowercase letter`
        )
        .refine(
          (val) => /[0-9]/.test(val),
          `${f.label || f.name} must contain a number`
        )
        .refine(
          (val) => /[^A-Za-z0-9]/.test(val),
          `${f.label || f.name} must contain a special character`
        );
    }

    if (f.type === "file" && typeof v.maxSize === "number") {
      base = base.refine((val: any) => {
        if (!val) return true; // skip kalau kosong
        const files = Array.isArray(val) ? val : [val];
        return files.every(
          (file) => file instanceof File && file.size <= v.maxSize!
        );
      }, `${f.label || f.name} must be smaller than ${Math.round(v.maxSize / 1024 / 1024)} MB`);
    }

    if (f.name) {
      shape[f.name] = base;
    }
  }

  return z.object(shape);
}
