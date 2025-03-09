import { User } from "./authTypes";
import { Batsman, Bowler, Player } from "./playerTypes";

export interface TopScorers {
    overall_runs: number;
    overall_wickets: number;
    highest_run_scorers: Batsman[];
    highest_wicket_takers: Bowler[];
}

export interface Leaderboard {
    id: number;
    name: string;
    points: number;
    user_id: number;
    user: User;
    players: Player[];
}