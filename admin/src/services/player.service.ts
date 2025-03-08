import axios from "../axios.config";
import { Player } from "../types/player.type";

export const getPlayers = async (): Promise<Player[]> => {
  try {
    const response = await axios.get("/players");
    return response.data || [];
  } catch (error: any) {
    throw new Error(error.response?.data?.details || "Failed to fetch players");
  }
}

export const getPlayer = async (id: number) => {
  try {
    const response = await axios.get(`/players/${id}`);
    return response.data || {};
  } catch (error: any) {
    throw new Error(error.response?.data?.details || "Failed to fetch player");
  }
}

export const createPlayer = async (player: Player) => {
  try {
    const response = await axios.post("/players", player);
    return response.data || {};
  } catch (error: any) {
    throw new Error(error.response?.data?.details || "Failed to create player");
  }
}

export const updatePlayer = async (player: Player) => {
  try {
    const response = await axios.put(`/players/${player.id}`, player);
    return response.data || {};
  } catch (error: any) {
    throw new Error(error.response?.data?.details || "Failed to update player");
  }
}

export const deletePlayer = async (id: number) => {
  try {
    const response = await axios.delete(`/players/${id}`);
    return response.data || {};
  } catch (error: any) {
    throw new Error(error.response?.data?.details || "Failed to delete player");
  }
}