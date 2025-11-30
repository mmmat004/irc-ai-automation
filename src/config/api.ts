export const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://d2snwaeegxbt9.cloudfront.net';

export const API_ENDPOINTS = {
  OAUTH_EXCHANGE: `${API_BASE_URL}/auth/oauth-exchange-token`,
  USER_PROFILE: `${API_BASE_URL}/user/profile`,
  GOOGLE_AUTH: `${API_BASE_URL}/auth/google`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  WORKFLOW_CONFIG_SAVE: `${API_BASE_URL}/workflow-config/save`,
  WORKFLOW_CONFIG_CATEGORY: `${API_BASE_URL}/category/workflow-config`,
  WORKFLOW_CONFIG_FORMAT: `${API_BASE_URL}/news-format/workflow-config`,
  WORKFLOW_CONFIG_LATEST_INFO: `${API_BASE_URL}/workflow-config/latest-info`,
  CATEGORY_OVERVIEW: `${API_BASE_URL}/category/overview`,
  CATEGORY_SEARCH: `${API_BASE_URL}/category/search`,
  DASHBOARD_COUNT_OVERALL: `${API_BASE_URL}/dashboard/count-overall`,
  DASHBOARD_RECENT_NEWS: `${API_BASE_URL}/dashboard/recent-news`,
  NEWS_GET: `${API_BASE_URL}/news`,
  NEWS_SEARCH: `${API_BASE_URL}/news/search`,
  NEWS_STATUS: `${API_BASE_URL}/news/status`,
  WORKFLOW_LOG_SEARCH: `${API_BASE_URL}/workflow-log/search`,
} as const;
