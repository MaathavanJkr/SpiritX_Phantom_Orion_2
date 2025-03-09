import axios from "@/axios.config"
import type { MyTeam } from "@/types/teamTypes"

export const getMyTeam = async (): Promise<MyTeam> => {
  try {
    const response = await axios.get("/v1/teams/my")
    return response.data
  } catch (error: any) {
    throw new Error(`Failed to get my team: ${error.response?.data?.details || error.message}`)
  }
}

export const createMyTeamName = async (team_name: string,): Promise<any> => {
  try {
    const response = await axios.put("/v1/teams/my", {
      name: team_name,
    })
    return response.data
  } catch (error: any) {
    throw new Error(`Failed to create team: ${error.response?.data?.details || error.message}`)
  }
}

export const addPlayerToTeam = async (playerIds: number[]) => {
    try {
        const response = await axios.post(
            "/v1/teams/players/assign",
            {
                player_ids: playerIds,
            },
        )

        return response.data
    } catch (error: any) {
        throw new Error(`Failed to add players to team: ${error.response?.data?.details || error.message}`)
    }
}

