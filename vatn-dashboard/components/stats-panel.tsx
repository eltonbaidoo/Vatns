"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DataPoint, PlotConfig } from "@/app/page"

interface StatsPanelProps {
  data: DataPoint[]
  selectedPlot: PlotConfig | null
  selectedRange: { start: number; end: number } | null
  timeColumn: string
}

interface Statistics {
  min: number
  max: number
  mean: number
  median: number
  start: number
  end: number
  count: number
}

export function StatsPanel({ data, selectedPlot, selectedRange, timeColumn }: StatsPanelProps) {
  const statistics = useMemo(() => {
    if (!selectedPlot || !data.length) return null

    const channel = selectedPlot.channel
    let values: number[] = []

    if (selectedRange) {
      // Statistics for selected range
      values = data
        .slice(selectedRange.start, selectedRange.end + 1)
        .map((point) => point[channel])
        .filter((val) => typeof val === "number") as number[]
    } else {
      // Statistics for entire dataset
      values = data.map((point) => point[channel]).filter((val) => typeof val === "number") as number[]
    }

    if (values.length === 0) return null

    const sorted = [...values].sort((a, b) => a - b)
    const sum = values.reduce((acc, val) => acc + val, 0)
    const mean = sum / values.length

    const median =
      sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)]

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      mean,
      median,
      start: values[0],
      end: values[values.length - 1],
      count: values.length,
    }
  }, [data, selectedPlot, selectedRange])

  const formatNumber = (num: number) => {
    if (Math.abs(num) < 0.001) return num.toExponential(3)
    return num.toFixed(3)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statistics</CardTitle>
          {selectedRange && (
            <Badge variant="secondary" className="w-fit">
              Selected Range ({selectedRange.end - selectedRange.start + 1} points)
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {!selectedPlot ? (
            <p className="text-gray-500 text-sm">Click on a plot to view statistics</p>
          ) : !statistics ? (
            <p className="text-gray-500 text-sm">No numeric data available for {selectedPlot.channel}</p>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">Channel:</span>
                <span className="text-sm font-mono">{selectedPlot.channel}</span>
              </div>

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Count:</span>
                  <span className="text-sm font-mono">{statistics.count}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Min:</span>
                  <span className="text-sm font-mono">{formatNumber(statistics.min)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Max:</span>
                  <span className="text-sm font-mono">{formatNumber(statistics.max)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Mean:</span>
                  <span className="text-sm font-mono">{formatNumber(statistics.mean)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Median:</span>
                  <span className="text-sm font-mono">{formatNumber(statistics.median)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Start:</span>
                  <span className="text-sm font-mono">{formatNumber(statistics.start)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">End:</span>
                  <span className="text-sm font-mono">{formatNumber(statistics.end)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Points:</span>
              <span className="font-mono">{data.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Time Column:</span>
              <span className="font-mono text-xs">{timeColumn}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle className="text-sm">How to Use</CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-gray-600 space-y-2">
          <p>• Click on a plot to select it and view statistics</p>
          <p>• Use the brush (bottom chart) to zoom and select ranges</p>
          <p>• Drag plots by the grip handle to reorder</p>
          <p>• Change channels and colors using the controls</p>
          <p>• Add/remove plots with the buttons</p>
        </CardContent>
      </Card>
    </div>
  )
}
