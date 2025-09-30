"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTimeSeriesStore } from "@/lib/store"
import { calculateStats } from "@/lib/stats"
import { useMemo } from "react"

export function RangeStats() {
  const { rows, plots, focusedPlotId, selection } = useTimeSeriesStore()

  const focusedPlot = plots.find((p) => p.id === focusedPlotId)

  const stats = useMemo(() => {
    if (!focusedPlot || !selection || focusedPlot.yAxes.length === 0) return null

    const xAxisKey = focusedPlot.xAxis
    const filteredRows = rows.filter((row) => {
      const xValue = row[xAxisKey]
      return xValue !== undefined && xValue >= selection.t0 && xValue <= selection.t1
    })

    const channelStats = focusedPlot.yAxes.map((yAxis) => {
      const values = filteredRows.map((row) => row[yAxis]).filter((v): v is number => v !== undefined)
      return {
        channel: yAxis,
        stats: calculateStats(values),
      }
    })

    return channelStats
  }, [rows, focusedPlot, selection])

  if (!selection) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Range Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Brush the chart to select a range</p>
        </CardContent>
      </Card>
    )
  }

  if (!stats || stats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Range Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No channels selected</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Range Statistics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {stats.map(({ channel, stats: s }) => (
          <div key={channel} className="space-y-1">
            <h4 className="text-xs font-mono font-semibold">{channel}</h4>
            {s && (
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <span className="text-muted-foreground">Min:</span>
                <span className="font-mono">{s.min.toFixed(2)}</span>
                <span className="text-muted-foreground">Max:</span>
                <span className="font-mono">{s.max.toFixed(2)}</span>
                <span className="text-muted-foreground">Mean:</span>
                <span className="font-mono">{s.mean.toFixed(2)}</span>
                <span className="text-muted-foreground">Median:</span>
                <span className="font-mono">{s.median.toFixed(2)}</span>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
