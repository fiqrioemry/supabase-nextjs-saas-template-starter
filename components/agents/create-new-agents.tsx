"use client";

import z from "zod";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { createAgent } from "@/lib/actions/agents";
import { useFormSchema } from "@/hooks/use-form-schema";
import { ErrorMessageBox } from "@/components/shared/ResponseMessage";
import { LongTextField } from "@/components/form-fields/long-text-field";
import { ShortTextField } from "@/components/form-fields/short-text-field";

export const CreateAgentSchema = z.object({
  name: z.string().trim().min(3, "Name required min. 3 characters"),
  description: z
    .string()
    .trim()
    .min(5, "Description required min. 5 characters"),
});

export type CreateAgentFormData = z.infer<typeof CreateAgentSchema>;

export function CreateNewAgent() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    form.reset();
  };

  const form = useFormSchema({
    mode: "onChange",
    schema: CreateAgentSchema,
    action: handleCreateAgent,
  });

  async function handleCreateAgent(data: CreateAgentFormData) {
    try {
      const result = await createAgent(data);
      if (result.success) {
        toast.success(result.message);
        setOpen(false);
        router.push(`/dashboard/agents/${result.data.id}`);
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || "Failed to create agent");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="mr-2" /> Create New Agent
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Agent</DialogTitle>
        </DialogHeader>
        <FormProvider {...form.methods}>
          <form onSubmit={form.handleSubmit} className="space-y-4">
            <ErrorMessageBox message={error} />
            <ShortTextField
              name="name"
              label="Your Agent's Name"
              placeholder="Eq. Customer Support Bot"
            />
            <LongTextField
              name="description"
              label="Your Agent's Description"
              placeholder="Eq. This agent helps customers with their inquiries."
            />
            <Button
              type="submit"
              className="w-full"
              disabled={form.isSubmitting || !form.isValid || !form.isDirty}
            >
              {form.isSubmitting ? "Creating..." : "Create new agent"}
            </Button>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
