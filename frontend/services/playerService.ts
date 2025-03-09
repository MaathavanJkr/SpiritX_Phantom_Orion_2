import { Player} from '@/types/playerTypes';
import axios from '../axios.config';
import { TopScorers } from "@/types/leaderboardType"

export const getPlayers = async (): Promise<Player[]> => {
    try {
        const response = await axios.get('/v1/players/filter');
        return response.data;
    } catch (error: any) {
        throw new Error(`Failed to get players: ${error.response?.data?.details || error.message}`);
    }
};

export const getTopScorers = async (): Promise<TopScorers> => {
    try {
        const response = await axios.get('/v1/tournament/summary');
        return response.data;
    } catch (error: any) {
        throw new Error(`Failed to get top scorers: ${error.response?.data?.details || error.message}`);
    }
}