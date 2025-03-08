import axios from '../axios.config';

export const addPlayerToTeam = async (player_ids: number[]) => {
    try {
        const response = await axios.post('/v1/teams/addplayers', {
            "player_ids" : player_ids
        });

        return response.data;
    } catch (error : any) {
        console.log("error sprite11");
        console.log(error.response);
        throw new Error(`Failed to create sprite11: ${error.response.data.details}`);
    }
}

