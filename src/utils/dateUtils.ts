/**
 * Date utility functions for consistent date handling throughout the application
 */

/**
 * Extracts and normalizes a date value to YYYY-MM-DD format
 * Handles various date formats: ISO strings, Date objects, YYYY-MM-DD strings
 * Returns "N/A" if no valid date is found
 * 
 * @param dateValue - Date value in any format (ISO string, Date object, YYYY-MM-DD string, etc.)
 * @returns Normalized date string in YYYY-MM-DD format or "N/A" if invalid
 */
export const normalizeDateToYYYYMMDD = (dateValue: any): string => {
  if (!dateValue) {
    return "N/A";
  }
  
  // If it's already a string in YYYY-MM-DD format, return as-is
  if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    return dateValue;
  }
  
  // If it's a Date object or ISO string, extract YYYY-MM-DD
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) {
    return "N/A";
  }
  
  // Use UTC methods to avoid timezone issues when extracting date components
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Extracts date from various possible field names in an object
 * Checks common date field names: date, createdAt, created_at, publishedAt, etc.
 * 
 * @param item - Object that may contain date fields
 * @returns Normalized date string in YYYY-MM-DD format or "N/A" if not found
 */
export const extractDateFromItem = (item: any): string => {
  const dateValue = item.date 
    || item.createdAt 
    || item.created_at 
    || item.publishedAt 
    || item.published_at
    || item.updatedAt
    || item.updated_at
    || item.timestamp
    || null;
  
  return normalizeDateToYYYYMMDD(dateValue);
};

/**
 * Formats a Date object to YYYY-MM-DD string for API requests
 * Uses local date (not UTC) to preserve user's selected date
 * 
 * @param date - Date object
 * @returns Date string in YYYY-MM-DD format
 */
export const formatDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

