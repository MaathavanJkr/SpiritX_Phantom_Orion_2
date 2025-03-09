import { Player } from "@/types/playerTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface PlayerCardProps {
  player: Player;
  onClick: () => void;
}

export function PlayerCard({ player, onClick }: PlayerCardProps) {
  // Calculate batting average
  const battingAverage = player.innings_played > 0 
    ? (player.total_runs / player.innings_played).toFixed(2) 
    : "N/A";
  
  // Calculate strike rate
  const strikeRate = player.balls_faced > 0 
    ? ((player.total_runs / player.balls_faced) * 100).toFixed(2) 
    : "N/A";
  
  // Calculate bowling average
  const bowlingAverage = player.wickets > 0 
    ? (player.runs_conceded / player.wickets).toFixed(2) 
    : 0;

  // Get initials for avatar
  const initials = player.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  return (
    <Card 
      className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
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
    <p className="text-sm">Price: <span className="font-bold text-black">Rs. {player.value}</span></p>
    </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
        {player.category === "All-Rounder" ? (
                <>
                <div className="flex flex-col">
                    <span className="text-muted-foreground">Batting Average</span>
                    <span className="font-medium">{battingAverage}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-muted-foreground">Bowling Average</span>
                    <span className="font-medium">{bowlingAverage}</span>
                </div>
                </>
            ) : null}
          {player.category === "Batsman" ? (
            <>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Runs</span>
                <span className="font-medium">{player.total_runs}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground"> BattingAverage</span>
                <span className="font-medium">{battingAverage}</span>
              </div>
            </>
          ) : null}

          
          {player.category === "Bowler" ? (
            <>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Wickets</span>
                <span className="font-medium">{player.wickets}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">BowlingAverage</span>
                <span className="font-medium">{bowlingAverage}</span>
              </div>
            </>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
