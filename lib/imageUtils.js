/**
 * Helper function to ensure image URLs are correctly formatted
 * Handles relative paths, absolute URLs, and ensures proper formatting
 */
export function getImageUrl(imagePath) {
  if (!imagePath) return null;
  
  // If already absolute URL (http/https), return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If starts with /, it's already correct for Next.js public folder
  if (imagePath.startsWith('/')) {
    return imagePath;
  }
  
  // Otherwise, prepend / to make it relative to root
  return `/${imagePath}`;
}

