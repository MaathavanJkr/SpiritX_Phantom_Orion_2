"use client"
import { Tooltip } from "recharts"

import {  
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendItem,
} from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jan", wins: 12, losses: 4 },
  { month: "Feb", wins: 14, losses: 2 },
  { month: "Mar", wins: 10, losses: 6 },
  { month: "Apr", wins: 15, losses: 1 },
  { month: "May", wins: 13, losses: 3 },
  { month: "Jun", wins: 11, losses: 5 },
  { month: "Jul", wins: 16, losses: 0 },
  { month: "Aug", wins: 14, losses: 2 },
  { month: "Sep", wins: 12, losses: 4 },
  { month: "Oct", wins: 15, losses: 1 },
  { month: "Nov", wins: 13, losses: 3 },
  { month: "Dec", wins: 14, losses: 2 },
]

export function Overview() {
  return (
    <Chart className="h-[300px]">
      <ChartLegend className="justify-center mb-4">
        <ChartLegendItem name="Wins" color="hsl(var(--primary))" />
        <ChartLegendItem name="Losses" color="hsl(var(--muted))" />
      </ChartLegend>
      <ChartContainer>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={10} className="text-xs" />
            <YAxis tickLine={false} axisLine={false} tickMargin={10} className="text-xs" />
            <Tooltip content={<ChartTooltipContent />} />                        
            <Area
              type="monotone"
              dataKey="wins"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="hsl(var(--primary))"
              fillOpacity={0.2}
              activeDot={{ r: 6 }}
            />
            <Area
              type="monotone"
              dataKey="losses"
              stroke="hsl(var(--muted))"
              strokeWidth={2}
              fill="hsl(var(--muted))"
              fillOpacity={0.2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    </Chart>
  )
}

