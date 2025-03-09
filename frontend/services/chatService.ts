import axios from '../axios.config';
import { ChatResponse } from '@/types/chatType';

export const getChatMessages = async (content: string): Promise<ChatResponse> => {
    try {
        const response = await axios.post(`/v1/ai/chat`, { content : content });
        return response.data;
    } catch (error: any) {
        throw new Error(`Failed to get chat messages: ${error.response?.data?.details || error.message}`);
    }
}

