// components/form-builder/canvas-area.tsx
"use client";

import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { useFormBuilderStore } from "@/lib/store/form-store";
import { FormElementRenderer } from "./form-element-renderer";
import { SortableFormElement } from "./sortable-form-element";

export function CanvasArea() {
  const { formData, isPreviewMode } = useFormBuilderStore();

  const { isOver, setNodeRef } = useDroppable({
    id: "canvas-droppable",
  });

  if (formData.elements.length === 0) {
    return (
      <div
        ref={setNodeRef}
        className={cn(
          "flex-1 bg-background grid-pattern p-8 flex items-center justify-center min-h-[600px]",
          isOver && "bg-accent/20"
        )}
      >
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium">Drop elements here</p>
          <p className="text-sm">
            Drag and drop form elements from the sidebar to start building your
            form
          </p>
        </div>
      </div>
    );
  }

  if (isPreviewMode) {
    return (
      <div className="flex-1 bg-background p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{formData.title}</h1>
            {formData.description && (
              <p className="text-muted-foreground">{formData.description}</p>
            )}
          </div>
          <div className="space-y-4">
            {formData.elements.map((element) => (
              <FormElementRenderer
                key={element.id}
                element={element}
                isPreview={true}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-1 bg-background grid-pattern p-8",
        isOver && "bg-accent/20"
      )}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{formData.title}</h1>
          {formData.description && (
            <p className="text-muted-foreground">{formData.description}</p>
          )}
        </div>

        <SortableContext
          items={formData.elements.map((el) => el.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {formData.elements.map((element) => (
              <SortableFormElement key={element.id} element={element} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
}
