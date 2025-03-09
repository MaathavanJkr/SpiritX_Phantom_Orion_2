import axios from '../axios.config';
import { ChatResponse } from '@/types/chatType';

type MessageHistory = {
  role: string
  content: string
}[]

export const getChatMessages = async (messages: MessageHistory): Promise<ChatResponse> => {
  try {
    const response = await axios.post(`/v1/ai/chat`, messages)
    return response.data
  } catch (error: any) {
    throw new Error(`Failed to get chat messages: ${error.response?.data?.details || error.message}`)
  }
}

