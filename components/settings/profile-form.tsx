"use client";

import { toast } from "sonner";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/lib/actions/user";
import { User } from "@supabase/supabase-js";
import { useAuth } from "@/providers/auth-providers";
import { X, Check, Mail, Calendar } from "lucide-react";

import type { FieldConfig } from "@/lib/types/form";
import { FormRenderer } from "@/components/form-control/form-renderer";

interface Profile {
  bio: string;
  website: string;
  display_name: string;
}

const profileFields: FieldConfig[] = [
  {
    type: "shortText",
    name: "display_name",
    label: "Full Name",
    className: "col-span-2",
    placeholder: "Enter your full name",
    validation: { required: true, minLength: 3 },
  },
  {
    type: "shortText",
    name: "website",
    label: "Website",
    className: "col-span-2",
    placeholder: "https://example.com",
  },
  {
    type: "longText",
    name: "bio",
    label: "Bio",
    placeholder: "Tell us about yourself...",
    rows: 4,
    validation: { maxLength: 500 },
  },
];

export function ProfileForm({ user }: { user: User }) {
  const { setUser } = useAuth();

  const handleUpdateProfile = async (data: Profile) => {
    try {
      const formData = new FormData();
      formData.append("bio", data.bio);
      formData.append("website", data.website);
      formData.append("display_name", data.display_name.trim());

      const result = await updateProfile(formData);
      setUser(result?.data ?? null);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred");
    }
  };

  const defaultValues = {
    display_name: user.user_metadata?.display_name || "",
    website: user.user_metadata?.website || "",
    bio: user.user_metadata?.bio || "",
  };

  return (
    <div className="space-y-6">
      {/* Read-only Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl border">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email Address
          </label>
          <div className="px-3 py-2 border rounded-lg text-muted-foreground shadow-sm">
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
      <FormRenderer
        mode="onChange"
        fields={profileFields}
        defaultValues={defaultValues}
        onSubmit={handleUpdateProfile}
      >
        {(methods) => (
          <div
            className={`transition-all duration-300 ease-in-out ${
              methods.formState.isDirty && methods.formState.isValid
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-4 scale-95 pointer-events-none"
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Indicator */}
              <div className="flex items-center text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></div>
                You have unsaved changes
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    methods.reset(defaultValues, { keepDefaultValues: true })
                  }
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
        )}
      </FormRenderer>
    </div>
  );
}
