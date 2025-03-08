"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Chart, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Search } from "lucide-react"
import { Tooltip } from "recharts"

// Sample player data
const players = [
  {
    id: 1,
    name: "Alex Johnson",
    position: "Forward",
    avatar: "/placeholder.svg?height=40&width=40",
    stats: {
      goals: 24,
      assists: 12,
      passes: 85,
      tackles: 45,
      speed: 92,
    },
  },
  {
    id: 2,
    name: "Maria Garcia",
    position: "Midfielder",
    avatar: "/placeholder.svg?height=40&width=40",
    stats: {
      goals: 14,
      assists: 22,
      passes: 92,
      tackles: 65,
      speed: 88,
    },
  },
  {
    id: 3,
    name: "James Wilson",
    position: "Defender",
    avatar: "/placeholder.svg?height=40&width=40",
    stats: {
      goals: 5,
      assists: 8,
      passes: 78,
      tackles: 90,
      speed: 85,
    },
  },
  {
    id: 4,
    name: "Sarah Lee",
    position: "Forward",
    avatar: "/placeholder.svg?height=40&width=40",
    stats: {
      goals: 22,
      assists: 10,
      passes: 75,
      tackles: 40,
      speed: 94,
    },
  },
  {
    id: 5,
    name: "David Kim",
    position: "Goalkeeper",
    avatar: "/placeholder.svg?height=40&width=40",
    stats: {
      goals: 0,
      assists: 2,
      passes: 65,
      tackles: 15,
      speed: 75,
    },
  },
]

export function TeamPlayers() {
  const [selectedPlayer, setSelectedPlayer] = useState(players[0])
  const [searchQuery, setSearchQuery] = useState("")

  // Convert player stats to chart data
  const playerStatsData = Object.entries(selectedPlayer.stats).map(([key, value]) => ({
    stat: key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }))

  // Filter players based on search query
  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.position.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search players..."
          className="w-full pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="w-full grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Team Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredPlayers.map((player) => (
                <div
                  key={player.id}
                  className={`flex items-center p-2 rounded-md cursor-pointer ${
                    selectedPlayer.id === player.id ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedPlayer(player)}
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <AvatarImage src={player.avatar} alt={player.name} />
                    <AvatarFallback>
                      {player.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1 flex-1">
                    <p className="text-sm font-medium leading-none">{player.name}</p>
                    <p className="text-xs text-muted-foreground">{player.position}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Player Statistics: {selectedPlayer.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <Chart className="h-[300px]">
                  <ChartContainer>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={playerStatsData}
                        margin={{
                          top: 5,
                          right: 10,
                          left: 10,
                          bottom: 20,
                        }}
                      >
                        <XAxis dataKey="stat" tickLine={false} axisLine={false} tickMargin={10} className="text-xs" />
                        <YAxis tickLine={false} axisLine={false} tickMargin={10} className="text-xs" />
                        {/* <ChartTooltip content={<ChartTooltipContent />} /> */}
                        <Tooltip content={<ChartTooltipContent />} />                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </Chart>
              </div>
              <div className="w-full md:w-64 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Goals</span>
                    <span className="font-medium">{selectedPlayer.stats.goals}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${selectedPlayer.stats.goals}%` }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Assists</span>
                    <span className="font-medium">{selectedPlayer.stats.assists}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${selectedPlayer.stats.assists}%` }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Passes</span>
                    <span className="font-medium">{selectedPlayer.stats.passes}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${selectedPlayer.stats.passes}%` }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Tackles</span>
                    <span className="font-medium">{selectedPlayer.stats.tackles}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${selectedPlayer.stats.tackles}%` }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Speed</span>
                    <span className="font-medium">{selectedPlayer.stats.speed}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${selectedPlayer.stats.speed}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

