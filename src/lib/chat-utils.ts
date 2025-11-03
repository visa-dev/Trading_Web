// Utility functions for chat system

/**
 * Adds cache busting to API calls
 */
export const addCacheBusting = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?'
  return `${url}${separator}_t=${Date.now()}`
}
