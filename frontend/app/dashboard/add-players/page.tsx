"use client"

import { useState, useEffect } from "react"
import type { Player } from "@/types/playerTypes"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, Plus, X, Save, AlertCircle, DollarSign, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { getPlayers } from "@/services/playerService"
import { addPlayerToTeam } from "@/services/teamService"
import { getMyTeam, createMyTeam } from "@/services/teamService"
import type { MyTeam } from "@/types/teamTypes"

import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { User } from "@/types/authTypes"
import { getUserDetails } from "@/services/authService"
import router from "next/router"

export default function AddPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([])
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [myTeam, setMyTeam] = useState<MyTeam | null>(null)
  const [teamName, setTeamName] = useState("")
  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const { toast } = useToast()
  const [isEditMode, setIsEditMode] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [availableBudget, setAvailableBudget] = useState<number>(0)
  const [initialBudget, setInitialBudget] = useState<number>(0)
  const [isBudgetExceeded, setIsBudgetExceeded] = useState<boolean>(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("user_id")
        if (userId) {
          const userData = await getUserDetails(userId)
          setUser(userData)
          setInitialBudget(userData.budget)
          setAvailableBudget(userData.budget)
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err)
      }
    }

    fetchUserData()
  }, [])

  useEffect(() => {
    const checkTeam = async () => {
      try {
        const teamData = await getMyTeam()
        setMyTeam(teamData)

        if (teamData.is_found) {
          // If team exists, proceed to fetch players
          fetchPlayers()

          // If team has players, set them as selected players
          if (teamData.players && teamData.players.length > 0) {
            setSelectedPlayers(teamData.players)

            // Calculate used budget from existing players
            if (initialBudget > 0) {
              const usedBudget = teamData.players.reduce((total, player) => total + (player.value || 0), 0)
              setAvailableBudget(initialBudget - usedBudget)
            }
          }
        } else {
          // If no team, show create team UI
          setShowCreateTeam(true)
          setIsLoading(false)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to check team status")
        setIsLoading(false)
      }
    }

    checkTeam()
  }, [initialBudget])

  // Update budget status whenever selected players change
  useEffect(() => {
    if (initialBudget > 0) {
      const totalCost = selectedPlayers.reduce((total, player) => total + (player.value || 0), 0)
      const remaining = initialBudget - totalCost
      setAvailableBudget(remaining)
      setIsBudgetExceeded(remaining < 0)
    }
  }, [selectedPlayers, initialBudget])

  const fetchPlayers = async () => {
    try {
      setIsLoading(true)
      const data = await getPlayers()
      setPlayers(data)
      setFilteredPlayers(data)
      setIsLoading(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch players")
      setIsLoading(false)
    }
  }

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
  const categories = Array.isArray(players) ? [...new Set(players.map((player) => player.category))] : []

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

    // Check if adding this player would exceed budget
    const playerCost = player.value || 0
    if (availableBudget - playerCost < 0) {
      toast({
        title: "Budget exceeded",
        description: `Adding ${player.name} would exceed your available budget by ${Math.abs(availableBudget - playerCost)}`,
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
    const playerToRemove = selectedPlayers.find((p) => p.id === playerId)
    setSelectedPlayers(selectedPlayers.filter((p) => p.id !== playerId))

    if (playerToRemove) {
      toast({
        title: "Player removed",
        description: `${playerToRemove.name} has been removed from your team`,
      })
    }
  }

  // Open save dialog
  const handleSaveClick = () => {
    if (isBudgetExceeded) {
      toast({
        title: "Budget exceeded",
        description: "You cannot save the team because you've exceeded your budget",
        variant: "destructive",
      })
      return
    }

    setShowSaveDialog(true)
  }

  // Save team
  const saveTeam = async () => {
    if (isBudgetExceeded) {
      toast({
        title: "Budget exceeded",
        description: "You cannot save the team because you've exceeded your budget",
        variant: "destructive",
      })
      setShowSaveDialog(false)
      return
    }

    const playerIds = selectedPlayers.map((player) => player.id)

    try {
      await addPlayerToTeam(playerIds)
      toast({
        title: "Team saved",
        description: `Your team of ${selectedPlayers.length} players has been saved`,
      })
      console.log("Team saved successfully")
      setIsEditMode(!isEditMode)

      setShowSaveDialog(false)
    //   router.push("/dashboard/leaderboard")
      window.location.reload() // Hard refresh
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
      setShowSaveDialog(false)
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

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      toast({
        title: "Team name required",
        description: "Please enter a name for your team",
        variant: "destructive",
      })
      return
    }

    try {
      const userId = localStorage.getItem("user_id")
      if (!userId) {
        toast({
          title: "Error",
          description: "User ID not found",
          variant: "destructive",
        })
        return
      }

      await createMyTeam(teamName, Number(userId))
      toast({
        title: "Team created",
        description: `Your team "${teamName}" has been created successfully`,
      })

      // Refresh team data and proceed to player selection
      const teamData = await getMyTeam()
      setMyTeam(teamData)
      setShowCreateTeam(false)
      fetchPlayers()
    } catch (err) {
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to create team",
        variant: "destructive",
      })
    }
  }

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
    if (isEditMode && myTeam?.players) {
      setSelectedPlayers(myTeam.players)

      // Reset budget to initial state when canceling edit
      if (initialBudget > 0 && myTeam.players) {
        const usedBudget = myTeam.players.reduce((total, player) => total + (player.value || 0), 0)
        setAvailableBudget(initialBudget - usedBudget)
      }
    }
  }

  // Calculate total team value
  const totalTeamValue = selectedPlayers.reduce((total, player) => total + (player.value || 0), 0)

  // Create team UI
  const renderCreateTeamUI = () => {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle>Create Your Team</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No Team Found</AlertTitle>
            <AlertDescription>You need to create a team before you can add players.</AlertDescription>
          </Alert>

          <div className="space-y-2">
            <label htmlFor="team-name" className="text-sm font-medium">
              Team Name
            </label>
            <Input
              id="team-name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter your team name"
            />
          </div>

          <Button onClick={handleCreateTeam} className="w-full">
            Create Team
          </Button>
        </CardContent>
      </Card>
    )
  }

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

  // Show create team UI if no team exists
  if (showCreateTeam || (myTeam && !myTeam.is_found)) {
    return renderCreateTeamUI()
  }

  return (
    <div className="w-full space-y-6">
      {myTeam && (
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{isEditMode ? "Edit Team" : "Team Members"}</h1>
            <p className="text-muted-foreground">
              Team: <span className="font-medium">{myTeam.team_name}</span>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 font-medium ${isBudgetExceeded ? 'text-red-500' : 'text-black-600'}`}>
              <span><strong>Available Budget: {availableBudget.toLocaleString()}</strong></span>
            </div>
            {myTeam && myTeam.players && myTeam.players.length > 0 && (
              <Button variant={isEditMode ? "outline" : "default"} onClick={toggleEditMode}>
                {isEditMode ? "Cancel Edit" : "Edit Team"}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Save Confirmation Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Team</DialogTitle>
            <DialogDescription>
              Are you sure you want to save your team with {selectedPlayers.length} players?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveTeam}>Save and Continue</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isEditMode ? (
        // Edit mode UI - similar to the original add players UI
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Budget Status Alert */}
          {isBudgetExceeded && (
            <Alert variant="destructive" className="w-full">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Budget Exceeded</AlertTitle>
              <AlertDescription>
                You've exceeded your budget by {Math.abs(availableBudget).toLocaleString()}. 
                Remove some players or choose less expensive ones.
              </AlertDescription>
            </Alert>
          )}
          
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
                    filteredPlayers.map((player) => {
                      const isPlayerAffordable = (player.value || 0) <= availableBudget;
                      const isPlayerSelected = selectedPlayers.some((p) => p.id === player.id);
                      
                      return (
                        <div
                          key={player.id}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            isPlayerSelected
                              ? "bg-muted border-primary"
                              : !isPlayerAffordable && !isPlayerSelected
                              ? "bg-red-50 border-red-200"
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
                                <span></span>
                              </div>
                              <div className="flex items-center gap-1 text-sm">
                                <Badge variant="outline">{player.category}</Badge>
                                <span className="text-muted-foreground">Price:</span>
                                <span className={`font-bold ${!isPlayerAffordable && !isPlayerSelected ? 'text-red-600' : 'text-black'}`}>
                                  {player.value?.toLocaleString() || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant={isPlayerSelected ? "secondary" : "default"}
                            onClick={() => addPlayer(player)}
                            disabled={isPlayerSelected || (!isPlayerAffordable && !isPlayerSelected)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </div>
                      );
                    })
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Selected Team */}
          <div className="w-full lg:w-1/2 space-y-4">
            <Card className={isBudgetExceeded ? 'border-red-300' : ''}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle>Your Team ({selectedPlayers.length}/11)</CardTitle>
                  <Button 
                    onClick={handleSaveClick} 
                    disabled={selectedPlayers.length === 0 || isBudgetExceeded}
                    variant={isBudgetExceeded ? "destructive" : "default"}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Team
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Budget Status */}
                {/* <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Budget Used</span>
                    <span className={isBudgetExceeded ? 'text-red-600 font-bold' : ''}>
                      {totalTeamValue.toLocaleString()} / {initialBudget.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={(totalTeamValue / initialBudget) * 100} 
                    className={`${
                      isBudgetExceeded ? 'bg-red-100' : ''
                    } ${isBudgetExceeded ? 'bg-red-500' : ''}`}
                  />
                </div> */}
                
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
                          <div className="flex items-center gap-2 text-sm">
                            <Badge variant="outline">{player.category}</Badge>
                            <span className="text-muted-foreground">Price:</span>
                            <span className="font-bold">{player.value?.toLocaleString() || 0}</span>
                          </div>
                        </div>
                      </div>
                      <Button size="sm" variant="destructive" onClick={() => removePlayer(player.id)}>
                        <X className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div> )}
              </CardContent>
              
              <CardFooter className="border-t pt-4">
                <div className="w-full flex justify-between items-center">
                  <div className="text-sm text-muted-foreground">
                    Total Team Value:
                  </div>
                  <div className={`font-bold text-lg ${isBudgetExceeded ? 'text-red-500' : 'text-black-500'}`}>
                    {totalTeamValue.toLocaleString()}
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        // View mode UI - display team members in a card
        <Card>
          <CardHeader className="pb-3 w-full">
            <div className="flex justify-between items-center">
              <div className="flex items-end gap-2 font-medium text-black-600">
                <span><strong>Team Value: {totalTeamValue.toLocaleString()} / {initialBudget.toLocaleString()}</strong></span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!myTeam?.players || myTeam.players.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-muted-foreground">No players in your team</p>
                <Button onClick={() => setIsEditMode(true)} className="mt-4">
                  Add Players
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Category Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
                  {categories.length > 0 &&
                    categories.map((category) => {
                      const count = myTeam.players?.filter((p) => p.category === category).length || 0
                      return (
                        <div key={category} className="p-2 bg-muted rounded-lg text-center">
                          <p className="text-xs text-muted-foreground">{category}s</p>
                          <p className="text-lg font-bold">{count}</p>
                        </div>
                      )
                    })}
                  <div key="Total Players" className="p-2 bg-muted rounded-lg text-center">
                    <p className="text-xs text-muted-foreground">Total Players</p>
                    <p className="text-lg font-bold">{myTeam.players.length}</p>
                  </div>
                </div>

                {/* Team Members List */}
                <div className="space-y-3">
                  {myTeam.players.map((player) => (
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
                            <span>{player.university}</span>
                            <span>•</span>
                            <Badge variant="outline">{player.category}</Badge>
                          </div>
                        </div>
                      </div>
                      <div className="font-medium">
                        {player.value?.toLocaleString() || 0}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

      )}
    </div>
  )
}

