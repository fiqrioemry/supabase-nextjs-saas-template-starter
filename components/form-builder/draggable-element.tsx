// components/form-builder/draggable-element.tsx
"use client";

import { useDraggable } from "@dnd-kit/core";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FormElementType } from "@/lib/types/form";

interface DraggableElementProps {
  element: {
    type: FormElementType;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    defaultProperties: any;
  };
}

export function DraggableElement({ element }: DraggableElementProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `element-${element.type}`,
      data: {
        type: element.type,
        properties: element.defaultProperties,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const Icon = element.icon;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "p-3 cursor-grab hover:bg-accent transition-colors flex flex-col items-center gap-2 text-xs",
        isDragging && "opacity-50"
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="text-center">{element.label}</span>
    </Card>
  );
}
