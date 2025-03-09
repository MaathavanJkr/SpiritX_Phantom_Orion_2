export interface TournamentSummary {
    overall_runs: number;
    overall_wickets: number;
    highest_run_scorers: {
        id: number;
        name: string;
        runs: number;
    }[];
    highest_wicket_takers: {
        id: number;
        name: string;
        wickets: number;
    }[];
}
