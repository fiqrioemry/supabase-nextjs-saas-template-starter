"use client";

import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/lib/actions/user";
import { profileSchema } from "@/lib/schemas/user";
import { useAuthStore } from "@/lib/store/auth-store";
import { useFormSchema } from "@/hooks/use-form-schema";
import { Check, X, Mail, Calendar, User } from "lucide-react";
import { InputTextElement } from "@/components/inputs/input-text";
import { InputTextareaElement } from "@/components/inputs/input-textarea";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { profile } from "@/lib/types/user";

export default function ProfilePage() {
  const { user } = useAuthStore();

  const handleUpdateProfile = async (data: profile) => {
    try {
      const formData = new FormData();
      formData.append("bio", data.bio);
      formData.append("website", data.website);
      formData.append("display_name", data.display_name.trim());

      await updateProfile(formData);
      methods.reset(data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  const { methods, handleSubmit } = useFormSchema({
    state: user?.user_metadata,
    schema: profileSchema,
    action: handleUpdateProfile,
    mode: "onChange",
  });

  const handleCancel = () => {
    methods.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          User Profile
        </CardTitle>
        <CardDescription>
          Manage your profile settings, including personal information and
          account details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Read-only Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl border">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <div className="px-3 py-2  border rounded-lg text-muted-foreground shadow-sm">
                  {user?.email}
                </div>
                <p className="text-xs text-gray-500">
                  Your email address cannot be changed
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Member Since
                </label>
                <div className="px-3 py-2 border rounded-lg text-muted-foreground shadow-sm">
                  {formatDate(user?.created_at ?? "")}
                </div>
                <p className="text-xs text-gray-500">Account creation date</p>
              </div>
            </div>

            {/* Editable Fields */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <InputTextElement
                    name="display_name"
                    label="Full Name"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="space-y-2">
                  <InputTextElement
                    name="website"
                    label="Website"
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <InputTextareaElement
                  name="bio"
                  label="Bio"
                  rows={4}
                  required={false}
                  showIcon={false}
                  maxLength={500}
                  placeholder="Tell us about yourself"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                methods.formState.isDirty && methods.formState.isValid
                  ? "opacity-100 translate-y-0 scale-100"
                  : "opacity-0 translate-y-4 scale-95 pointer-events-none"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></div>
                  You have unsaved changes
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={methods.formState.isSubmitting}
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={methods.formState.isSubmitting}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 font-medium transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none"
                  >
                    {methods.formState.isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
