import axios from '../axios.config';

export const login = async (username: string, password: string) => {
    try {
        const response = await axios.post('/auth/login', {
            username,
            password
        });
        return response.data;
    } catch (error : any) {
        throw new Error(`Login failed: ${error.response.data.details}`);

    }
};

export const register = async (username: string, password: string) => {
    try {
        const response = await axios.post('/auth/register', {
            username,
            password
        });
        return response.data;
    } catch (error : any) {
        throw new Error(`Registration failed: ${error.response.data.details}`);
    }
}

export const getUserDetails = async (userID: string,) => {
    try {
        const response = await axios.get(`/auth/user/${userID}`);
        return response.data;
    } catch (error : any) {
        throw new Error(`Failed to get user details: ${error.response.data.details}`);
    }
}