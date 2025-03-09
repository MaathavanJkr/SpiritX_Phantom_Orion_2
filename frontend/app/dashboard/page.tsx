
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Trophy, AlertCircle, Medal, User, Award, Crown} from "lucide-react"
import type { MyTeam } from "@/types/teamTypes"
import { getMyTeam } from "@/services/teamService"
import { Leaderboard, TopScorers } from "@/types/leaderboardType"
import { getTopScorers } from "@/services/playerService"
import { getLeaderBoard } from "@/services/leaderboardService"
import { CartesianGrid, ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, Cell, PieChart, Pie } from "recharts"
import {
  TrendingUp,
  Users,
  BarChart3,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { getChatMessages } from "@/services/chatService"

export default function LeaderboardDashboard() {
  const [topScorers, setTopScorers] = useState<TopScorers | null>(null)
  const [myTeam, setMyTeam] = useState<MyTeam | null>(null)
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUserPoints, setCurrentUserPoints] = useState<number | null>(null)
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null)
  const [currentUserTeam, setCurrentUserTeam] = useState<MyTeam | null>(null)
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        const [scorersData, teamData, leaderboardData] = await Promise.all([
          getTopScorers(),
          getMyTeam(),
          getLeaderBoard(),
        ])

        setTopScorers(scorersData)
        setMyTeam(teamData)
        setLeaderboard(leaderboardData)

        // Get current user ID from localStorage
        const userId = localStorage.getItem("user_id")
        if (userId) {
          const userIdNum = Number.parseInt(userId)

          // Find current user's team in leaderboard
          const userTeam = await getMyTeam()
          if (userTeam.players) {
            setCurrentUserPoints(userTeam.points)
            setCurrentUserTeam(userTeam)
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

  if (!topScorers) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>No leaderboard data is available at this time.</AlertDescription>
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
  // Sort leaderboard by points and get top 3
  const top3Teams = [...leaderboard].sort((a, b) => b.points - a.points).slice(0, 3)

  // Chart colors
  const pieChartColors = ["#4394E5", "#F8AE54", "#CB6A6E9", "#E0E0E0", "#876FD4"]

  const categoryDistribution =
    currentUserTeam?.players?.reduce(
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
    <div className="w-full space-y-6">
      {/* User's Team Stats */}
      {currentUserTeam && currentUserPoints !== null && currentUserRank !== null && (
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                Your Team Performance
              </CardTitle>
              <CardDescription>{myTeam?.team_name || currentUserTeam.team_name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="flex flex-col items-center">
                  <div className="text-5xl font-bold text-primary">{currentUserPoints}</div>
                  <div className="text-sm text-muted-foreground mt-1">Total Points</div>
                    {currentUserTeam?.players?.length === 11 && (
                    <div className="mt-4 flex items-center gap-1">
                      <Medal className={`h-5 w-5 ${getMedalColor(currentUserRank - 1)}`} />
                      <span className="text-xl font-semibold">
                      Rank: {currentUserRank}
                      {getOrdinalSuffix(currentUserRank)}
                      </span>
                    </div>
                    )}
                </div>

                <Separator orientation="vertical" className="h-24 hidden md:block" />

                <div className="space-y-4 flex-1">
                  {pointsDifference !== null && (
                    <div className="flex items-center gap-2">
                      <ArrowUp className="h-5 w-5 text-primary" />
                      <div>
                        <div className="text-sm text-muted-foreground">Points needed for next rank</div>
                        <div className="font-medium">{pointsDifference + 1} points</div>
                      </div>
                    </div>
                  )}

                  {pointsVsAverage !== null && (
                    <div className="flex items-center gap-2">
                      {pointsVsAverage >= 0 ? (
                        <TrendingUp className="h-5 w-5 text-green-500" />
                      ) : (
                        <ArrowDown className="h-5 w-5 text-red-500" />
                      )}
                      <div>
                        <div className="text-sm text-muted-foreground">Compared to average</div>
                        <div className={`font-medium ${pointsVsAverage >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {pointsVsAverage >= 0 ? "+" : ""}
                          {pointsVsAverage.toFixed(1)} points
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="text-sm font-medium mb-2">Team Composition</div>
                  {Object.entries(categoryDistribution).map(([category, count]) => (
                    <div key={category} className="flex items-center justify-between mb-1">
                      <span className="text-sm">{category}s:</span>
                      <Badge variant="outline">{count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                Team Composition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                {categoryPieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryPieData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={pieChartColors[index % pieChartColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} players`, "Count"]} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">No player data available</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">

      {/* Top 3 Teams Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-500" />
            Top Teams
          </CardTitle>
          <CardDescription>Teams with the highest points</CardDescription>
        </CardHeader>
        <CardContent>
          {top3Teams.length > 0 ? (
            <div>
              <div className="mt-6 space-y-4">
                {top3Teams.map((team, index) => (
                  <div key={team.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full bg-muted ${getMedalColor(index)}`}
                      >
                        <Medal className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{team.name}</p>
                        <p className="text-sm text-muted-foreground">{team.user.username}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-base px-3 py-1">
                      {team.points} points
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No leaderboard data available</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Highest Run Scorers</CardTitle>
            <CardDescription>Players with the most runs in the tournament</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topScorers.highest_run_scorers.map((batsman, index) => (
                <div key={batsman.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full bg-muted ${getMedalColor(index)}`}
                      >
                        {index <= 2 ? <Medal className="h-5 w-5" /> : <span className="font-bold">{index + 1}</span>}
                      </div>
                      <div>
                        <p className="font-medium">{batsman.name}</p>
                        <Badge variant="outline" className="mt-1">
                          {batsman.runs} runs
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {index < topScorers.highest_run_scorers.length - 1 && <Separator className="my-3" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Highest Wicket Takers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topScorers.highest_wicket_takers.map((bowler, index) => (
                <div key={bowler.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full bg-muted ${getMedalColor(index)}`}
                      >
                        {index <= 2 ? <Medal className="h-5 w-5" /> : <span className="font-bold">{index + 1}</span>}
                      </div>
                      <div>
                        <p className="font-medium">{bowler.name}</p>
                        <Badge variant="outline" className="mt-1">
                          {bowler.wickets} wickets
                        </Badge>
                      </div>
                    </div>
                  </div>
                  {index < topScorers.highest_wicket_takers.length - 1 && <Separator className="my-3" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      </div>

    </div>
  )
}

// Helper function to get ordinal suffix for numbers (1st, 2nd, 3rd, etc.)
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

