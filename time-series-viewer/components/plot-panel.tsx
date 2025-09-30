"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TimeSeriesChart } from "./time-series-chart"
import { useTimeSeriesStore } from "@/lib/store"
import { Trash2, GripVertical, X } from "lucide-react"
import { useState } from "react"

interface PlotPanelProps {
  plotId: string
  index: number
}

export function PlotPanel({ plotId, index }: PlotPanelProps) {
  const {
    rows,
    plots,
    focusedPlotId,
    setFocusedPlot,
    removePlot,
    updatePlotTitle,
    removeChannelFromPlot,
    updateChannelColor,
  } = useTimeSeriesStore()

  const plot = plots.find((p) => p.id === plotId)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleInput, setTitleInput] = useState(plot?.title || "")

  if (!plot) return null

  const isFocused = focusedPlotId === plotId

  const handleTitleSubmit = () => {
    if (titleInput.trim()) {
      updatePlotTitle(plotId, titleInput.trim())
    }
    setIsEditingTitle(false)
  }

  return (
    <Card className={`transition-all ${isFocused ? "ring-2 ring-primary" : ""}`} onClick={() => setFocusedPlot(plotId)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2 flex-1">
          <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
          {isEditingTitle ? (
            <Input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleTitleSubmit()
                if (e.key === "Escape") {
                  setIsEditingTitle(false)
                  setTitleInput(plot.title)
                }
              }}
              className="h-7 text-sm"
              autoFocus
            />
          ) : (
            <CardTitle
              className="text-sm cursor-pointer hover:text-primary"
              onDoubleClick={() => setIsEditingTitle(true)}
            >
              {plot.title}
            </CardTitle>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation()
            removePlot(plotId)
          }}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {plot.channels.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {plot.channels.map((channel) => (
              <div key={channel} className="flex items-center gap-1 bg-secondary rounded-md px-2 py-1">
                <input
                  type="color"
                  value={plot.channelColors[channel] || "#000000"}
                  onChange={(e) => {
                    e.stopPropagation()
                    updateChannelColor(plotId, channel, e.target.value)
                  }}
                  className="w-5 h-5 rounded cursor-pointer border-0"
                  title="Change color"
                />
                <span className="text-xs font-medium">{channel}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0 hover:bg-destructive/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeChannelFromPlot(plotId, channel)
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <TimeSeriesChart data={rows} channels={plot.channels} plotId={plotId} channelColors={plot.channelColors} />
      </CardContent>
    </Card>
  )
}
