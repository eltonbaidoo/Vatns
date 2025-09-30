import { create } from "zustand"
import { type TimeSeriesRow, type ChannelName, generateDemoData } from "./csv"

export interface Plot {
  id: string
  title: string
  channels: ChannelName[]
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
  addChannelToPlot: (plotId: string, channel: ChannelName) => void
  removeChannelFromPlot: (plotId: string, channel: ChannelName) => void
  updatePlotTitle: (plotId: string, title: string) => void
  updateChannelColor: (plotId: string, channel: ChannelName, color: string) => void
  reorderPlots: (startIndex: number, endIndex: number) => void
  setXDomain: (domain: [number, number] | null) => void
  setSelection: (selection: { t0: number; t1: number } | null) => void
  resetZoom: () => void
}

const DEFAULT_COLORS: Record<ChannelName, string> = {
  roll_deg: "#3b82f6",
  pitch_deg: "#10b981",
  yaw_deg: "#f59e0b",
  depth: "#8b5cf6",
  vel_x_m_s: "#ef4444",
  vel_y_m_s: "#ec4899",
  northing_m: "#06b6d4",
  easting_m: "#84cc16",
}

export const useTimeSeriesStore = create<TimeSeriesState>((set, get) => ({
  rows: generateDemoData(),
  plots: [
    {
      id: "plot-1",
      title: "General Plot",
      channels: ["roll_deg", "pitch_deg"],
      channelColors: {
        roll_deg: DEFAULT_COLORS.roll_deg,
        pitch_deg: DEFAULT_COLORS.pitch_deg,
      },
    },
  ],
  focusedPlotId: "plot-1",
  xDomain: null,
  selection: null,

  setRows: (rows) => set({ rows }),

  addPlot: () => {
    const newPlot: Plot = {
      id: `plot-${Date.now()}`,
      title: `Plot ${get().plots.length + 1}`,
      channels: [],
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

  addChannelToPlot: (plotId, channel) => {
    set((state) => ({
      plots: state.plots.map((p) =>
        p.id === plotId && !p.channels.includes(channel)
          ? {
              ...p,
              channels: [...p.channels, channel],
              channelColors: { ...p.channelColors, [channel]: DEFAULT_COLORS[channel] },
            }
          : p,
      ),
    }))
  },

  removeChannelFromPlot: (plotId, channel) => {
    set((state) => ({
      plots: state.plots.map((p) => {
        if (p.id === plotId) {
          const { [channel]: _, ...remainingColors } = p.channelColors
          return {
            ...p,
            channels: p.channels.filter((c) => c !== channel),
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
}))
