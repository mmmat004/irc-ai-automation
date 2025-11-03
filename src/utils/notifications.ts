import { toast } from "sonner";

/**
 * Notification utility for consistent toast messages throughout the application
 */

/**
 * Show a success notification
 */
export const showSuccess = (message: string, description?: string) => {
  if (description) {
    toast.success(message, {
      description,
      duration: 4000,
    });
  } else {
    toast.success(message, {
      duration: 4000,
    });
  }
};

/**
 * Show an error notification
 */
export const showError = (message: string, description?: string) => {
  if (description) {
    toast.error(message, {
      description,
      duration: 5000,
    });
  } else {
    toast.error(message, {
      duration: 5000,
    });
  }
};

/**
 * Show a warning notification
 */
export const showWarning = (message: string, description?: string) => {
  if (description) {
    toast.warning(message, {
      description,
      duration: 4000,
    });
  } else {
    toast.warning(message, {
      duration: 4000,
    });
  }
};

/**
 * Show an info notification
 */
export const showInfo = (message: string, description?: string) => {
  if (description) {
    toast.info(message, {
      description,
      duration: 4000,
    });
  } else {
    toast.info(message, {
      duration: 4000,
    });
  }
};

/**
 * Predefined notification messages for common actions
 */
export const NotificationMessages = {
  // News verification
  newsVerified: (title: string) => `"${title}" has been verified successfully!`,
  newsVerificationFailed: (error?: string) => error || 'Failed to verify news article. Please try again.',
  
  // News rejection
  newsRejected: (title: string) => `"${title}" has been rejected!`,
  newsRejectionFailed: (error?: string) => error || 'Failed to reject news article. Please try again.',
  
  // News approval
  newsApproved: (title: string) => `"${title}" has been approved successfully!`,
  newsApprovalFailed: (error?: string) => error || 'Failed to approve news article. Please try again.',
  
  // Status cancellation
  verificationCancelled: (title: string) => `"${title}" verification has been cancelled.`,
  rejectionCancelled: (title: string) => `"${title}" rejection has been cancelled.`,
  cancellationFailed: (error?: string) => error || 'Failed to cancel action. Please try again.',
  
  // Bulk operations
  bulkVerified: (count: number) => `${count} item${count !== 1 ? 's' : ''} have been verified successfully!`,
  bulkRejected: (count: number) => `${count} item${count !== 1 ? 's' : ''} have been rejected!`,
  bulkOperationFailed: (action: string) => `Some items failed to ${action}. Please try again.`,
  
  // Configuration
  configSaved: "Weekly configuration updated successfully",
  configSaveFailed: "Failed to save configuration. Please try again.",
  configValidationError: {
    category: "Please select a category before saving",
    format: "Please select a news format before saving",
  },
  
  // Loading errors
  loadFailed: (resource: string) => `Failed to load ${resource}. Please try again.`,
  connectionError: "Cannot connect to server. Check your connection.",
  
  // Authentication
  authRequired: "Authentication required. Please log in again.",
  authFailed: "Authentication failed. Please try again.",
  permissionDenied: "You don't have permission to perform this action.",
  
  // Server errors
  serverError: (context?: string) => context 
    ? `Server error occurred: ${context}. Please contact support.`
    : "Server error occurred. Please contact support.",
  endpointNotFound: (endpoint?: string) => endpoint
    ? `${endpoint} endpoint not found. Please contact support.`
    : "Endpoint not found. Please contact support.",
};

