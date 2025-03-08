import { Player } from "@/types/playerTypes";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PlayerDetailsProps {
  player: Player;
}

export function PlayerDetails({ player }: PlayerDetailsProps) {
  // Calculate batting stats
  const battingAverage = player.innings_played > 0 
    ? (player.total_runs / player.innings_played).toFixed(2) 
    : 0;
  
  const strikeRate = player.balls_faced > 0 
    ? ((player.total_runs / player.balls_faced) * 100).toFixed(2) 
    : 0;
  
  // Calculate bowling stats
  const bowlingAverage = player.wickets > 0 
    ? (player.runs_conceded / player.wickets).toFixed(2) 
    : 0;
  
  const economyRate = player.overs_bowled > 0 
    ? (player.runs_conceded / player.overs_bowled).toFixed(2) 
    : 0;

  // Get initials for avatar
  const initials = player.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  // Prepare chart data
  const battingData = [
    { name: "Runs", value: player.total_runs },
    { name: "Balls Faced", value: player.balls_faced },
    { name: "Innings", value: player.innings_played },
  ];

  const bowlingData = [
    { name: "Wickets", value: player.wickets },
    { name: "Overs", value: Math.floor(player.overs_bowled) },
    { name: "Runs Conceded", value: player.runs_conceded },
  ];

  // Pie chart data for run distribution (example)
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const runDistribution = [
    { name: 'Singles', value: Math.round(player.total_runs * 0.4) },
    { name: 'Boundaries', value: Math.round(player.total_runs * 0.3) },
    { name: 'Sixes', value: Math.round(player.total_runs * 0.2) },
    { name: 'Others', value: Math.round(player.total_runs * 0.1) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg">{initials}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-bold">{player.name}</h2>
          <p className="text-muted-foreground">{player.university}</p>
          <Badge className="mt-1">{player.category}</Badge>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {/* Batting Stats */}
        {( player.category == "Bowler") && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Bowling Statistics</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-muted rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Wickets</div>
                <div className="text-2xl font-bold">{player.wickets}</div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Economy Rate</div>
                <div className="text-2xl font-bold">{economyRate}</div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Overs Bowled</div>
                <div className="text-2xl font-bold">{player.overs_bowled}</div>
              </div>
            </div>
            <Separator />
            <div className="space-y-4">
            <h3 className="text-lg font-semibold">Batting Statistics</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-muted rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Total Runs</div>
                <div className="text-2xl font-bold">{player.total_runs}</div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Batting Average</div>
                <div className="text-2xl font-bold">{battingAverage}</div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Strike Rate</div>
                <div className="text-2xl font-bold">{strikeRate}</div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Innings</div>
                <div className="text-2xl font-bold">{player.innings_played}</div>
              </div>
            </div>
          </div>
          </div>
        )}


        {(player.category === "All-Rounder"  || player.category === "Batsman") && (
          <div className="space-y-4">
            <div className="space-y-4">
            <h3 className="text-lg font-semibold">Batting Statistics</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-muted rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Total Runs</div>
                <div className="text-2xl font-bold">{player.total_runs}</div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Batting Average</div>
                <div className="text-2xl font-bold">{battingAverage}</div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Strike Rate</div>
                <div className="text-2xl font-bold">{strikeRate}</div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Innings</div>
                <div className="text-2xl font-bold">{player.innings_played}</div>
              </div>
            </div>
          </div>
            <Separator />
            <h3 className="text-lg font-semibold">Bowling Statistics</h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-muted rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Wickets</div>
                <div className="text-2xl font-bold">{player.wickets}</div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Economy Rate</div>
                <div className="text-2xl font-bold">{economyRate}</div>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="text-sm text-muted-foreground">Overs Bowled</div>
                <div className="text-2xl font-bold">{player.overs_bowled}</div>
              </div>
            </div>
          </div>
        )}
    
      </div>
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">General Statistics</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Total Runs</div>
              <div className="text-2xl font-bold">{player.total_runs}</div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Balls Faced</div>
              <div className="text-2xl font-bold">{player.balls_faced}</div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Innings Played</div>
              <div className="text-2xl font-bold">{player.innings_played}</div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Wickets</div>
              <div className="text-2xl font-bold">{player.wickets}</div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Overs Bowled</div>
              <div className="text-2xl font-bold">{player.overs_bowled}</div>
            </div>
            <div className="bg-muted rounded-lg p-3">
              <div className="text-sm text-muted-foreground">Runs Conceded</div>
              <div className="text-2xl font-bold">{player.runs_conceded}</div>
            </div>
          </div>
        </div>
      </div>
      <Separator />

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Performance Summary</h3>
        <p className="text-muted-foreground">
          {player.name} is a {player.category.toLowerCase()} from {player.university}. 
          {player.category === "Batsman" && ` With a batting average of ${battingAverage} and a strike rate of ${strikeRate}, they have scored ${player.total_runs} runs in ${player.innings_played} innings.`}
          {player.category === "Bowler" && ` With a bowling average of ${bowlingAverage} and an economy rate of ${economyRate}, they have taken ${player.wickets} wickets in ${player.overs_bowled} overs.`}
          {player.category === "All-rounder" && ` As an all-rounder, they have scored ${player.total_runs} runs with an average of ${battingAverage} and taken ${player.wickets} wickets with a bowling average of ${bowlingAverage}.`}
        </p>
      </div>
    </div>
  );
}
