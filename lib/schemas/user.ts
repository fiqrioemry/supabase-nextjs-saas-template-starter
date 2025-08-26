import { z } from "zod";

// preference schema
export const preferenceSchema = z.object({
  theme: z.string().min(1, "Theme is required"),
  location: z.string().min(1, "Location is required"),
  timezone: z.string().min(1, "Timezone is required"),
  language: z.string().min(1, "Language is required"),
});

export const profileSchema = z.object({
  display_name: z
    .string()
    .trim()
    .min(3, "Display name must be at least 3 characters")
    .max(100, "Display name must not exceed 100 characters"),
  bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
  website: z.string().optional(),
});

// Update Password Schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(100, "Password must not exceed 100 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Type exports
export type profileInput = z.infer<typeof profileSchema>;
export type preferenceInput = z.infer<typeof preferenceSchema>;
export type changePasswordInput = z.infer<typeof changePasswordSchema>;
