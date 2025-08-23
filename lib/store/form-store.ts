// lib/store/form-builder.ts
import { create } from "zustand";
import { FormElement, FormData } from "@/lib/types/form";

interface FormBuilderState {
  formData: FormData;
  selectedElementId: string | null;
  isPreviewMode: boolean;
  isSaving: boolean;

  // Actions
  setFormTitle: (title: string) => void;
  setFormDescription: (description: string) => void;
  addElement: (element: Omit<FormElement, "id" | "position">) => void;
  removeElement: (elementId: string) => void;
  updateElement: (
    elementId: string,
    properties: Partial<FormElement["properties"]>
  ) => void;
  moveElement: (elementId: string, newPosition: number) => void;
  selectElement: (elementId: string | null) => void;
  setPreviewMode: (isPreview: boolean) => void;
  setSaving: (isSaving: boolean) => void;
  setFormData: (formData: FormData) => void;
  resetForm: () => void;
  reorderElements: (elements: FormElement[]) => void;
}

const initialFormData: FormData = {
  title: "Untitled Form",
  description: "",
  elements: [],
  isActive: true,
};

export const useFormBuilderStore = create<FormBuilderState>((set, get) => ({
  formData: initialFormData,
  selectedElementId: null,
  isPreviewMode: false,
  isSaving: false,

  setFormTitle: (title) =>
    set((state) => ({
      formData: { ...state.formData, title },
    })),

  setFormDescription: (description) =>
    set((state) => ({
      formData: { ...state.formData, description },
    })),

  addElement: (elementData) =>
    set((state) => {
      const newElement: FormElement = {
        ...elementData,
        id: `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        position: state.formData.elements.length,
      };

      return {
        formData: {
          ...state.formData,
          elements: [...state.formData.elements, newElement],
        },
      };
    }),

  removeElement: (elementId) =>
    set((state) => ({
      formData: {
        ...state.formData,
        elements: state.formData.elements
          .filter((el) => el.id !== elementId)
          .map((el, index) => ({ ...el, position: index })),
      },
      selectedElementId:
        state.selectedElementId === elementId ? null : state.selectedElementId,
    })),

  updateElement: (elementId, properties) =>
    set((state) => ({
      formData: {
        ...state.formData,
        elements: state.formData.elements.map((el) =>
          el.id === elementId
            ? { ...el, properties: { ...el.properties, ...properties } }
            : el
        ),
      },
    })),

  moveElement: (elementId, newPosition) =>
    set((state) => {
      const elements = [...state.formData.elements];
      const elementIndex = elements.findIndex((el) => el.id === elementId);

      if (elementIndex === -1) return state;

      const [movedElement] = elements.splice(elementIndex, 1);
      elements.splice(newPosition, 0, movedElement);

      // Update positions
      const updatedElements = elements.map((el, index) => ({
        ...el,
        position: index,
      }));

      return {
        formData: {
          ...state.formData,
          elements: updatedElements,
        },
      };
    }),

  selectElement: (elementId) => set({ selectedElementId: elementId }),

  setPreviewMode: (isPreview) =>
    set({ isPreviewMode: isPreview, selectedElementId: null }),

  setSaving: (isSaving) => set({ isSaving }),

  setFormData: (formData) => set({ formData, selectedElementId: null }),

  resetForm: () =>
    set({
      formData: initialFormData,
      selectedElementId: null,
      isPreviewMode: false,
    }),

  reorderElements: (elements) =>
    set((state) => ({
      formData: {
        ...state.formData,
        elements: elements.map((el, index) => ({ ...el, position: index })),
      },
    })),
}));
