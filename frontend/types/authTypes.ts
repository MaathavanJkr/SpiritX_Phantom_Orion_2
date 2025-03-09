export interface User {
    id?: number;
    username: string;
    role: string;
    created_at: string;
    approved: boolean;
    budget: number;
    team_name: string;
  }

export interface LoginResponse {
    user: User;
    token: string;
    message: string;
  }