import axios from "../axios.config";
import { TournamentSummary } from "../types/tournament.type";

export const getTournamentSummary = async (): Promise<TournamentSummary> => {
  try {
    const response = await axios.get("/tournament/summary");
    return response.data || null;
  } catch (error: any) {
    throw new Error(error.response?.data?.details || "Failed to fetch tournaments");
  }
}