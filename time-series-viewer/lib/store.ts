import { create } from "zustand"
import { type TimeSeriesRow, generateDemoData, getAvailableColumns } from "./csv"

export interface Plot {
  id: string
  title: string
  xAxis: string // Column name for X-axis
  yAxes: string[] // Column names for Y-axes (multiple lines)
  channelColors: Record<string, string>
}

interface TimeSeriesState {
  rows: TimeSeriesRow[]
  plots: Plot[]
  focusedPlotId: string | null
  xDomain: [number, number] | null
  selection: { t0: number; t1: number } | null

  // Actions
  setRows: (rows: TimeSeriesRow[]) => void
  addPlot: () => void
  removePlot: (id: string) => void
  setFocusedPlot: (id: string | null) => void
  addYAxisToPlot: (plotId: string, yAxis: string) => void
  removeYAxisFromPlot: (plotId: string, yAxis: string) => void
  updatePlotTitle: (plotId: string, title: string) => void
  updatePlotXAxis: (plotId: string, xAxis: string) => void
  updateChannelColor: (plotId: string, channel: string, color: string) => void
  reorderPlots: (startIndex: number, endIndex: number) => void
  setXDomain: (domain: [number, number] | null) => void
  setSelection: (selection: { t0: number; t1: number } | null) => void
  resetZoom: () => void
}

const DEFAULT_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#ec4899", "#06b6d4", "#84cc16"]

function getColorForChannel(index: number): string {
  return DEFAULT_COLORS[index % DEFAULT_COLORS.length]
}

export const useTimeSeriesStore = create<TimeSeriesState>((set, get) => {
  const demoData = generateDemoData()
  const availableColumns = getAvailableColumns(demoData)
  const defaultXAxis =
    availableColumns.find((col) => col.toLowerCase().includes("time") || col === "t") ||
    availableColumns[0] ||
    "time (s)"
  const defaultYAxes = availableColumns.filter((col) => col !== defaultXAxis).slice(0, 2)

  return {
    rows: demoData,
    plots: [
      {
        id: "plot-1",
        title: "General Plot",
        xAxis: defaultXAxis,
        yAxes: defaultYAxes,
        channelColors: Object.fromEntries(defaultYAxes.map((axis, i) => [axis, getColorForChannel(i)])),
      },
    ],
    focusedPlotId: "plot-1",
    xDomain: null,
    selection: null,

    setRows: (rows) => {
      const availableColumns = getAvailableColumns(rows)
      const defaultXAxis =
        availableColumns.find((col) => col.toLowerCase().includes("time") || col === "t") ||
        availableColumns[0] ||
        "time (s)"

      set((state) => ({
        rows,
        // Update all plots to use valid columns from the new data
        plots: state.plots.map((plot) => {
          // Check if current xAxis exists in new data, otherwise use default
          const validXAxis = availableColumns.includes(plot.xAxis) ? plot.xAxis : defaultXAxis

          // Filter yAxes to only include columns that exist in new data
          const validYAxes = plot.yAxes.filter((yAxis) => availableColumns.includes(yAxis))

          // Filter channelColors to only include valid yAxes
          const validChannelColors = Object.fromEntries(
            Object.entries(plot.channelColors).filter(([channel]) => validYAxes.includes(channel)),
          )

          return {
            ...plot,
            xAxis: validXAxis,
            yAxes: validYAxes,
            channelColors: validChannelColors,
          }
        }),
      }))
    },

    addPlot: () => {
      const availableColumns = getAvailableColumns(get().rows)
      const defaultXAxis =
        availableColumns.find((col) => col.toLowerCase().includes("time") || col === "t") ||
        availableColumns[0] ||
        "time (s)"

      const newPlot: Plot = {
        id: `plot-${Date.now()}`,
        title: `Plot ${get().plots.length + 1}`,
        xAxis: defaultXAxis,
        yAxes: [],
        channelColors: {},
      }
      set((state) => ({ plots: [...state.plots, newPlot] }))
    },

    removePlot: (id) => {
      set((state) => ({
        plots: state.plots.filter((p) => p.id !== id),
        focusedPlotId: state.focusedPlotId === id ? null : state.focusedPlotId,
      }))
    },

    setFocusedPlot: (id) => set({ focusedPlotId: id }),

    addYAxisToPlot: (plotId, yAxis) => {
      set((state) => ({
        plots: state.plots.map((p) => {
          if (p.id === plotId && !p.yAxes.includes(yAxis)) {
            const colorIndex = p.yAxes.length
            return {
              ...p,
              yAxes: [...p.yAxes, yAxis],
              channelColors: { ...p.channelColors, [yAxis]: getColorForChannel(colorIndex) },
            }
          }
          return p
        }),
      }))
    },

    removeYAxisFromPlot: (plotId, yAxis) => {
      set((state) => ({
        plots: state.plots.map((p) => {
          if (p.id === plotId) {
            const { [yAxis]: _, ...remainingColors } = p.channelColors
            return {
              ...p,
              yAxes: p.yAxes.filter((c) => c !== yAxis),
              channelColors: remainingColors,
            }
          }
          return p
        }),
      }))
    },

    updatePlotTitle: (plotId, title) => {
      set((state) => ({
        plots: state.plots.map((p) => (p.id === plotId ? { ...p, title } : p)),
      }))
    },

    updatePlotXAxis: (plotId, xAxis) => {
      set((state) => ({
        plots: state.plots.map((p) => (p.id === plotId ? { ...p, xAxis } : p)),
      }))
    },

    updateChannelColor: (plotId, channel, color) => {
      set((state) => ({
        plots: state.plots.map((p) =>
          p.id === plotId
            ? {
                ...p,
                channelColors: { ...p.channelColors, [channel]: color },
              }
            : p,
        ),
      }))
    },

    reorderPlots: (startIndex, endIndex) => {
      set((state) => {
        const result = Array.from(state.plots)
        const [removed] = result.splice(startIndex, 1)
        result.splice(endIndex, 0, removed)
        return { plots: result }
      })
    },

    setXDomain: (domain) => set({ xDomain: domain }),

    setSelection: (selection) => set({ selection }),

    resetZoom: () => set({ xDomain: null, selection: null }),
  }
})
