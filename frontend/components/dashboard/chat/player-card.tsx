import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Player } from "@/types/playerTypes"


export default function PlayerCard({ player }: { player: Player }) {
  if (!player) return null

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16 border-2 border-white">
            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl font-bold">{player.name}</CardTitle>
            <p className="text-sm opacity-90">{player.university}</p>
            <Badge variant="secondary" className="mt-1">
              {player.category}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-4">
            <StatItem label="Batting" value={player.total_runs} />
            <StatItem label="Innigs" value={player.innings_played} />
            <StatItem label="Wickets" value={player.wickets} />
            <StatItem label="Overs" value={player.overs_bowled} />
        </div>
      </CardContent>
    </Card>
  )
}

function StatItem({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center mt-1">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-primary h-2.5 rounded-full" style={{ width: `${value}%` }}></div>
        </div>
        <span className="ml-2 text-sm font-medium">{value}</span>
      </div>
    </div>
  )
}

