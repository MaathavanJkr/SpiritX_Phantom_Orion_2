import { Player } from '@/types/playerTypes';
import axios from '../axios.config';

export const getPlayers = async (): Promise<Player[]> => {
    try {
        const response = await axios.get('/players');
        return response.data;
    } catch (error: any) {
        throw new Error(`Failed to get players: ${error.response?.data?.details || error.message}`);
    }
};
