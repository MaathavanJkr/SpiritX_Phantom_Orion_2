"use client"

import type React from "react"

import type { Player } from "@/types/playerTypes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PlayerCardProps {
  player: Player | null
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  if (!player) {
    return <div>No player data available.</div>
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{player.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>University: {player.university}</p>
        <p>Category: {player.category}</p>
        <p>Total Runs: {player.total_runs}</p>
        <p>Innings Played: {player.innings_played}</p>
        <p>Wickets: {player.wickets}</p>
        <p>Overs Bowled: {player.overs_bowled}</p>
        <p>Value: {player.value}</p>
      </CardContent>
    </Card>
  )
}

export default PlayerCard

