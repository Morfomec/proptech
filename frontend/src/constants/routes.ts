export const ROUTES = {
  HOME: "/",

  LOGIN: "/login",

  REGISTER: "/register",

  // VERIFY_EMAIL: "/verify-email",

  FORGOT_PASSWORD: "/forgot-password",

  RESET_PASSWORD: "/reset-password",

  DASHBOARD: "/dashboard",

  PROFILE: "/profile",

  PROPERTIES: "/properties",

  LISTINGS: "/listings",

  VERIFICATION_PENDING: "/verify-email",

  VERIFY_EMAIL: "/verify-email/:uid/:token",

  RESET_PASSWORD_SUCCESS: "/reset-password-success",
} as const;

