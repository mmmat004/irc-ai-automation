export const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'https://irc-be-production-5d2d.up.railway.app';

export const API_ENDPOINTS = {
  OAUTH_EXCHANGE: `${API_BASE_URL}/auth/oauth-exchange-token`,
  USER_PROFILE: `${API_BASE_URL}/user/profile`,
  GOOGLE_AUTH: `${API_BASE_URL}/auth/google`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  WORKFLOW_CONFIG_SAVE: `${API_BASE_URL}/workflow-config/save`,
  WORKFLOW_CONFIG_CATEGORY: `${API_BASE_URL}/category/workflow-config`,
  WORKFLOW_CONFIG_FORMAT: `${API_BASE_URL}/news-format/workflow-config`,
  WORKFLOW_CONFIG_LATEST_INFO: `${API_BASE_URL}/workflow-config/latest-info`,
} as const;
