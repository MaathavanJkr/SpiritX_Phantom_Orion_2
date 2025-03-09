import { z } from "zod";

export const playerSchema = z.object({
  name: z.string().min(1, "Player name is required"),
  university: z.string().min(1, "University name is required"),
  category: z.string().refine(val => ["Batsman", "Bowler", "All-Rounder"].includes(val), {
    message: "Category must be either Batsman, Bowler or All-Rounder"
  }),
  total_runs: z.number().min(0, "Total runs cannot be negative"),
  balls_faced: z.number().min(0, "Balls faced cannot be negative"), 
  innings_played: z.number().min(0, "Innings played cannot be negative"),
  wickets: z.number().min(0, "Wickets cannot be negative"),
  overs_bowled: z.number().min(0, "Overs bowled cannot be negative"),
  runs_conceded: z.number().min(0, "Runs conceded cannot be negative")
});