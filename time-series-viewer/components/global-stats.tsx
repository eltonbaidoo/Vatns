"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTimeSeriesStore } from "@/lib/store"
import { calculateStats } from "@/lib/stats"
import { useMemo } from "react"

export function GlobalStats() {
  const { rows, plots, focusedPlotId } = useTimeSeriesStore()

  const focusedPlot = plots.find((p) => p.id === focusedPlotId)

  const stats = useMemo(() => {
    if (!focusedPlot || focusedPlot.channels.length === 0) return null

    const channelStats = focusedPlot.channels.map((channel) => {
      const values = rows.map((row) => row[channel]).filter((v): v is number => v !== undefined)
      return {
        channel,
        stats: calculateStats(values),
      }
    })

    return channelStats
  }, [rows, focusedPlot])

  if (!stats || stats.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Global Statistics</CardTitle>
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
        <CardTitle className="text-sm">Global Statistics</CardTitle>
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
                <span className="text-muted-foreground">Start:</span>
                <span className="font-mono">{s.start.toFixed(2)}</span>
                <span className="text-muted-foreground">End:</span>
                <span className="font-mono">{s.end.toFixed(2)}</span>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
