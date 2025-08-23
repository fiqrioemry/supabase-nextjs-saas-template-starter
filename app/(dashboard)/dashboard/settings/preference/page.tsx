"use client";

import { toast } from "sonner";
import { Globe, Palette } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/hooks/use-theme";
import type { preference } from "@/lib/types/user";
import { updatePreference } from "@/lib/actions/user";
import { useAuthStore } from "@/lib/store/auth-store";
import { SelectFilter } from "@/components/shared/select-filter";
import { languageOptions, themeOptions, timezoneOptions } from "@/lib/constant";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PreferencePage() {
  const { user } = useAuthStore();
  const { updateTheme } = useTheme();

  const handleUpdate = async (field: keyof preference, value: string) => {
    if (!user) return;

    const updatedSettings: preference = {
      theme: user.user_metadata.theme ?? "",
      language: user.user_metadata.language ?? "",
      timezone: user.user_metadata.timezone ?? "",
      [field]: value,
    };

    try {
      if (field === "theme") {
        updateTheme(value as any);
      }

      const formData = new FormData();
      Object.entries(updatedSettings).forEach(([key, value]) => {
        formData.append(key, value);
      });

      await updatePreference(formData);

      toast.success(`${field} updated successfully`);
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast.error("Failed to update settings");
    }
  };

  return (
    <div className="space-y-6">
      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">
                Choose your preferred theme
              </p>
            </div>
            <SelectFilter
              initialValue={user?.user_metadata.theme} // TAMBAH fallback ke 'system'
              onChange={(val) => handleUpdate("theme", val)}
              options={themeOptions}
            />
          </div>
        </CardContent>
      </Card>

      {/* Localization Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Localization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Timezone</Label>
              <p className="text-sm text-muted-foreground">
                Select your timezone
              </p>
            </div>
            <SelectFilter
              initialValue={user?.user_metadata.timezone}
              onChange={(val) => handleUpdate("timezone", val)}
              options={timezoneOptions}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Language</Label>
              <p className="text-sm text-muted-foreground">
                Choose your preferred language
              </p>
            </div>
            <SelectFilter
              initialValue={user?.user_metadata.language}
              onChange={(val) => handleUpdate("language", val)}
              options={languageOptions}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
