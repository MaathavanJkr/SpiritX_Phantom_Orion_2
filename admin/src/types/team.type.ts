import { Player } from "./player.type";
import { User } from "./user.type";

export interface Team {
    id: number
    name: string;
    user_id: number; // Changed from UserID to user_id for snake_case
    user: User; // Assuming User is defined elsewhere
    players: Player[] | null; // Assuming Player is defined elsewhere and can be null
    points: number;
    value: number;
}
