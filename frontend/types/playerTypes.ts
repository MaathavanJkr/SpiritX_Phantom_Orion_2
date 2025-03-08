export interface Player {
    id: number;
    name: string;
    university: string;
    category: string;
    total_runs: number;
    balls_faced: number;
    innings_played: number;
    wickets: number;
    overs_bowled: number;
    runs_conceded: number;
}

export interface Batsman {
    id: number;
    name: string;
    runs: number;
}

export interface Bowler {
    id: number;
    name: string;
    wickets: number;
}

export interface TopScorers {
    overall_runs: number;
    overall_wickets: number;
    highest_run_scorers: Batsman[];
    highest_wicket_takers: Bowler[];
}