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
import { Edit2 } from "lucide-react";
import { FieldConfig } from "@/lib/types/form";
import { Button } from "@/components/ui/button";
import { useChangePassword } from "@/hooks/use-auth-query";
import { FormActions } from "@/components/form-control/form-submit";
import { FormRenderer } from "@/components/form-control/form-renderer";



const changePasswordFields: FieldConfig[] = [
  {
    type: "password",
    label: "current password",
    name: "currentPassword",
    placeholder: "Enter your current password",
    validation: {
      required: true,
    },
  },
  {
    type: "password",
    label: "new password",
    name: "newPassword",
    placeholder: "Enter your new password",
    validation: {
      required: true,
      minLength: 8,
      pattern: true,
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

export function ChangePasswordDialog() {
  const [open, setOpen] = useState(false);
  const changePasswordMutation = useChangePassword();

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const handleSubmit = async (data: any) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const result = await changePasswordMutation.mutateAsync({
        newPassword: data.newPassword,
        currentPassword: data.currentPassword,
      });
      
      if (result.success) {
        toast.success(result.message || "Password changed successfully");
        setOpen(false);
      } else {
        toast.error(result.message || "Failed to change password");
      }
    } catch (err) {
      toast.error("Failed to change password");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="justify-start" type="button">
          <Edit2 className="w-4 h-4" />
          <span>Update Password</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <FormRenderer
          mode="onSubmit"
          fields={changePasswordFields}
          onSubmit={handleSubmit}
        >
   
          <FormActions 
            submitLabel="Update Password" 
            mode="onSubmit" 
          />
        </FormRenderer>
      </DialogContent>
    </Dialog>
  );
}
