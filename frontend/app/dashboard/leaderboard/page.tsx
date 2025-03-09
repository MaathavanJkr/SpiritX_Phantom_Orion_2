"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Trophy,
  AlertCircle,
  Medal,
  Award,
  TrendingUp,
  Users,
  BarChart3,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { getLeaderBoard } from "@/services/leaderboardService"
import { getMyTeam } from "@/services/teamService"
import type { MyTeam } from "@/types/teamTypes"
import Link from "next/link"
import { CartesianGrid, ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, Cell, PieChart, Pie } from "recharts"
import { Leaderboard } from "@/types/leaderboardType"


export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([])
  const [myTeam, setMyTeam] = useState<MyTeam | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUserPoints, setCurrentUserPoints] = useState<number | null>(null)
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null)
  const [currentUserTeam, setCurrentUserTeam] = useState<Leaderboard | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [leaderboardData, teamData] = await Promise.all([getLeaderBoard(), getMyTeam()])

        setLeaderboard(leaderboardData)
        setMyTeam(teamData)

        // Get current user ID from localStorage
        const userId = localStorage.getItem("user_id")
        if (userId) {
          const userIdNum = Number.parseInt(userId)

          // Find current user's team in leaderboard
          const userTeam = leaderboardData.find((team: { user_id: number }) => team.user_id === userIdNum)
          if (userTeam) {
            setCurrentUserPoints(userTeam.points)
            setCurrentUserTeam(userTeam)

            // Calculate user's rank
            const rank =
              leaderboardData.sort((a: { points: number }, b: { points: number }) => b.points - a.points).findIndex((team: { user_id: number }) => team.user_id === userIdNum) + 1
            setCurrentUserRank(rank)
          }
        }

        setIsLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data")
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0:
        return "text-yellow-500"
      case 1:
        return "text-gray-400"
      case 2:
        return "text-amber-700"
      default:
        return "text-muted-foreground"
    }
  }

  // Sort leaderboard by points
  const sortedLeaderboard = [...leaderboard].sort((a, b) => b.points - a.points)

  // Get top 5 teams for the chart
  const top3Teams = sortedLeaderboard.slice(0, 3)

  // Chart colors
  const chartColors = ["#FFD700", "#C0C0C0", "#CD7F32", "#4CAF50", "#2196F3"]
  const pieChartColors = ["#4394E5", "#F8AE54", "#CB6A6E9", "#E0E0E0", "#876FD4"]

  const categoryDistribution =
    currentUserTeam?.players.reduce(
      (acc, player) => {
        const category = player.category || "Unknown"
        acc[category] = (acc[category] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    ) || {}

  // Format for pie chart
  const categoryPieData = Object.entries(categoryDistribution).map(([name, value]) => ({
    name,
    value,
  }))

  // Calculate points difference from the team above
  const getPointsDifference = (rank: number) => {
    if (rank <= 1 || !currentUserRank) return null
    const teamAbove = sortedLeaderboard[currentUserRank - 2] // -1 for 0-index, -1 for team above
    const currentTeam = sortedLeaderboard[currentUserRank - 1] // -1 for 0-index

    if (!teamAbove || !currentTeam) return null
    return teamAbove.points - currentTeam.points
  }

  const pointsDifference = getPointsDifference(currentUserRank || 0)

  // Calculate average points
  const averagePoints =
    leaderboard.length > 0 ? leaderboard.reduce((sum, team) => sum + team.points, 0) / leaderboard.length : 0

  // Calculate if user is above or below average
  const pointsVsAverage = currentUserPoints !== null ? currentUserPoints - averagePoints : null

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">Team Leaderboard</h1>
        <p className="text-muted-foreground mt-2">Compare your team's performance with others</p>
      </div>



      {/* Top Teams Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Top Teams Ranking
          </CardTitle>
          <CardDescription>Teams with the highest points in the tournament</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={top3Teams.map((team) => ({
                  name: team.name,
                  points: team.points,
                  owner: team.user.username,
                }))}
                margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
              >
                {/* <CartesianGrid strokeDasharray="3 3" /> */}
                <XAxis dataKey="name" height={60} tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip
                    cursor={{ fill: "rgba(0, 0, 0, 0.0)" }}

                  formatter={(value) => [`${value} points`, "Points"]}
                  labelFormatter={(name) => `Team: ${name}`}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-md shadow-md p-3">
                          <p className="font-medium">{label}</p>
                          <p className="text-sm text-muted-foreground">Owner: {payload[0].payload.owner}</p>
                          <p className="text-primary font-semibold">{payload[0].value} points</p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="points" fill="#8884d8" radius={[4, 4, 0, 0]}>
                  {top3Teams.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Full Leaderboard Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Complete Leaderboard
          </CardTitle>
          <CardDescription>All teams ranked by points</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-12 font-medium text-sm py-2 border-b">
              <div className="col-span-1">Rank</div>
              <div className="col-span-4">Team</div>
              <div className="col-span-3">Owner</div>
              <div className="col-span-2">Players</div>
              <div className="col-span-2 text-right">Points</div>
            </div>

            {sortedLeaderboard.map((team, index) => {
              const isCurrentUser = team.user_id === (currentUserTeam?.user_id || 0)
              return (
                <div
                  key={team.id}
                  className={`grid grid-cols-12 py-3 ${index % 2 === 0 ? "bg-muted/50" : ""} ${isCurrentUser ? "bg-primary/10 border border-primary/20 rounded-md" : ""}`}
                >
                  <div className="col-span-1 flex items-center">
                    {index < 3 ? (
                      <div
                        className={`flex items-center justify-center w-7 h-7 rounded-full bg-muted ${getMedalColor(index)}`}
                      >
                        <Medal className="h-4 w-4" />
                      </div>
                    ) : (
                      <span className="font-medium ml-2">{index + 1}</span>
                    )}
                  </div>
                  <div className="col-span-4 font-medium flex items-center gap-2">
                    {isCurrentUser && <Award className="h-4 w-4 text-primary" />}
                    {team.name}
                  </div>
                  <div className="col-span-3 text-muted-foreground flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">{team.user.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {team.user.username}
                  </div>
                  <div className="col-span-2 text-muted-foreground">{team.players.length}</div>
                  <div className="col-span-2 text-right">
                    <Badge className={`${index < 3 ? "bg-primary text-white" : "bg-muted text-black"} font-medium`}>{team.points} pts</Badge>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>

      </Card>
    </div>
  )
}

function getOrdinalSuffix(num: number): string {
  const j = num % 10
  const k = num % 100

  if (j === 1 && k !== 11) {
    return "st"
  }
  if (j === 2 && k !== 12) {
    return "nd"
  }
  if (j === 3 && k !== 13) {
    return "rd"
  }
  return "th"
}

