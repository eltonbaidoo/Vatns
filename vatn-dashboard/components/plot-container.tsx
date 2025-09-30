"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, GripVertical } from "lucide-react"
import { Plot } from "@/components/plot"
import { ChannelControls } from "@/components/channel-controls"
import { StatsPanel } from "@/components/stats-panel"
import type { DataPoint, PlotConfig } from "@/app/page"

interface PlotContainerProps {
  data: DataPoint[]
  columns: string[]
  plots: PlotConfig[]
  onAddPlot: () => void
  onRemovePlot: (plotId: string) => void
  onUpdatePlot: (plotId: string, updates: Partial<PlotConfig>) => void
  onReorderPlots: (startIndex: number, endIndex: number) => void
}

export function PlotContainer({
  data,
  columns,
  plots,
  onAddPlot,
  onRemovePlot,
  onUpdatePlot,
  onReorderPlots,
}: PlotContainerProps) {
  const [selectedPlot, setSelectedPlot] = useState<string | null>(null)
  const [selectedRange, setSelectedRange] = useState<{ start: number; end: number } | null>(null)

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    onReorderPlots(result.source.index, result.destination.index)
  }

  const timeColumn = columns.find((col) => col.includes("time")) || columns[0]
  const dataColumns = columns.filter(
    (col) => col !== timeColumn && col !== "" && data.length > 0 && typeof data[0][col] === "number",
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main plots area */}
      <div className="lg:col-span-3 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Time Series Plots ({plots.length})</h2>
          <Button onClick={onAddPlot} className="bg-[#B0CDD9] hover:bg-[#9BB8C6] text-gray-800">
            <Plus className="h-4 w-4 mr-2" />
            Add Plot
          </Button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="plots">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {plots.map((plot, index) => (
                  <Draggable key={plot.id} draggableId={plot.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`${snapshot.isDragging ? "opacity-75" : ""}`}
                      >
                        <Card className={`${selectedPlot === plot.id ? "ring-2 ring-blue-400" : ""}`}>
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-lg flex items-center gap-2">
                                <div {...provided.dragHandleProps} className="cursor-grab hover:cursor-grabbing">
                                  <GripVertical className="h-4 w-4 text-gray-400" />
                                </div>
                                {plot.channel}
                              </CardTitle>
                              <ChannelControls
                                plot={plot}
                                availableChannels={dataColumns}
                                onUpdatePlot={onUpdatePlot}
                                onRemovePlot={onRemovePlot}
                              />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <Plot
                              data={data}
                              timeColumn={timeColumn}
                              dataColumn={plot.channel}
                              color={plot.color}
                              onSelect={() => setSelectedPlot(plot.id)}
                              onRangeSelect={setSelectedRange}
                            />
                          </CardContent>
                        </Card>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {plots.length === 0 && (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-gray-500 mb-4">No plots created yet</p>
              <Button onClick={onAddPlot} className="bg-[#B0CDD9] hover:bg-[#9BB8C6] text-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                Create First Plot
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Statistics panel */}
      <div className="lg:col-span-1">
        <StatsPanel
          data={data}
          selectedPlot={selectedPlot ? plots.find((p) => p.id === selectedPlot) : null}
          selectedRange={selectedRange}
          timeColumn={timeColumn}
        />
      </div>
    </div>
  )
}
