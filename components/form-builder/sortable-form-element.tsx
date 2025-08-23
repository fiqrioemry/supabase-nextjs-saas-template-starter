// components/form-builder/sortable-form-element.tsx
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FormElement } from "@/lib/types/form";
import { FormElementRenderer } from "./form-element-renderer";
import { cn } from "@/lib/utils";

interface SortableFormElementProps {
  element: FormElement;
}

export function SortableFormElement({ element }: SortableFormElementProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: element.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn("relative group", isDragging && "opacity-50")}
    >
      <FormElementRenderer element={element} />
    </div>
  );
}
