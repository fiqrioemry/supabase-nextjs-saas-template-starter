"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FieldConfig } from "@/lib/types/form";
import { createPassword } from "@/lib/actions/auth";
import { FormActions } from "../form-control/form-submit";
import { FormRenderer } from "../form-control/form-renderer";

interface CreatePasswordDialogProps {
  onSuccess?: () => void;
}

export function CreatePasswordDialog({ onSuccess }: CreatePasswordDialogProps) {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const createPasswordFields: FieldConfig[] = [
    {
      type: "password",
      label: "new password",
      name: "newPassword",
      placeholder: "Enter your new password",
      validation: {
        required: true,
        minLength: 8,
        pattern:
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z0-9!@#$%^&*]{8,}$",
      },
    },
    {
      type: "password",
      label: "confirm password",
      name: "confirmPassword",
      placeholder: "Confirm your new password",
      validation: {
        required: true,
        minLength: 8,
      },
    },
  ];

  const handleSubmit = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const result = await createPassword(data.newPassword);
      if (result.success) {
        toast.success(result.message || "Password set successfully");
        setOpen(false);
        onSuccess?.();
      } else {
        toast.error(result.message || "Failed to set password");
      }
    } catch (err) {
      toast.error("Failed to set password");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Set Up Password</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Up Password</DialogTitle>
        </DialogHeader>
        <FormRenderer
          mode="onSubmit"
          fields={createPasswordFields}
          onSubmit={handleSubmit}
        >
          <FormActions submitLabel="Set Password" mode="onSubmit" />
        </FormRenderer>
      </DialogContent>
    </Dialog>
  );
}
