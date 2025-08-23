// components/form-builder/form-element-renderer.tsx
"use client";

import { FormElement } from "@/lib/types/form";
import { useFormBuilderStore } from "@/lib/store/form-store";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Settings,
  FileText,
  Hash,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FormElementRendererProps {
  element: FormElement;
  isPreview?: boolean;
}

export function FormElementRenderer({
  element,
  isPreview = false,
}: FormElementRendererProps) {
  const { selectedElementId, selectElement, removeElement } =
    useFormBuilderStore();
  const isSelected = !isPreview && selectedElementId === element.id;

  const handleClick = () => {
    if (!isPreview) {
      selectElement(element.id);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeElement(element.id);
  };

  const renderElement = () => {
    switch (element.type) {
      case "title":
        return (
          <h1 className="text-3xl font-bold">
            {element.properties.text || "Form Title"}
          </h1>
        );

      case "subtitle":
        return (
          <h2 className="text-xl font-semibold">
            {element.properties.text || "Form subtitle"}
          </h2>
        );

      case "paragraph":
        return (
          <p className="text-sm text-muted-foreground">
            {element.properties.text || "Paragraph text"}
          </p>
        );

      case "separator":
        return <Separator className="my-4" />;

      case "spacer":
        return (
          <div
            style={{ height: element.properties.height || 20 }}
            className={cn(
              !isPreview &&
                "border-2 border-dashed border-muted-foreground/30 bg-muted/20 rounded",
              !isPreview &&
                "flex items-center justify-center text-xs text-muted-foreground"
            )}
          >
            {!isPreview && `Spacer (${element.properties.height || 20}px)`}
          </div>
        );

      case "text-field":
      case "number-field":
        return (
          <div className="space-y-2">
            <Label>
              {element.properties.label || "Field Label"}
              {element.properties.required && (
                <span className="text-red-500">*</span>
              )}
            </Label>
            <Input
              type={element.type === "number-field" ? "number" : "text"}
              placeholder={element.properties.placeholder || "Enter value..."}
              defaultValue={element.properties.defaultValue}
              disabled={!isPreview}
            />
          </div>
        );

      case "textarea":
        return (
          <div className="space-y-2">
            <Label>
              {element.properties.label || "Textarea Label"}
              {element.properties.required && (
                <span className="text-red-500">*</span>
              )}
            </Label>
            <Textarea
              placeholder={element.properties.placeholder || "Enter text..."}
              defaultValue={element.properties.defaultValue}
              disabled={!isPreview}
            />
          </div>
        );

      case "date-field":
        return (
          <div className="space-y-2">
            <Label>
              {element.properties.label || "Date Field"}
              {element.properties.required && (
                <span className="text-red-500">*</span>
              )}
            </Label>
            <Input
              type="date"
              defaultValue={element.properties.defaultValue}
              disabled={!isPreview}
            />
          </div>
        );

      default:
        return <div>Unknown element type</div>;
    }
  };

  if (isPreview) {
    return renderElement();
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "relative group cursor-pointer",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
    >
      <Card
        className={cn(
          "p-4 transition-colors",
          isSelected && "border-primary",
          "hover:border-muted-foreground/50"
        )}
      >
        {renderElement()}
      </Card>

      {!isPreview && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={handleClick}
            className="h-6 w-6 p-0"
          >
            <Settings className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleDelete}
            className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}

export const FORM_ELEMENTS = [
  {
    type: "text-field" as const,
    label: "Text Field",
    icon: FileText,
    defaultProperties: {
      label: "Text Field",
      placeholder: "Enter text...",
      required: false,
    },
  },
  {
    type: "number-field" as const,
    label: "Number Field",
    icon: Hash,
    defaultProperties: {
      label: "Number Field",
      placeholder: "Enter number...",
      required: false,
    },
  },
  {
    type: "textarea" as const,
    label: "Textarea",
    icon: MessageSquare,
    defaultProperties: {
      label: "Textarea",
      placeholder: "Enter text...",
      required: false,
    },
  },
  {
    type: "date-field" as const,
    label: "Date Field",
    icon: Calendar,
    defaultProperties: {
      label: "Date Field",
      required: false,
    },
  },
];
