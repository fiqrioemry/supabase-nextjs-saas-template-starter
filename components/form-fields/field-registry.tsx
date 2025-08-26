"use client";
import type { FieldConfig, FieldType } from "@/lib/types/form";
import { TimeField } from "@/components/form-fields/time-field";
import { DateField } from "@/components/form-fields/date-field";
import { FileField } from "@/components/form-fields/file-field";
import { EmailField } from "@/components/form-fields/email-field";
import { SelectField } from "@/components/form-fields/select-field";
import { NumberField } from "@/components/form-fields/number-field";
import { SwitchField } from "@/components/form-fields/switch-field";
import { RatingField } from "@/components/form-fields/rating-field";
import { SliderField } from "@/components/form-fields/slider-field";
import { LongTextField } from "@/components/form-fields/long-text-field";
import { ShortTextField } from "@/components/form-fields/short-text-field";
import { RadioGroupField } from "@/components/form-fields/ratio-group-field";
import { CheckboxGroupField } from "@/components/form-fields/checkbox-group-field";
import { PasswordField } from "./password-field";

type Renderer = (cfg: FieldConfig) => React.ReactNode;

export const fieldRegistry: Record<FieldType, Renderer> = {
  shortText: (c) => (
    <ShortTextField
      name={c.name!}
      label={c.label}
      className={c.className}
      helperText={c.helperText}
      placeholder={c.placeholder}
      minLength={c.validation?.minLength}
      maxLength={c.validation?.maxLength}
    />
  ),
  longText: (c) => (
    <LongTextField
      name={c.name!}
      label={c.label}
      placeholder={c.placeholder}
      helperText={c.helperText}
      rows={c.rows}
      className={c.className}
      maxLength={c.validation?.maxLength}
    />
  ),
  email: (c) => (
    <EmailField
      name={c.name!}
      label={c.label}
      placeholder={c.placeholder}
      helperText={c.helperText}
      className={c.className}
    />
  ),
  number: (c) => (
    <NumberField
      name={c.name!}
      label={c.label}
      placeholder={c.placeholder}
      helperText={c.helperText}
      min={c.validation?.min}
      max={c.validation?.max}
      step={c.step}
      className={c.className}
    />
  ),
  select: (c) => (
    <SelectField
      name={c.name!}
      label={c.label}
      placeholder={c.placeholder}
      helperText={c.helperText}
      options={c.options || []}
      className={c.className}
    />
  ),
  radio: (c) => (
    <RadioGroupField
      name={c.name!}
      label={c.label}
      helperText={c.helperText}
      options={c.options || []}
      className={c.className}
    />
  ),
  checkbox: (c) => (
    <CheckboxGroupField
      name={c.name!}
      label={c.label}
      helperText={c.helperText}
      options={c.options || []}
      className={c.className}
    />
  ),
  switch: (c) => (
    <SwitchField
      name={c.name!}
      label={c.label}
      helperText={c.helperText}
      className={c.className}
    />
  ),
  slider: (c) => (
    <SliderField
      name={c.name!}
      label={c.label}
      helperText={c.helperText}
      min={c.validation?.min}
      max={c.validation?.max}
      className={c.className}
    />
  ),
  date: (c) => (
    <DateField
      name={c.name!}
      label={c.label}
      helperText={c.helperText}
      className={c.className}
    />
  ),
  time: (c) => (
    <TimeField
      name={c.name!}
      label={c.label}
      helperText={c.helperText}
      className={c.className}
    />
  ),
  file: (c) => (
    <FileField
      name={c.name!}
      label={c.label}
      fileType={c.fileType}
      helperText={c.helperText}
      accept={c.accept}
      multiple={c.multiple}
      maxItems={c.validation?.maxItems}
      maxSize={c.validation?.maxSize}
      className={c.className}
    />
  ),
  rating: (c) => (
    <RatingField
      name={c.name!}
      label={c.label}
      helperText={c.helperText}
      min={c.validation?.min ?? 1}
      max={c.validation?.max ?? 5}
      className={c.className}
    />
  ),
  password: (c) => (
    <PasswordField
      name={c.name!}
      label={c.label}
      reset={c.reset}
      placeholder={c.placeholder}
      helperText={c.helperText}
      className={c.className}
    />
  ),
};
