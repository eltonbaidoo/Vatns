"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TimeSeriesChart } from "./time-series-chart"
import { useTimeSeriesStore } from "@/lib/store"
import { getAvailableColumns } from "@/lib/csv"
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
    updatePlotXAxis,
    removeYAxisFromPlot,
    updateChannelColor,
  } = useTimeSeriesStore()

  const plot = plots.find((p) => p.id === plotId)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [titleInput, setTitleInput] = useState(plot?.title || "")

  if (!plot) return null

  const isFocused = focusedPlotId === plotId
  const availableColumns = getAvailableColumns(rows)

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
        <div className="flex items-center gap-1">
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
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-muted-foreground w-16">X-Axis:</label>
            <Select value={plot.xAxis} onValueChange={(value) => updatePlotXAxis(plotId, value)}>
              <SelectTrigger className="h-8 text-sm flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {availableColumns.map((col) => (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {plot.yAxes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {plot.yAxes.map((yAxis) => (
              <div key={yAxis} className="flex items-center gap-1 bg-secondary rounded-md px-2 py-1">
                <input
                  type="color"
                  value={plot.channelColors[yAxis] || "#000000"}
                  onChange={(e) => {
                    e.stopPropagation()
                    updateChannelColor(plotId, yAxis, e.target.value)
                  }}
                  className="w-5 h-5 rounded cursor-pointer border-0"
                  title="Change color"
                />
                <span className="text-xs font-medium">{yAxis}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-4 w-4 p-0 hover:bg-destructive/20"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeYAxisFromPlot(plotId, yAxis)
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        <TimeSeriesChart
          data={rows}
          xAxis={plot.xAxis}
          yAxes={plot.yAxes}
          plotId={plotId}
          channelColors={plot.channelColors}
        />
      </CardContent>
    </Card>
  )
}
