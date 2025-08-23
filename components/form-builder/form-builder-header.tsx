// components/form-builder/form-builder-header.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormBuilderStore } from "@/lib/store/form-store";
import { createForm, updateForm } from "@/lib/actions/form";
import { Eye, EyeOff, Save, ArrowLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

interface FormBuilderHeaderProps {
  formId?: string;
}

export function FormBuilderHeader({ formId }: FormBuilderHeaderProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const {
    formData,
    isPreviewMode,
    setPreviewMode,
    isSaving,
    setSaving,
    setFormTitle,
  } = useFormBuilderStore();

  const [localTitle, setLocalTitle] = useState(formData.title);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    if (localTitle !== formData.title) {
      setFormTitle(localTitle);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a form title");
      return;
    }

    setSaving(true);
    try {
      let result;

      if (formId) {
        result = await updateForm({
          id: formId,
          title: formData.title,
          description: formData.description,
          elements: formData.elements,
        });
      } else {
        result = await createForm({
          title: formData.title,
          description: formData.description,
          elements: formData.elements,
        });
      }

      if (result.success) {
        toast.success(
          formId ? "Form updated successfully!" : "Form created successfully!"
        );

        if (!formId && result.data) {
          router.push(`/form-builder/${result.data.id}`);
        }
      } else {
        toast.error(result.error || "Failed to save form");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };

  const togglePreview = () => {
    setPreviewMode(!isPreviewMode);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <header className="border-b bg-background px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <Input
            value={localTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            className="text-lg font-semibold border-none px-0 h-8 max-w-md"
            placeholder="Untitled Form"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={toggleTheme}>
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          <Button variant="outline" size="sm" onClick={togglePreview}>
            {isPreviewMode ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Edit
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </>
            )}
          </Button>

          <Button onClick={handleSave} disabled={isSaving} size="sm">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </header>
  );
}
