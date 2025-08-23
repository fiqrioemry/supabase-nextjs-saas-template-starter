// Auth provider configurations
export const authProviders = {
  google: {
    provider: "google" as const,
    options: {
      redirectTo: `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/auth/callback`,
      scopes: "email profile",
    },
  },
  github: {
    provider: "github" as const,
    options: {
      redirectTo: `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/auth/callback`,
      scopes: "user:email",
    },
  },
};
