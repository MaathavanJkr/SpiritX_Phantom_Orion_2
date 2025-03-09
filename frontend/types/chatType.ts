export interface ChatResponse {
    explanation: string;
    query_results: QueryResults[] | null;
}

export interface QueryResults {
    category: string | null;
    name: string | null;
    university: string | null;
    value: number | null;
    total_runs: number | null;
    wickets: number | null;
}

