// "use client"

// import type React from "react"

// import type { Player } from "@/types/playerTypes"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";

// interface PlayerCardProps {
//   player: Player | null
// }

// const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
//   if (!player) {
//     return <div>No player data available.</div>
//   }

//   // Get initials for avatar
//   const initials = player.name
//     .split(" ")
//     .map(n => n[0])
//     .join("")
//     .toUpperCase();


//   return (
//         <Card 
//       className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
//     >
//     <CardHeader className="p-4 pb-2 flex flex-row items-center gap-3">
//       <Avatar className="h-12 w-12">
//         <AvatarFallback>{initials}</AvatarFallback>
//       </Avatar>
//       <div>
//         <CardTitle className="text-lg">{player.name}</CardTitle>
//         <p className="text-sm text-muted-foreground">{player.university}</p>
//       </div>
//     </CardHeader>
//     <CardContent className="p-4 pt-2">
//     <div className="flex justify-between items-center mb-3">
//       <Badge>{player.category}</Badge>
//     <p className="text-sm">Price: <span className="font-bold text-black">Rs. {player.value}</span></p>
//     </div>
//       </CardContent>
//     </Card>
//   )
// }

// export default PlayerCard

// "use client"

// import type React from "react"
// import { useState } from "react"
// import type { Player } from "@/types/playerTypes"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
// import { getPlayerDetails } from "@/services/playerService"
// import { Loader2 } from "lucide-react"

// interface PlayerCardProps {
//   player: Player | null
// }

// const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
//   const [isDialogOpen, setIsDialogOpen] = useState(false)
//   const [playerDetails, setPlayerDetails] = useState<Player | null>(null)
//   const [isLoading, setIsLoading] = useState(false)

//   if (!player) {
//     return <div>No player data available.</div>
//   }

//   // Get initials for avatar
//   const initials = player.name
//     ? player.name
//         .split(" ")
//         .map((n) => n[0])
//         .join("")
//         .toUpperCase()
//     : "?"

//   const handleCardClick = async () => {
//     setIsDialogOpen(true)

//     if (player.id) {
//       setIsLoading(true)
//       try {
//         const details = await getPlayerDetails(player.id)
//         setPlayerDetails(details)
//       } catch (error) {
//         console.error("Failed to fetch player details:", error)
//       } finally {
//         setIsLoading(false)
//       }
//     } else {
//       // If no ID is available, just use the current player data
//       setPlayerDetails(player)
//       setIsLoading(false)
//     }
//   }

//   return (
//     <>
//       <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
//         <CardHeader className="p-4 pb-2 flex flex-row items-center gap-3">
//           <Avatar className="h-12 w-12">
//             <AvatarFallback>{initials}</AvatarFallback>
//           </Avatar>
//           <div>
//             <CardTitle className="text-lg">{player.name}</CardTitle>
//             <p className="text-sm text-muted-foreground">{player.university}</p>
//           </div>
//         </CardHeader>
//         <CardContent className="p-4 pt-2">
//           <div className="flex justify-between items-center mb-3">
//             <Badge>{player.category}</Badge>
//             <p className="text-sm">
//               Price: <span className="font-bold text-black">Rs. {player.value}</span>
//             </p>
//           </div>
//         </CardContent>
//       </Card>

//       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//         <DialogContent className="sm:max-w-md">
//           <DialogHeader>
//             <DialogTitle>Player Statistics</DialogTitle>
//             <DialogDescription>Detailed statistics for {player.name}</DialogDescription>
//           </DialogHeader>

//           {isLoading ? (
//             <div className="flex justify-center items-center py-8">
//               <Loader2 className="h-8 w-8 animate-spin text-primary" />
//             </div>
//           ) : playerDetails ? (
//             <div className="space-y-4">
//               <div className="flex items-center gap-4">
//                 <Avatar className="h-16 w-16">
//                   <AvatarFallback>{initials}</AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <h3 className="text-lg font-bold">{playerDetails.name}</h3>
//                   <p className="text-sm text-muted-foreground">{playerDetails.university}</p>
//                   <Badge className="mt-1">{playerDetails.category}</Badge>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4 pt-4">
//                 <StatItem label="Total Runs" value={playerDetails.total_runs} />
//                 <StatItem label="Balls Faced" value={playerDetails.balls_faced} />
//                 <StatItem label="Innings Played" value={playerDetails.innings_played} />
//                 <StatItem label="Wickets" value={playerDetails.wickets} />
//                 <StatItem label="Overs Bowled" value={playerDetails.overs_bowled} />
//                 <StatItem label="Runs Conceded" value={playerDetails.runs_conceded} />
//               </div>

//               <div className="pt-4 border-t">
//                 <p className="text-sm font-medium">
//                   Player Value: <span className="font-bold">Rs. {playerDetails.value}</span>
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <div className="py-4 text-center text-muted-foreground">No detailed statistics available</div>
//           )}
//         </DialogContent>
//       </Dialog>
//     </>
//   )
// }

// function StatItem({ label, value }: { label: string; value: number | undefined | null }) {
//   const displayValue = value !== undefined && value !== null ? value : 0

//   return (
//     <div className="space-y-1">
//       <p className="text-sm text-muted-foreground">{label}</p>
//       <div className="flex items-center gap-2">
//         <div className="w-full bg-gray-200 rounded-full h-2">
//           <div className="bg-primary h-2 rounded-full" style={{ width: `${Math.min(displayValue * 5, 100)}%` }} />
//         </div>
//         <span className="text-sm font-medium">{displayValue}</span>
//       </div>
//     </div>
//   )
// }

// export default PlayerCard

"use client"

import type React from "react"
import { useState } from "react"
import type { Player } from "@/types/playerTypes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { getPlayerDetails } from "@/services/playerService"
import { Loader2 } from "lucide-react"

interface PlayerCardProps {
  player: Player | null
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [playerDetails, setPlayerDetails] = useState<Player | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  if (!player) {
    return <div>No player data available.</div>
  }

  // Get initials for avatar
  const initials = player.name
    ? player.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "?"

  const handleCardClick = async () => {
    setIsDialogOpen(true)

    if (player.id) {
      setIsLoading(true)
      try {
        const details = await getPlayerDetails(player.id)
        setPlayerDetails(details)
      } catch (error) {
        console.error("Failed to fetch player details:", error)
      } finally {
        setIsLoading(false)
      }
    } else {
      // If no ID is available, just use the current player data
      setPlayerDetails(player)
      setIsLoading(false)
    }
  }

  // Calculate stats
  const calculateStats = (player: Player) => {
    // Batting average = total runs / innings played
    const battingAverage = player.innings_played > 0 ? (player.total_runs / player.innings_played).toFixed(2) : "0.00"

    // Economy rate = runs conceded / overs bowled
    const economyRate =
      player.overs_bowled > 0 && player.runs_conceded !== undefined
        ? (player.runs_conceded / player.overs_bowled).toFixed(2)
        : "0.00"

    // Strike rate = (total runs / balls faced) * 100
    const strikeRate =
      player.balls_faced && player.balls_faced > 0
        ? ((player.total_runs / player.balls_faced) * 100).toFixed(2)
        : "0.00"

    return { battingAverage, economyRate, strikeRate }
  }

  return (
    <>
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer" onClick={handleCardClick}>
        <CardHeader className="p-4 pb-2 flex flex-row items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">{player.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{player.university}</p>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="flex justify-between items-center mb-3">
            <Badge>{player.category}</Badge>
            <p className="text-sm">
              Price: <span className="font-bold text-black">Rs. {player.value}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Player Statistics</DialogTitle>
            <DialogDescription>Detailed statistics for {player.name}</DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : playerDetails ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">{playerDetails.name}</h3>
                  <p className="text-sm text-muted-foreground">{playerDetails.university}</p>
                  <Badge className="mt-1">{playerDetails.category}</Badge>
                </div>
              </div>

              {/* General Stats Section */}
              <div>
                <h4 className="text-sm font-semibold mb-2">General Stats</h4>
                <div className="grid grid-cols-3 gap-4 bg-muted p-3 rounded-md">
                  {(() => {
                    const { battingAverage, economyRate, strikeRate } = calculateStats(playerDetails)
                    return (
                      <>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Batting Avg</p>
                          <p className="text-lg font-bold">{battingAverage}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Economy</p>
                          <p className="text-lg font-bold">{economyRate}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">Strike Rate</p>
                          <p className="text-lg font-bold">{strikeRate}</p>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>

              {/* Detailed Stats Section */}
              <div>
                <h4 className="text-sm font-semibold mb-2">Detailed Stats</h4>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Runs:</span>
                    <span className="text-sm font-medium">{playerDetails.total_runs || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Balls Faced:</span>
                    <span className="text-sm font-medium">{playerDetails.balls_faced || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Innings Played:</span>
                    <span className="text-sm font-medium">{playerDetails.innings_played || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Wickets:</span>
                    <span className="text-sm font-medium">{playerDetails.wickets || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Overs Bowled:</span>
                    <span className="text-sm font-medium">{playerDetails.overs_bowled || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Runs Conceded:</span>
                    <span className="text-sm font-medium">{playerDetails.runs_conceded || 0}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-sm font-medium flex justify-between">
                  <span>Player Value:</span>
                  <span className="font-bold">Rs. {playerDetails.value}</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-muted-foreground">No detailed statistics available</div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PlayerCard

