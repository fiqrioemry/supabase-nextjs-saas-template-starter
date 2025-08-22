import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const signUpSchema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
    display_name: z
      .string()
      .min(2, "Display name must be at least 2 characters"),
    bio: z.string().max(160, "Bio must be 160 characters or less").optional(),
    website: z
      .string()
      .url("Please enter a valid URL")
      .or(z.literal(""))
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const otpVerificationSchema = z.object({
  token: z.string().min(6, "Please enter the 6-digit verification code"),
  email: z.string().email(),
});

export const profileUpdateSchema = z.object({
  display_name: z.string().min(2, "Display name must be at least 2 characters"),
  bio: z.string().max(160, "Bio must be 160 characters or less").optional(),
  website: z
    .string()
    .url("Please enter a valid URL")
    .or(z.literal(""))
    .optional(),
});

export type SignInInput = z.infer<typeof signInSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type OtpVerificationInput = z.infer<typeof otpVerificationSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
