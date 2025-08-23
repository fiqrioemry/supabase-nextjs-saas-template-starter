// components/form-builder/form-builder-layout.tsx
"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { useFormBuilderStore } from "@/lib/store/form-store";
import { SidebarElements } from "./sidebar-element";
import { CanvasArea } from "./canvas-area";
import { PropertyEditor } from "./property-editor";
import { FormBuilderHeader } from "./form-builder-header";

export function FormBuilderLayout() {
  const { formData, addElement, reorderElements, isPreviewMode } =
    useFormBuilderStore();

  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  function handleDragOver(event: DragOverEvent) {
    // Handle drag over logic if needed
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    // Handle dropping new element from sidebar
    if (
      active.id.toString().startsWith("element-") &&
      over.id === "canvas-droppable"
    ) {
      const elementType = active.data.current?.type;
      const elementProperties = active.data.current?.properties;

      if (elementType && elementProperties) {
        addElement({
          type: elementType,
          properties: elementProperties,
        });
      }
      return;
    }

    // Handle reordering existing elements
    if (active.id !== over.id && !active.id.toString().startsWith("element-")) {
      const activeIndex = formData.elements.findIndex(
        (el) => el.id === active.id
      );
      const overIndex = formData.elements.findIndex((el) => el.id === over.id);

      if (activeIndex !== -1 && overIndex !== -1) {
        const reorderedElements = arrayMove(
          formData.elements,
          activeIndex,
          overIndex
        );
        reorderElements(reorderedElements);
      }
    }
  }

  return (
    <div className="h-screen flex flex-col">
      <FormBuilderHeader />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-1 overflow-hidden">
          {!isPreviewMode && <SidebarElements />}

          <CanvasArea />

          {!isPreviewMode && <PropertyEditor />}
        </div>

        <DragOverlay>
          {activeId ? (
            <div className="bg-background border rounded-lg p-4 shadow-lg">
              Dragging element...
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
