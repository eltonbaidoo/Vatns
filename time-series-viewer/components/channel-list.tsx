"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTimeSeriesStore } from "@/lib/store"
import { getAvailableColumns } from "@/lib/csv"
import { Plus, X } from "lucide-react"

export function ChannelList() {
  const { rows, plots, focusedPlotId, addYAxisToPlot, removeYAxisFromPlot } = useTimeSeriesStore()

  const focusedPlot = plots.find((p) => p.id === focusedPlotId)

  const availableColumns = getAvailableColumns(rows)

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
        {availableColumns.map((column) => {
          const isActive = focusedPlot.yAxes.includes(column)
          const isXAxis = focusedPlot.xAxis === column
          return (
            <div key={column} className="flex items-center justify-between gap-2">
              <span className="text-sm font-mono flex items-center gap-2">
                {column}
                {isXAxis && <span className="text-xs text-muted-foreground">(X-axis)</span>}
              </span>
              {isActive ? (
                <Button size="sm" variant="ghost" onClick={() => removeYAxisFromPlot(focusedPlot.id, column)}>
                  <X className="w-4 h-4" />
                </Button>
              ) : (
                <Button size="sm" variant="ghost" onClick={() => addYAxisToPlot(focusedPlot.id, column)}>
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
