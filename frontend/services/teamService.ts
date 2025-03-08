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

export const createMyTeam = async (team_name: string, user_id: number): Promise<any> => {
  try {
    const response = await axios.post("/teams/add", {
      name: team_name,
      user_id: user_id,
    })
    return response.data
  } catch (error: any) {
    throw new Error(`Failed to create team: ${error.response?.data?.details || error.message}`)
  }
}

export const addPlayerToTeam = async (playerIds: number[]) => {
    try {
        console.log(playerIds)
        console.log(typeof playerIds[0])
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

