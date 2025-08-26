"use client";

import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { FieldWrapper } from "@/components/form-fields/field-wrapper";
import { Button } from "@/components/ui/button";
import { FileText, PlusCircle, X } from "lucide-react";

interface FileFieldProps {
  name: string;
  label?: string;
  helperText?: string;
  fileType?: "docs" | "image" | "video";
  accept?: string[];
  multiple?: boolean;
  maxSize?: number;
  maxItems?: number;
  className?: string;
}

export function FileField({
  name,
  label,
  helperText,
  fileType = "docs",
  accept = [],
  multiple = false,
  maxItems = 1,
  className,
}: FileFieldProps) {
  const { control, formState } = useFormContext();
  const [isDragging, setIsDragging] = useState(false);

  const getURL = (item: File | string) => {
    if (item instanceof File) return URL.createObjectURL(item);
    if (typeof item === "string") return item;
    return "";
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const handleFiles = (files: FileList | null) => {
          if (!files) return;
          const arr = Array.from(files);

          if (multiple) {
            const updated = [...(field.value || []), ...arr].slice(0, maxItems);
            field.onChange(updated);
          } else {
            field.onChange(arr[0]);
          }
        };

        const handleRemove = (file: File | string) => {
          if (multiple) {
            field.onChange((field.value || []).filter((f: any) => f !== file));
          } else {
            field.onChange(null);
          }
        };

        /** Docs rendering */
        if (fileType === "docs") {
          return (
            <FieldWrapper
              name={name}
              label={label}
              helperText={helperText}
              error={formState.errors?.[name]?.message as string}
              className={className}
            >
              {field.value ? (
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  {typeof field.value === "string" ? (
                    <a
                      href={field.value}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm underline"
                    >
                      {field.value}
                    </a>
                  ) : (
                    <span className="text-sm">{field.value.name}</span>
                  )}
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => handleRemove(field.value)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <input
                  type="file"
                  accept={accept.join(",")}
                  onChange={(e) => handleFiles(e.target.files)}
                />
              )}
            </FieldWrapper>
          );
        }

        /** Image / Video rendering */
        const isImage = fileType === "image";
        const items = multiple
          ? field.value || []
          : field.value
          ? [field.value]
          : [];

        return (
          <FieldWrapper
            name={name}
            label={label}
            helperText={helperText}
            error={formState.errors?.[name]?.message as string}
            className={className}
          >
            <div
              onDrop={(e) => {
                e.preventDefault();
                setIsDragging(false);
                handleFiles(e.dataTransfer.files);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              className={`flex flex-wrap gap-3 p-3 border-2 rounded-md ${
                isDragging ? "border-primary bg-primary/10" : "border-border"
              }`}
            >
              {items.map((item: any, idx: number) => {
                const url = getURL(item);
                return (
                  <div
                    key={idx}
                    className="relative w-32 h-32 border rounded-md overflow-hidden flex items-center justify-center"
                  >
                    {isImage ? (
                      <img
                        src={url}
                        alt="preview"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <video
                        src={url}
                        controls
                        className="object-cover w-full h-full"
                      />
                    )}
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      onClick={() => handleRemove(item)}
                      className="absolute top-1 right-1 p-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                );
              })}

              {(!multiple || items.length < maxItems) && (
                <label
                  htmlFor={`${name}-upload`}
                  className="flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-primary rounded-md cursor-pointer hover:bg-muted"
                >
                  <PlusCircle className="w-6 h-6 text-primary mb-1" />
                  <span className="text-xs">
                    Add {isImage ? "Image" : "Video"}
                  </span>
                </label>
              )}
              <input
                id={`${name}-upload`}
                type="file"
                accept={accept.join(",")}
                onChange={(e) => handleFiles(e.target.files)}
                multiple={multiple}
                hidden
              />
            </div>
          </FieldWrapper>
        );
      }}
    />
  );
}
