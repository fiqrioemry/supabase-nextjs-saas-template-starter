// lib/types/form.ts
export type FieldType =
  | "shortText"
  | "longText"
  | "email"
  | "number"
  | "select"
  | "radio"
  | "checkbox"
  | "switch"
  | "slider"
  | "date"
  | "time"
  | "file"
  | "password"
  | "rating";

export type Option = { label: string; value: string };

export type ValidationConfig = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  minItems?: number;
  maxItems?: number;
  maxSize?: number;
  pattern?: boolean;
};

export type FieldConfig = {
  type: FieldType;
  name?: string;
  fileType?: "docs" | "image" | "video";
  label?: string;
  reset?: boolean;
  placeholder?: string;
  helperText?: string;
  defaultValue?: any;
  options?: Option[];
  accept?: string[];
  multiple?: boolean;
  step?: number;
  rows?: number;
  position?: number;
  validation?: ValidationConfig;
  content?: string;
  className?: string;
};
