import axios from "../axios.config";
import { Team } from "../types/team.type";

export const getLeaderboard = async (): Promise<Team[]> => {
    try {
      const response = await axios.get("/v1/teams/leaderboard");
      return response.data || [];
    } catch (error: any) {
      throw new Error(error.response?.data?.details || "Failed to fetch players");
    }
  }