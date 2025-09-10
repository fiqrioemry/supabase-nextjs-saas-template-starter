import {
  Dialog,
  DialogTitle,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useFormSchema } from "@/hooks/use-form-schema";
import { Loader2, AlertTriangle, Trash } from "lucide-react";

import z from "zod";
import { FormProvider } from "react-hook-form";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ShortTextField } from "@/components/form-fields/short-text-field";

const DuplicateAgentSchema = z.object({
  confirm: z
    .string()
    .min(6, "Please type DUPLICATE to confirm")
    .refine((val) => val === "DUPLICATE", {
      message: "You must type DUPLICATE to confirm",
    }),
});

type DuplicateAgentForm = z.infer<typeof DuplicateAgentSchema>;

export function DuplicateAgent({ id }: { id: string }) {
  const [open, setOpen] = useState(false);

  const form = useFormSchema({
    schema: DuplicateAgentSchema,
    mode: "onChange",
    action: handleDuplicateAgent,
  });

  async function handleDuplicateAgent(data: DuplicateAgentForm) {
    const formData = new FormData();
    formData.append("confirm", data.confirm);
    formData.append("agentId", id);
    console.log("agent duplicated", id);
  }
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger className="w-full" asChild>
        <DropdownMenuItem className="text-destructive">
          <Trash className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-xl">
        {form.isSubmitting ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Loader2 className="mx-auto animate-spin mb-2" size={40} />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          </div>
        ) : (
          <>
            <DialogHeader>
              <AlertTriangle className="mx-auto text-center h-6 w-6 text-destructive" />
              <DialogTitle className="text-xl font-semibold text-destructive text-center">
                Delete Agent
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-muted-foreground">
                All chats history will permanently deleted. This action cannot
                be irreversible
              </DialogDescription>
            </DialogHeader>
            <FormProvider {...form.methods}>
              <form onSubmit={form.handleSubmit} className="space-y-4">
                <ShortTextField
                  name="confirm"
                  placeholder="Type DELETE to confirm"
                  helperText="This action is irreversible"
                />

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    disabled={!form.isValid || !form.isDirty}
                  >
                    Confirm Delete
                  </Button>
                </div>
              </form>
            </FormProvider>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
