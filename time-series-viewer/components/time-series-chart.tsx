"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from "recharts"
import type { TimeSeriesRow, ChannelName } from "@/lib/csv"
import { formatTime } from "@/lib/time"
import { useTimeSeriesStore } from "@/lib/store"

interface TimeSeriesChartProps {
  data: TimeSeriesRow[]
  channels: ChannelName[]
  plotId: string
  channelColors: Record<string, string>
}

export function TimeSeriesChart({ data, channels, plotId, channelColors }: TimeSeriesChartProps) {
  const { xDomain, setXDomain, setSelection } = useTimeSeriesStore()

  if (channels.length === 0) {
    return <div className="h-[400px] flex items-center justify-center text-muted-foreground">No channels selected</div>
  }

  const handleBrushChange = (brushData: any) => {
    if (brushData && brushData.startIndex !== undefined && brushData.endIndex !== undefined) {
      const start = data[brushData.startIndex]?.t
      const end = data[brushData.endIndex]?.t
      if (start !== undefined && end !== undefined) {
        setSelection({ t0: start, t1: end })
        setXDomain([start, end])
      }
    }
  }

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="t"
          type="number"
          domain={xDomain || ["dataMin", "dataMax"]}
          tickFormatter={formatTime}
          stroke="hsl(var(--foreground))"
        />
        <YAxis stroke="hsl(var(--foreground))" />
        <Tooltip
          labelFormatter={formatTime}
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
        />
        <Legend />
        {channels.map((channel) => (
          <Line
            key={channel}
            type="monotone"
            dataKey={channel}
            stroke={channelColors[channel] || "#000000"}
            strokeWidth={2}
            dot={false}
            name={channel}
          />
        ))}
        <Brush
          dataKey="t"
          height={30}
          stroke="hsl(var(--primary))"
          onChange={handleBrushChange}
          tickFormatter={formatTime}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
