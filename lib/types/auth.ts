// lib/types/auth.ts

export interface signInForm {
  email: string;
  password: string;
}

export interface signUpForm {
  email: string;
  password: string;
  fullname: string;
}

export interface verifyOtpForm {
  email: string;
  otp: string;
}

export interface resendOtpForm {
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
  needsVerification?: boolean;
  email?: string;
}

export interface UserSignupMethodResponse {
  exists: boolean;
  providers: string[];
  email_confirmed: boolean;
}

export interface OtpVerificationResponse {
  user: any;
  session: any;
  verified: boolean;
  message: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
}

export interface OAuthSetupResponse {
  updated: boolean;
  user: any;
  error?: any;
}

export interface LocationData {
  timezone: string;
  language: string;
}

export type Provider = "google" | "github" | "discord" | "facebook";

export interface OAuthCallbackData {
  session: any;
  user: any;
}
