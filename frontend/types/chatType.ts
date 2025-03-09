export interface ChatResponse {
    explanation: string;
    is_player: boolean;
    query_results: QueryResults[] | null;
}

export interface QueryResults {
    category: string;
    name: string;
    university: string;
    value: number;
}
