// lib/actions/form.ts
"use server";

import { revalidatePath } from "next/cache";
import { createServer } from "@/lib/supabase/server";
import { createFormSchema, updateFormSchema } from "@/lib/schemas/form";
import { FormElement } from "@/lib/types/form";

export async function createForm(data: {
  title: string;
  description?: string;
  elements: FormElement[];
}) {
  const supabase = await createServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Authentication required");
  }

  const validatedData = createFormSchema.parse(data);

  try {
    // Create form
    const { data: form, error: formError } = await supabase
      .from("forms")
      .insert({
        user_id: user.id,
        title: validatedData.title,
        description: validatedData.description || null,
        is_active: true,
      })
      .select()
      .single();

    if (formError) throw formError;

    // Create form fields
    const formFields = validatedData.elements.map((element) => ({
      form_id: form.id,
      name: element.id,
      label: element.properties.label || element.type,
      type: element.type,
      options: element.properties,
      position: element.position,
      required: element.properties.required || false,
    }));

    if (formFields.length > 0) {
      const { error: fieldsError } = await supabase
        .from("form_fields")
        .insert(formFields);

      if (fieldsError) throw fieldsError;
    }

    revalidatePath("/dashboard");
    return { success: true, data: form };
  } catch (error) {
    console.error("Error creating form:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create form",
    };
  }
}

export async function updateForm(data: {
  id: string;
  title?: string;
  description?: string;
  elements?: FormElement[];
}) {
  const supabase = await createServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Authentication required");
  }

  const validatedData = updateFormSchema.parse(data);

  try {
    // Update form
    const { data: form, error: formError } = await supabase
      .from("forms")
      .update({
        title: validatedData.title,
        description: validatedData.description,
      })
      .eq("id", validatedData.id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (formError) throw formError;

    // Update form fields if provided
    if (validatedData.elements) {
      // Delete existing fields
      await supabase
        .from("form_fields")
        .delete()
        .eq("form_id", validatedData.id);

      // Insert new fields
      const formFields = validatedData.elements.map((element) => ({
        form_id: form.id,
        name: element.id,
        label: element.properties.label || element.type,
        type: element.type,
        options: element.properties,
        position: element.position,
        required: element.properties.required || false,
      }));

      if (formFields.length > 0) {
        const { error: fieldsError } = await supabase
          .from("form_fields")
          .insert(formFields);

        if (fieldsError) throw fieldsError;
      }
    }

    revalidatePath("/dashboard");
    revalidatePath(`/form/${validatedData.id}`);
    return { success: true, data: form };
  } catch (error) {
    console.error("Error updating form:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update form",
    };
  }
}

export async function deleteForm(formId: string) {
  const supabase = await createServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Authentication required");
  }

  try {
    const { error } = await supabase
      .from("forms")
      .delete()
      .eq("id", formId)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error deleting form:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete form",
    };
  }
}

export async function getForm(formId: string) {
  const supabase = await createServer();

  try {
    const { data: form, error: formError } = await supabase
      .from("forms")
      .select("*")
      .eq("id", formId)
      .single();

    if (formError) throw formError;

    const { data: fields, error: fieldsError } = await supabase
      .from("form_fields")
      .select("*")
      .eq("form_id", formId)
      .order("position");

    if (fieldsError) throw fieldsError;

    return {
      success: true,
      data: {
        ...form,
        fields: fields || [],
      },
    };
  } catch (error) {
    console.error("Error getting form:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get form",
    };
  }
}

export async function getUserForms() {
  const supabase = await createServer();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Authentication required");
  }

  try {
    const { data: forms, error } = await supabase
      .from("forms")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, data: forms || [] };
  } catch (error) {
    console.error("Error getting user forms:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to get forms",
    };
  }
}

// ===== UTILITIES =====
