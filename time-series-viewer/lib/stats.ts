/**
 * Calculate statistics for a dataset
 */
export interface Stats {
  min: number
  max: number
  mean: number
  median: number
  start: number
  end: number
}

export function calculateStats(values: number[]): Stats | null {
  if (values.length === 0) return null

  const sorted = [...values].sort((a, b) => a - b)
  const sum = values.reduce((acc, val) => acc + val, 0)

  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    mean: sum / values.length,
    median:
      values.length % 2 === 0
        ? (sorted[values.length / 2 - 1] + sorted[values.length / 2]) / 2
        : sorted[Math.floor(values.length / 2)],
    start: values[0],
    end: values[values.length - 1],
  }
}
