import Papa from "papaparse"
import { secondsToMs } from "./time"

export type ChannelName =
  | "roll_deg"
  | "pitch_deg"
  | "yaw_deg"
  | "depth"
  | "vel_x_m_s"
  | "vel_y_m_s"
  | "northing_m"
  | "easting_m"

export interface TimeSeriesRow {
  t: number // time in milliseconds
  roll_deg?: number
  pitch_deg?: number
  yaw_deg?: number
  depth?: number
  vel_x_m_s?: number
  vel_y_m_s?: number
  northing_m?: number
  easting_m?: number
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
            const normalized: TimeSeriesRow = {
              t: secondsToMs(row["time (s)"] || 0),
            }

            // Add channel values if they're numeric
            const channels: ChannelName[] = [
              "roll_deg",
              "pitch_deg",
              "yaw_deg",
              "depth",
              "vel_x_m_s",
              "vel_y_m_s",
              "northing_m",
              "easting_m",
            ]

            channels.forEach((channel) => {
              const value = row[channel]
              if (typeof value === "number" && !isNaN(value)) {
                normalized[channel] = value
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
      t: secondsToMs(i),
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
