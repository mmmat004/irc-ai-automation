export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://irc-be-production.up.railway.app';

export const API_ENDPOINTS = {
  OAUTH_EXCHANGE: `${API_BASE_URL}/auth/oauth-exchange-token`,
  USER_PROFILE: `${API_BASE_URL}/user/profile`,
  GOOGLE_AUTH: `${API_BASE_URL}/auth/google`,
} as const;
