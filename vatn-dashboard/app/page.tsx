"use client"

import { useState } from "react"
import { CSVUploader } from "@/components/csv-uploader"
import { PlotContainer } from "@/components/plot-container"

export interface DataPoint {
  [key: string]: string | number
}

export interface PlotConfig {
  id: string
  channel: string
  color: string
}

export default function App() {
  const [data, setData] = useState<DataPoint[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [plots, setPlots] = useState<PlotConfig[]>([])
  const [fileName, setFileName] = useState<string>("")

  const handleDataUpload = (csvData: DataPoint[], csvColumns: string[], name: string) => {
    setData(csvData)
    setColumns(csvColumns)
    setFileName(name)

    // Create initial plots for numeric columns (excluding time column)
    const numericColumns = csvColumns.filter(
      (col) => col !== "time (s)" && col !== "" && csvData.length > 0 && typeof csvData[0][col] === "number",
    )

    const initialPlots = numericColumns.slice(0, 4).map((col, index) => ({
      id: `plot-${index}`,
      channel: col,
      color: `hsl(${index * 60}, 70%, 50%)`,
    }))

    setPlots(initialPlots)
  }

  const addPlot = () => {
    const newPlot: PlotConfig = {
      id: `plot-${Date.now()}`,
      channel: columns.find((col) => col !== "time (s)" && col !== "") || "",
      color: `hsl(${plots.length * 60}, 70%, 50%)`,
    }
    setPlots([...plots, newPlot])
  }

  const removePlot = (plotId: string) => {
    setPlots(plots.filter((plot) => plot.id !== plotId))
  }

  const updatePlot = (plotId: string, updates: Partial<PlotConfig>) => {
    setPlots(plots.map((plot) => (plot.id === plotId ? { ...plot, ...updates } : plot)))
  }

  const reorderPlots = (startIndex: number, endIndex: number) => {
    const result = Array.from(plots)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)
    setPlots(result)
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Vatn Systems Data Visualization Dashboard</h1>
        {fileName && (
          <p className="text-sm text-gray-600 mt-1">
            Current file: {fileName} ({data.length} data points)
          </p>
        )}
      </header>

      <main className="p-6">
        {data.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <CSVUploader onDataUpload={handleDataUpload} />
          </div>
        ) : (
          <PlotContainer
            data={data}
            columns={columns}
            plots={plots}
            onAddPlot={addPlot}
            onRemovePlot={removePlot}
            onUpdatePlot={updatePlot}
            onReorderPlots={reorderPlots}
          />
        )}
      </main>
    </div>
  )
}
