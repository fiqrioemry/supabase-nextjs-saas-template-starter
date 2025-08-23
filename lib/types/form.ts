export interface FormElement {
  id: string;
  type: FormElementType;
  properties: FormElementProperties;
  position: number;
}

export type FormElementType =
  | "title"
  | "subtitle"
  | "paragraph"
  | "separator"
  | "spacer"
  | "text-field"
  | "number-field"
  | "textarea"
  | "date-field";

export interface FormElementProperties {
  label?: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  text?: string; // for title, subtitle, paragraph
  height?: number; // for spacer
}

export interface FormData {
  id?: string;
  title: string;
  description?: string;
  elements: FormElement[];
  isActive?: boolean;
  expiresAt?: string;
}

export interface FormField {
  id: string;
  form_id: string;
  name: string;
  label: string;
  type: string;
  options?: any;
  position: number;
  required: boolean;
  created_at?: string;
}

export interface FormResponse {
  id: string;
  form_id: string;
  responder_id?: string;
  data: Record<string, any>;
  created_at: string;
}
