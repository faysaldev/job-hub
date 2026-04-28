/**
 * Truncates a string to a specified length and appends an ellipsis if it exceeds that length.
 * 
 * @param text - The string to truncate.
 * @param limit - The maximum number of characters allowed.
 * @returns The truncated string.
 */
export const truncate = (text: string, limit: number): string => {
  if (!text) return "";
  if (text.length <= limit) return text;
  return text.slice(0, limit) + "...";
};

/**
 * Checks if a string exceeds a specified length.
 * Useful for determining if a "See More" button should be shown.
 * 
 * @param text - The string to check.
 * @param limit - The length limit.
 * @returns True if the text is longer than the limit, false otherwise.
 */
export const shouldTruncate = (text: string, limit: number): boolean => {
  return text ? text.length > limit : false;
};
