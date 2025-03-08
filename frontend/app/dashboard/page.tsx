// import { AvatarFallback } from "@/components/ui/avatar"
// import { Avatar } from "@/components/ui/avatar"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Overview } from "@/components/dashboard/overview"
// import { TeamPlayers } from "@/components/dashboard/team-players"

// export default function DashboardPage() {

//   return (
//     <div className="w-full space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
//         <p className="text-muted-foreground">Welcome back! Here's an overview of your team's performance.</p>
//       </div>

//       <div className="space-y-4">
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Total Players</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">24</div>
//           <p className="text-xs text-muted-foreground">+2 from last month</p>
//         </CardContent>
//           </Card>
//           <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">68%</div>
//           <p className="text-xs text-muted-foreground">+4% from last month</p>
//         </CardContent>
//           </Card>
//           <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Average Score</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">82.5</div>
//           <p className="text-xs text-muted-foreground">+2.1 from last month</p>
//         </CardContent>
//           </Card>
//           <Card>
//         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//           <CardTitle className="text-sm font-medium">Team Ranking</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="text-2xl font-bold">3rd</div>
//           <p className="text-xs text-muted-foreground">+2 from last month</p>
//         </CardContent>
//           </Card>
//         </div>
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
//           <Card className="col-span-4">
//         <CardHeader>
//           <CardTitle>Performance Overview</CardTitle>
//           <CardDescription>Team performance over the last 12 months</CardDescription>
//         </CardHeader>
//         <CardContent className="pl-2">
//           <Overview />
//         </CardContent>
//           </Card>
//           <Card className="col-span-3">
//         <CardHeader>
//           <CardTitle>Top Performers</CardTitle>
//           <CardDescription>Players with the highest stats this month</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {[
//           { name: "Alex Johnson", position: "Forward", score: 92 },
//           { name: "Maria Garcia", position: "Midfielder", score: 88 },
//           { name: "James Wilson", position: "Defender", score: 85 },
//           { name: "Sarah Lee", position: "Forward", score: 84 },
//           { name: "David Kim", position: "Goalkeeper", score: 82 },
//             ].map((player) => (
//           <div key={player.name} className="flex items-center">
//             <Avatar className="h-9 w-9 mr-3">
//               <AvatarFallback>
//             {player.name
//               .split(" ")
//               .map((n) => n[0])
//               .join("")}
//               </AvatarFallback>
//             </Avatar>
//             <div className="space-y-1 flex-1">
//               <p className="text-sm font-medium leading-none">{player.name}</p>
//               <p className="text-xs text-muted-foreground">{player.position}</p>
//             </div>
//             <div className="font-medium">{player.score}</div>
//           </div>
//             ))}
//           </div>
//         </CardContent>
//           </Card>
//         </div>
//       </div>

//     </div>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Trophy, AlertCircle, Medal, User } from "lucide-react"
import type { MyTeam } from "@/types/teamTypes"
import { getMyTeam } from "@/services/teamService"
import { TopScorers } from "@/types/playerTypes"
import { getTopScorers } from "@/services/playerService"

export default function LeaderboardDashboard() {
  const [topScorers, setTopScorers] = useState<TopScorers | null>(null)
  const [myTeam, setMyTeam] = useState<MyTeam | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const [scorersData, teamData] = await Promise.all([getTopScorers(), getMyTeam()])
        setTopScorers(scorersData)
        setMyTeam(teamData)
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

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        {myTeam && myTeam.is_found && (
          <p className="text-muted-foreground">
            Your team: <span className="font-medium">{myTeam.team_name}</span>
          </p>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Overall Stats Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Overall Tournament Stats
            </CardTitle>
            <CardDescription>Current tournament statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3 text-center">
                <p className="text-sm font-medium text-muted-foreground">Total Runs</p>
                <p className="text-2xl font-bold">{topScorers.overall_runs}</p>
              </div>
              <div className="rounded-lg border p-3 text-center">
                <p className="text-sm font-medium text-muted-foreground">Total Wickets</p>
                <p className="text-2xl font-bold">{topScorers.overall_wickets}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team Card - If you want to show more team info */}
        {myTeam && myTeam.is_found && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                My Team
              </CardTitle>
              <CardDescription>Your team performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-full py-6">
                <h3 className="text-2xl font-bold">{myTeam.team_name}</h3>
                <p className="text-muted-foreground mt-2">
                  {myTeam.players ? `${myTeam.players.length} players` : "No players added yet"}
                </p>
                {/* You can add more team stats here if available */}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Leaderboard Tabs */}
      <Tabs defaultValue="batsmen" className="pb-3">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="batsmen">Top Batsmen</TabsTrigger>
          <TabsTrigger value="bowlers">Top Bowlers</TabsTrigger>
        </TabsList>

        <TabsContent value="batsmen" className="mt-4">
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
        </TabsContent>

        <TabsContent value="bowlers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Highest Wicket Takers</CardTitle>
              <CardDescription>Players with the most wickets in the tournament</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topScorers.highest_wicket_takers.map((bowler, index) => (
                  <div key={bowler.id}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full bg-muted ${getMedalColor(0)}`}
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
        </TabsContent>
      </Tabs>
      
    </div>
  )
}