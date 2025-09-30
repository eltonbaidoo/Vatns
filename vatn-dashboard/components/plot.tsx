"use client"

import { useState, useMemo } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Brush } from "recharts"
import type { DataPoint } from "@/app/page"

interface PlotProps {
  data: DataPoint[]
  timeColumn: string
  dataColumn: string
  color: string
  onSelect: () => void
  onRangeSelect: (range: { start: number; end: number } | null) => void
}

export function Plot({ data, timeColumn, dataColumn, color, onSelect, onRangeSelect }: PlotProps) {
  const [zoomDomain, setZoomDomain] = useState<{ start: number; end: number } | null>(null)

  const chartData = useMemo(() => {
    return data
      .map((point, index) => ({
        index,
        time: point[timeColumn],
        value: point[dataColumn],
        originalData: point,
      }))
      .filter((point) => point.value !== undefined && point.value !== null)
  }, [data, timeColumn, dataColumn])

  const handleBrushChange = (brushData: any) => {
    if (brushData && brushData.startIndex !== undefined && brushData.endIndex !== undefined) {
      const range = {
        start: brushData.startIndex,
        end: brushData.endIndex,
      }
      setZoomDomain(range)
      onRangeSelect(range)
    }
  }

  const displayData = useMemo(() => {
    if (!zoomDomain) return chartData
    return chartData.slice(zoomDomain.start, zoomDomain.end + 1)
  }, [chartData, zoomDomain])

  const formatValue = (value: any) => {
    if (typeof value === "number") {
      return value.toFixed(3)
    }
    return value
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`Time: ${formatValue(data.time)}`}</p>
          <p className="text-blue-600">{`${dataColumn}: ${formatValue(data.value)}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full" onClick={onSelect}>
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="time" tickFormatter={formatValue} stroke="#666" />
            <YAxis tickFormatter={formatValue} stroke="#666" />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Brush for zooming */}
      <div className="h-16">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <Line type="monotone" dataKey="value" stroke={color} strokeWidth={1} dot={false} />
            <Brush dataKey="time" height={40} stroke={color} onChange={handleBrushChange} tickFormatter={formatValue} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {zoomDomain && (
        <div className="mt-2 flex justify-between items-center text-sm text-gray-600">
          <span>Zoomed: {zoomDomain.end - zoomDomain.start + 1} points</span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setZoomDomain(null)
              onRangeSelect(null)
            }}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Reset Zoom
          </button>
        </div>
      )}
    </div>
  )
}
