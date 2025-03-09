import type { Player } from "./playerTypes"

export interface MyTeam {
  team_name: string
  players: Player[] | null
  is_found: boolean
  value: number
  points: number
}

