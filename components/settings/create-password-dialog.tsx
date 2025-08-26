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
import { useCreatePassword } from "@/hooks/use-auth-query";
import { FormActions } from "@/components/form-control/form-submit";
import { FormRenderer } from "@/components/form-control/form-renderer";



export function CreatePasswordDialog() {
  const [open, setOpen] = useState(false);
  const createPasswordMutation = useCreatePassword();
  
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
        pattern:true,
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
      const result = await createPasswordMutation.mutateAsync(data.newPassword);
      if (result.success) {
        toast.success(result.message || "Password set successfully");
        setOpen(false);
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
          mode="onChange"
          fields={createPasswordFields}
          onSubmit={handleSubmit}
        >
          <FormActions submitLabel="Set Password" mode="onChange" />
        </FormRenderer>
      </DialogContent>
    </Dialog>
  );
}
