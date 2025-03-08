import { Player } from '@/types/playerTypes';
import axios from '../axios.config';

export const getPlayers = async (token: string): Promise<Player[]> => {
    try {
        const response = await axios.get('/players', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error: any) {
        throw new Error(`Failed to get players: ${error.response?.data?.details || error.message}`);
    }
};
