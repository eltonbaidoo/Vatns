"use client"

import { Button } from "@/components/ui/button"
import { PlotPanel } from "./plot-panel"
import { useTimeSeriesStore } from "@/lib/store"
import { Plus, RotateCcw } from "lucide-react"

export function PlotGrid() {
  const { plots, addPlot, resetZoom } = useTimeSeriesStore()

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Plots</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={resetZoom}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset Zoom
          </Button>
          <Button size="sm" onClick={addPlot} className="bg-[#B0CDD9] hover:bg-[#9DBDCA] text-slate-900">
            <Plus className="w-4 h-4 mr-2" />
            Add Plot
          </Button>
        </div>
      </div>
      <div className="space-y-4">
        {plots.map((plot, index) => (
          <PlotPanel key={plot.id} plotId={plot.id} index={index} />
        ))}
      </div>
    </div>
  )
}
