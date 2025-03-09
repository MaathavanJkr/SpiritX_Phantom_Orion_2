export interface User {
    id?: number;
    username: string;
    role: string;
    created_at: string;
    approved: boolean;
    budget: number;
  }

export interface LoginResponse {
    user: User;
    token: string;
    message: string;
  }