import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/auth-store";

type Theme = "light" | "dark" | "system";

export const useTheme = () => {
  const { user } = useAuthStore();

  const applyTheme = (theme: Theme) => {
    const root = window.document.documentElement;

    // Remove existing theme classes
    root.classList.remove(
      "light",
      "dark",
      "bubblegum",
      "claude",
      "supabase",
      "system"
    );

    if (theme === "system") {
      // Use system preference
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      // Use selected theme
      root.classList.add(theme);
    }
  };

  const initializeTheme = () => {
    // Get theme from user metadata or default to system
    const userTheme = user?.user_metadata?.theme as Theme;
    const theme = userTheme || "system";

    applyTheme(theme);
  };

  const updateTheme = (theme: Theme) => {
    applyTheme(theme);
  };

  // Listen to system theme changes when using system theme
  useEffect(() => {
    const userTheme = user?.user_metadata?.theme as Theme;

    if (!userTheme || userTheme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

      const handleChange = () => {
        if (
          !user?.user_metadata?.theme ||
          user.user_metadata.theme === "system"
        ) {
          applyTheme("system");
        }
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [user?.user_metadata?.theme]);

  return {
    initializeTheme,
    updateTheme,
    currentTheme: user?.user_metadata?.theme || "system",
  };
};
