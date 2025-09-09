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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { FormProvider } from "react-hook-form";
import { deleteAccount } from "@/lib/actions/user";
import { ShortTextField } from "@/components/form-fields/short-text-field";

const DeleteAccountSchema = z.object({
  confirm: z
    .string()
    .min(6, "Please type DELETE to confirm")
    .refine((val) => val === "DELETE", {
      message: "You must type DELETE to confirm",
    }),
});

type DeleteAccountForm = z.infer<typeof DeleteAccountSchema>;

export function DeleteAccountForm() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const form = useFormSchema({
    schema: DeleteAccountSchema,
    mode: "onChange",
    action: handleDeleteAccount,
  });

  async function handleDeleteAccount(data: DeleteAccountForm) {
    const formData = new FormData();
    formData.append("confirm", data.confirm);

    const result = await deleteAccount(formData);
    if (result.success) {
      toast.success(result.message);
      router.push("/signup");
    } else {
      toast.error(result.message);
    }
  }
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="justify-start" type="button">
          <Trash className="w-4 h-4" />
          <span>Delete Account</span>
        </Button>
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
                Delete Account
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-muted-foreground">
                Are you sure you want to delete your account? This action cannot
                be undone
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
