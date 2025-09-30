"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Palette } from "lucide-react"
import type { PlotConfig } from "@/app/page"

interface ChannelControlsProps {
  plot: PlotConfig
  availableChannels: string[]
  onUpdatePlot: (plotId: string, updates: Partial<PlotConfig>) => void
  onRemovePlot: (plotId: string) => void
}

const PRESET_COLORS = [
  "#3b82f6", // blue
  "#ef4444", // red
  "#10b981", // green
  "#f59e0b", // yellow
  "#8b5cf6", // purple
  "#06b6d4", // cyan
  "#f97316", // orange
  "#84cc16", // lime
]

export function ChannelControls({ plot, availableChannels, onUpdatePlot, onRemovePlot }: ChannelControlsProps) {
  const handleChannelChange = (newChannel: string) => {
    onUpdatePlot(plot.id, { channel: newChannel })
  }

  const handleColorChange = (newColor: string) => {
    onUpdatePlot(plot.id, { color: newColor })
  }

  return (
    <div className="flex items-center gap-2">
      {/* Channel selector */}
      <Select value={plot.channel} onValueChange={handleChannelChange}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {availableChannels.map((channel) => (
            <SelectItem key={channel} value={channel}>
              {channel}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Color picker */}
      <div className="flex items-center gap-1">
        <Palette className="h-4 w-4 text-gray-500" />
        <div className="flex gap-1">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => handleColorChange(color)}
              className={`w-6 h-6 rounded-full border-2 ${
                plot.color === color ? "border-gray-800" : "border-gray-300"
              }`}
              style={{ backgroundColor: color }}
              title={`Set color to ${color}`}
            />
          ))}
        </div>
      </div>

      {/* Remove plot button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onRemovePlot(plot.id)}
        className="text-red-600 hover:text-red-800 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
