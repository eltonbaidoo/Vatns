"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ChannelName } from "@/lib/csv"
import { useTimeSeriesStore } from "@/lib/store"
import { Plus, X } from "lucide-react"

export function ChannelList() {
  const { rows, plots, focusedPlotId, addChannelToPlot, removeChannelFromPlot } = useTimeSeriesStore()

  const focusedPlot = plots.find((p) => p.id === focusedPlotId)

  const availableChannels: ChannelName[] =
    rows.length > 0 ? (Object.keys(rows[0]).filter((key) => key !== "time_ms") as ChannelName[]) : []

  if (rows.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Upload a data file to see available channels</p>
        </CardContent>
      </Card>
    )
  }

  if (!focusedPlot) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Channels</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Select a plot to manage channels</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Channels for {focusedPlot.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {availableChannels.map((channel) => {
          const isActive = focusedPlot.channels.includes(channel)
          return (
            <div key={channel} className="flex items-center justify-between gap-2">
              <span className="text-sm font-mono">{channel}</span>
              {isActive ? (
                <Button size="sm" variant="ghost" onClick={() => removeChannelFromPlot(focusedPlot.id, channel)}>
                  <X className="w-4 h-4" />
                </Button>
              ) : (
                <Button size="sm" variant="ghost" onClick={() => addChannelToPlot(focusedPlot.id, channel)}>
                  <Plus className="w-4 h-4" />
                </Button>
              )}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
