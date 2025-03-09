import axios from "@/axios.config"

export const getLeaderBoard = async () => {
    try {
        const response = await axios.get(
            "/v1/teams/leaderboard",
        )
        return response.data
    } catch (error: any) {
        throw new Error(`Failed to get leaderboard: ${error.response?.data?.details || error.message}`)
    }
}

