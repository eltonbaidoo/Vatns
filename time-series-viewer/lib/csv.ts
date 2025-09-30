import Papa from "papaparse"
import { secondsToMs } from "./time"

export interface TimeSeriesRow {
  [key: string]: number | undefined
}

/**
 * Parse CSV file and normalize to TimeSeriesRow[]
 */
export function parseCSV(file: File): Promise<TimeSeriesRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rows = results.data.map((row: any) => {
            const normalized: TimeSeriesRow = {}

            Object.keys(row).forEach((key) => {
              if (!key || key.trim() === "") return

              const value = row[key]
              if (typeof value === "number" && !isNaN(value)) {
                // Convert time columns from seconds to milliseconds
                if (key.toLowerCase().includes("time") || key === "t") {
                  normalized[key] = secondsToMs(value)
                } else {
                  normalized[key] = value
                }
              }
            })

            return normalized
          })

          resolve(rows)
        } catch (error) {
          reject(error)
        }
      },
      error: (error) => {
        reject(error)
      },
    })
  })
}

/**
 * Generate demo dataset
 */
export function generateDemoData(): TimeSeriesRow[] {
  const rows: TimeSeriesRow[] = []
  for (let i = 0; i < 20; i++) {
    rows.push({
      "time (s)": secondsToMs(i),
      roll_deg: Math.sin(i * 0.5) * 10 + Math.random() * 2,
      pitch_deg: Math.cos(i * 0.3) * 8 + Math.random() * 2,
      yaw_deg: i * 2 + Math.random() * 5,
      depth: 100 + i * 5 + Math.random() * 10,
      vel_x_m_s: Math.sin(i * 0.4) * 2 + Math.random(),
      vel_y_m_s: Math.cos(i * 0.4) * 2 + Math.random(),
      northing_m: i * 10 + Math.random() * 5,
      easting_m: i * 8 + Math.random() * 5,
    })
  }
  return rows
}

/**
 * Get all available column names from the data
 */
export function getAvailableColumns(rows: TimeSeriesRow[]): string[] {
  if (rows.length === 0) return []
  return Object.keys(rows[0]).filter((key) => key && key.trim() !== "" && rows[0][key] !== undefined)
}
