"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Brush } from "recharts"
import type { TimeSeriesRow } from "@/lib/csv"
import { useTimeSeriesStore } from "@/lib/store"

interface TimeSeriesChartProps {
  data: TimeSeriesRow[]
  xAxis: string
  yAxes: string[]
  plotId: string
  channelColors: Record<string, string>
}

export function TimeSeriesChart({ data, xAxis, yAxes, plotId, channelColors }: TimeSeriesChartProps) {
  const { setSelection } = useTimeSeriesStore()

  if (yAxes.length === 0) {
    return <div className="h-[400px] flex items-center justify-center text-muted-foreground">No Y-axes selected</div>
  }

  const handleBrushChange = (brushData: any) => {
    if (brushData && brushData.startIndex !== undefined && brushData.endIndex !== undefined) {
      const start = data[brushData.startIndex]?.[xAxis]
      const end = data[brushData.endIndex]?.[xAxis]
      if (start !== undefined && end !== undefined) {
        setSelection({ t0: start, t1: end })
      }
    }
  }

  const xAxisFormatter = (value: number) => {
    // Format large numbers with appropriate precision
    if (Math.abs(value) >= 1000) {
      return value.toFixed(0)
    } else if (Math.abs(value) >= 1) {
      return value.toFixed(2)
    } else {
      return value.toFixed(4)
    }
  }

  return (
    <ResponsiveContainer width="100%" height={500}>
      <LineChart data={data} margin={{ top: 20, right: 40, left: 20, bottom: 100 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey={xAxis}
          type="number"
          domain={["dataMin", "dataMax"]}
          tickFormatter={xAxisFormatter}
          stroke="hsl(var(--foreground))"
          label={{ value: xAxis, position: "insideBottom", offset: -10 }}
          height={60}
        />
        <YAxis stroke="hsl(var(--foreground))" width={60} />
        <Tooltip
          labelFormatter={xAxisFormatter}
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
        />
        <Legend
          verticalAlign="bottom"
          wrapperStyle={{
            paddingTop: "30px",
            paddingBottom: "10px",
          }}
        />
        {yAxes.map((yAxis) => (
          <Line
            key={yAxis}
            type="monotone"
            dataKey={yAxis}
            stroke={channelColors[yAxis] || "#000000"}
            strokeWidth={2}
            dot={false}
            name={yAxis}
          />
        ))}
        <Brush
          dataKey={xAxis}
          height={40}
          stroke="hsl(var(--primary))"
          onChange={handleBrushChange}
          tickFormatter={xAxisFormatter}
          y={440}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
