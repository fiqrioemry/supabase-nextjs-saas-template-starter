import { toast } from "sonner";
import { useState } from "react";
import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { changePassword } from "@/lib/actions/user";
import { FormDialog } from "@/components/forms/form-dialog";
import { changePasswordSchema } from "@/lib/schemas/user";
import { InputPassword } from "@/components/inputs/input-password";

interface changePasswordForm {
  currentPassword: string;
  newPassword: string;
}

const changePasswordState = {
  currrentPassword: "",
  newPassword: "",
};
export const ChangePassword = () => {
  const [loading, setLoading] = useState(false);
  const updatePassword = async (form: changePasswordForm) => {
    setLoading(true);
    const response = await changePassword(
      form.currentPassword,
      form.newPassword
    );
    if (!response.success) {
      setLoading(false);
      return { success: false, error: response.error };
    }
    toast.success(response.message);
    setLoading(false);
    return { success: true };
  };

  return (
    <FormDialog
      state={changePasswordState}
      loading={loading}
      title="Change Password"
      action={updatePassword}
      schema={changePasswordSchema}
      buttonElement={
        <Button className="justify-start" type="button">
          <Edit2 className="w-4 h-4" />
          <span>Update Password</span>
        </Button>
      }
    >
      <InputPassword
        name="currentPassword"
        label="Current Password"
        placeholder="Enter your current password"
      />

      {/* New Password - With strength indicator and clearable */}
      <InputPassword
        name="newPassword"
        label="New Password"
        placeholder="Enter your new password"
        showStrengthIndicator={false}
        clearable={true}
        minLength={8}
        maxLength={128}
      />

      {/* Confirm Password - Basic */}
      <InputPassword
        name="confirmPassword"
        label="Confirm New Password"
        placeholder="Confirm your new password"
        clearable={true}
      />
    </FormDialog>
  );
};
