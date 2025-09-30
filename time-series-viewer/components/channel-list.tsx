"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ChannelName } from "@/lib/csv"
import { useTimeSeriesStore } from "@/lib/store"
import { Plus, X } from "lucide-react"

const ALL_CHANNELS: ChannelName[] = [
  "roll_deg",
  "pitch_deg",
  "yaw_deg",
  "depth",
  "vel_x_m_s",
  "vel_y_m_s",
  "northing_m",
  "easting_m",
]

export function ChannelList() {
  const { plots, focusedPlotId, addChannelToPlot, removeChannelFromPlot } = useTimeSeriesStore()

  const focusedPlot = plots.find((p) => p.id === focusedPlotId)

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
        {ALL_CHANNELS.map((channel) => {
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
