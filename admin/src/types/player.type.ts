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
    points: number;
    value: number;
    batting_strike_rate: number;
    batting_average: number;
    bowling_strike_rate: number;
    economy_rate: number;
}