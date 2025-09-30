/**
 * Convert seconds to milliseconds for time axis
 */
export function secondsToMs(seconds: number): number {
  return seconds * 1000
}

/**
 * Format timestamp for display
 */
export function formatTime(ms: number): string {
  return new Date(ms).toLocaleTimeString()
}
