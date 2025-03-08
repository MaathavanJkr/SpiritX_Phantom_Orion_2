"use client"

import { useState, useEffect } from "react"
import type { Player } from "@/types/playerTypes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Plus, X, Save, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { getPlayers } from "@/services/playerService"
import { postSprite11 } from "@/services/sprit11Service"

export default function AddPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const fetchPlayers = async () => {
      try {
        setIsLoading(true);
        if (token) {
          const data = await getPlayers(token);
          setPlayers(data);
          setFilteredPlayers(data);
          setIsLoading(false);

        } else {
          throw new Error("No auth token found");
        }

      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch players");
        setIsLoading(false);
      }
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    let result = players

    if (searchQuery) {
      result = result.filter(
        (player) =>
          player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          player.university.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    // Apply category filter
    if (categoryFilter) {
      result = result.filter((player) => player.category === categoryFilter)
    }

    setFilteredPlayers(result)
  }, [searchQuery, categoryFilter, players])

  // Get unique categories for filter
  const categories = [...new Set(players.map((player) => player.category))]

  // Add player to selection
  const addPlayer = (player: Player) => {
    if (selectedPlayers.length >= 11) {
      toast({
        title: "Team is full",
        description: "You can only select up to 11 players",
        variant: "destructive",
      })
      return
    }

    if (selectedPlayers.some((p) => p.id === player.id)) {
      toast({
        title: "Player already selected",
        description: "This player is already in your team",
        variant: "destructive",
      })
      return
    }

    setSelectedPlayers([...selectedPlayers, player])
    toast({
      title: "Player added",
      description: `${player.name} has been added to your team`,
    })
  }

  // Remove player from selection
  const removePlayer = (playerId: number) => {
    setSelectedPlayers(selectedPlayers.filter((p) => p.id !== playerId))
    toast({
      title: "Player removed",
      description: "Player has been removed from your team",
    })
  }

  // Save team
const saveTeam = async () => {
    const playerIds = selectedPlayers.map((player) => player.id)
    const token = localStorage.getItem("auth_token");

    if (!token) {
        toast({
            title: "Error",
            description: "No auth token found",
            variant: "destructive",
        });
        return;
    }

    try {
        await postSprite11(playerIds, token);
        toast({
            title: "Team saved",
            description: `Your team of ${selectedPlayers.length} players has been saved`,
        });
    } catch (error : any) {
        toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
        });
    }
}

  // Count players by category
  const playerCountByCategory = selectedPlayers.reduce(
    (acc, player) => {
      acc[player.category] = (acc[player.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

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

  return (
    <div className="w-full space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Players</h1>
        <p className="text-muted-foreground">Select players to create your team</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Column - Available Players */}
        <div className="w-full lg:w-1/2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Available Players</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search players..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9"
                  />
                </div>
                <Tabs
                  value={categoryFilter || "all"}
                  onValueChange={(value) => setCategoryFilter(value === "all" ? null : value)}
                  className="w-full sm:w-auto"
                >
                  <TabsList className="w-full">
                    <TabsTrigger value="all">All</TabsTrigger>
                    {categories.map((category) => (
                      <TabsTrigger key={category} value={category}>
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              {/* Player List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {filteredPlayers.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No players found matching your criteria</p>
                  </div>
                ) : (
                  filteredPlayers.map((player) => (
                    <div
                      key={player.id}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        selectedPlayers.some((p) => p.id === player.id)
                          ? "bg-muted border-primary"
                          : "bg-card hover:bg-accent/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {player.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{player.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{player.university}</span>
                            <span>•</span>
                            <Badge variant="outline">{player.category}</Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={selectedPlayers.some((p) => p.id === player.id) ? "secondary" : "default"}
                        onClick={() => addPlayer(player)}
                        disabled={selectedPlayers.some((p) => p.id === player.id)}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Selected Team */}
        <div className="w-full lg:w-1/2 space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Your Team ({selectedPlayers.length}/11)</CardTitle>
                <Button onClick={saveTeam} disabled={selectedPlayers.length === 0}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Team
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Team Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Team Completion</span>
                  <span>{selectedPlayers.length}/11 Players</span>
                </div>
                <Progress value={(selectedPlayers.length / 11) * 100} />
              </div>

              {/* Category Breakdown */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {categories.map((category) => (
                  <div key={category} className="p-2 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">{category}s</p>
                    <p className="text-lg font-bold">{playerCountByCategory[category] || 0}</p>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Selected Players List */}
              {selectedPlayers.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No players selected yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Add players from the left panel</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {selectedPlayers.map((player) => (
                    <div key={player.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {player.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{player.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline">{player.category}</Badge>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="destructive" onClick={() => removePlayer(player.id)}>
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

