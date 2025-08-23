// components/form-builder/property-editor.tsx
"use client";

import { useState, useEffect } from "react";
import { useFormBuilderStore } from "@/lib/store/form-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

export function PropertyEditor() {
  const {
    formData,
    selectedElementId,
    selectElement,
    updateElement,
    setFormTitle,
    setFormDescription,
  } = useFormBuilderStore();

  const [localTitle, setLocalTitle] = useState(formData.title);
  const [localDescription, setLocalDescription] = useState(
    formData.description || ""
  );

  useEffect(() => {
    setLocalTitle(formData.title);
    setLocalDescription(formData.description || "");
  }, [formData.title, formData.description]);

  const selectedElement = selectedElementId
    ? formData.elements.find((el) => el.id === selectedElementId)
    : null;

  const handleTitleBlur = () => {
    if (localTitle !== formData.title) {
      setFormTitle(localTitle);
    }
  };

  const handleDescriptionBlur = () => {
    if (localDescription !== formData.description) {
      setFormDescription(localDescription);
    }
  };

  const handlePropertyChange = (property: string, value: any) => {
    if (selectedElementId) {
      updateElement(selectedElementId, { [property]: value });
    }
  };

  const handleClose = () => {
    selectElement(null);
  };

  if (!selectedElement) {
    return (
      <div className="w-80 border-l bg-background p-4 overflow-y-auto">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-4">Form Settings</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Form Title</Label>
                <Input
                  value={localTitle}
                  onChange={(e) => setLocalTitle(e.target.value)}
                  onBlur={handleTitleBlur}
                  placeholder="Enter form title"
                />
              </div>
              <div className="space-y-2">
                <Label>Form Description</Label>
                <Textarea
                  value={localDescription}
                  onChange={(e) => setLocalDescription(e.target.value)}
                  onBlur={handleDescriptionBlur}
                  placeholder="Enter form description"
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-sm text-muted-foreground">
              Select an element to edit its properties
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-l bg-background p-4 overflow-y-auto">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Element Properties</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(selectedElement.type === "title" ||
            selectedElement.type === "subtitle" ||
            selectedElement.type === "paragraph") && (
            <div className="space-y-2">
              <Label>Text Content</Label>
              <Textarea
                value={selectedElement.properties.text || ""}
                onChange={(e) => handlePropertyChange("text", e.target.value)}
                placeholder="Enter text content"
              />
            </div>
          )}

          {(selectedElement.type === "text-field" ||
            selectedElement.type === "number-field" ||
            selectedElement.type === "textarea" ||
            selectedElement.type === "date-field") && (
            <>
              <div className="space-y-2">
                <Label>Label</Label>
                <Input
                  value={selectedElement.properties.label || ""}
                  onChange={(e) =>
                    handlePropertyChange("label", e.target.value)
                  }
                  placeholder="Enter field label"
                />
              </div>

              {selectedElement.type !== "date-field" && (
                <div className="space-y-2">
                  <Label>Placeholder</Label>
                  <Input
                    value={selectedElement.properties.placeholder || ""}
                    onChange={(e) =>
                      handlePropertyChange("placeholder", e.target.value)
                    }
                    placeholder="Enter placeholder text"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label>Default Value</Label>
                <Input
                  type={
                    selectedElement.type === "number-field"
                      ? "number"
                      : selectedElement.type === "date-field"
                      ? "date"
                      : "text"
                  }
                  value={selectedElement.properties.defaultValue || ""}
                  onChange={(e) =>
                    handlePropertyChange("defaultValue", e.target.value)
                  }
                  placeholder="Enter default value"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={selectedElement.properties.required || false}
                  onCheckedChange={(checked) =>
                    handlePropertyChange("required", checked)
                  }
                />
                <Label>Required field</Label>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
