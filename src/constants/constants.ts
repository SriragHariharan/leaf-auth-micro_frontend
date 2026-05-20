export const LEAF_BACKEND_URL = process.env.REACT_APP_LEAF_BACKEND_URL;
export const LEAF_USER_ID = "LEAF_USER_ID";
export const LEAF_AX_TOKEN = "LEAF_ACCESS_TOKEN";
export const LEAF_RF_TOKEN = "LEAF_REFRESH_TOKEN";
export const GOOGLE_OAUTH_CLIENT_ID = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID;
export const OTP_TIMER_INTERVAL = 300000; // Default to 5 minutes (300000ms)

/** Auth API paths (appended to REACT_APP_LEAF_BACKEND_URL) */
export const AUTH_PATHS = {
  login: '/user/auth/login',
  signup: '/user/auth/signup',
  oauthSignup: '/user/auth/oauth-signup',
  confirmEmail: '/user/auth/confirm-email',
  confirmOtp: '/user/auth/confirm-otp',
  resendOtp: '/user/auth/resend-otp',
  resetPassword: '/user/auth/reset-password',
} as const;

export function authUrl(path: string): string {
  return `${LEAF_BACKEND_URL}${path}`;
}
