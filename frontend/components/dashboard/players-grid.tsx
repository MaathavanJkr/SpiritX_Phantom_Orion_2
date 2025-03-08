"use client";

import { useState, useEffect } from "react";
import { Player } from "@/types/playerTypes";
import { PlayerCard } from "@/components/dashboard/player-card";
import { PlayerDetails } from "@/components/dashboard/player-details";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getPlayers } from "@/services/playerService";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export function PlayersGrid() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const fetchPlayers = async () => {
      try {
        setIsLoading(true);
        if (token) {
          const data = await getPlayers(token);
          console.log(data);
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
    let result = players;
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(player => 
        player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        player.university.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (categoryFilter) {
      result = result.filter(player => player.category === categoryFilter);
    }
    
    setFilteredPlayers(result);
  }, [searchQuery, categoryFilter, players]);

  // Get unique categories for filter
  const categories = [...new Set(players.map(player => player.category))];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Input
            type="search"
            placeholder="Search players..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Button
            variant={categoryFilter === null ? "default" : "outline"}
            size="sm"
            onClick={() => setCategoryFilter(null)}
          >
            All
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={categoryFilter === category ? "default" : "outline"}
              size="sm"
              onClick={() => setCategoryFilter(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {filteredPlayers.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No players found matching your criteria</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredPlayers.map((player) => (
            <PlayerCard 
              key={player.id} 
              player={player} 
              onClick={() => setSelectedPlayer(player)} 
            />
          ))}
        </div>
      )}

    <Dialog open={!!selectedPlayer} onOpenChange={(open) => !open && setSelectedPlayer(null)}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogTitle>
          <VisuallyHidden>Player Details</VisuallyHidden>
        </DialogTitle>
        {selectedPlayer ? <PlayerDetails player={selectedPlayer} /> : null}
      </DialogContent>
    </Dialog>

    </div>
  );
}
