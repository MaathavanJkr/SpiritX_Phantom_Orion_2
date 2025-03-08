import axios from '../axios.config';

export const postSprite11 = async (player_ids: number[], token: string) => {
    try {
        const response = await axios.post('/v1/teams/addplayers', {
            player_ids
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error : any) {
        throw new Error(`Failed to create sprite11: ${error.response.data.details}`);
    }
}