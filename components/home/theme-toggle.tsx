"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [checked, setChecked] = React.useState(theme === "dark");

  React.useEffect(() => {
    setChecked(theme === "dark");
  }, [theme]);

  const handleToggle = (value: boolean) => {
    setChecked(value);
    setTheme(value ? "dark" : "light");
  };

  return (
    <div className="flex items-center space-x-2 py-2">
      <Sun className="h-4 w-4 text-yellow-500" />
      <Switch
        checked={checked}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-zinc-800"
      />
      <Moon className="h-4 w-4 text-blue-500" />
      <Label className="sr-only">Toggle theme</Label>
    </div>
  );
}
