// components/form-builder/sidebar-elements.tsx
"use client";

import { Separator } from "@/components/ui/separator";
import { LAYOUT_ELEMENTS, FORM_ELEMENTS } from "@/lib/constant";
import { DraggableElement } from "./draggable-element";

export function SidebarElements() {
  return (
    <div className="w-80 border-l bg-background p-4 overflow-y-auto">
      <h3 className="font-semibold mb-4">Form Elements</h3>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm text-muted-foreground mb-2">Layout</h4>
          <div className="grid grid-cols-2 gap-2">
            {LAYOUT_ELEMENTS.map((element) => (
              <DraggableElement key={element.type} element={element} />
            ))}
          </div>
        </div>

        <Separator />

        <div>
          <h4 className="text-sm text-muted-foreground mb-2">Form Fields</h4>
          <div className="grid grid-cols-2 gap-2">
            {FORM_ELEMENTS.map((element) => (
              <DraggableElement key={element.type} element={element} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
