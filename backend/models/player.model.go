// models/user.go
package models

import (
	"go-orm-template/db"
	"math"
)

type Player struct {
	GormModel
	Name              string  `json:"name"`
	University        string  `json:"university"`
	Category          string  `json:"category"`
	TotalRuns         int     `json:"total_runs"`
	BallsFaced        int     `json:"balls_faced"`
	InningsPlayed     int     `json:"innings_played"`
	Wickets           int     `json:"wickets"`
	OversBowled       float64 `json:"overs_bowled"`
	RunsConceded      int     `json:"runs_conceded"`
	Teams             []*Team `json:"teams" gorm:"many2many:player_teams;"`
	Points            int     `json:"points"`
	Value             int     `json:"value"`
	BattingStrikeRate float64 `json:"batting_strike_rate"`
	BattingAverage    float64 `json:"batting_average"`
	BowingStrikeRate  float64 `json:"bowling_strike_rate"`
	EconomyRate       float64 `json:"economy_rate"`
}

type TournamentSummary struct {
	OverallRuns         int                      `json:"overall_runs"`
	OverallWickets      int                      `json:"overall_wickets"`
	HighestRunScorers   []map[string]interface{} `json:"highest_run_scorers"`
	HighestWicketTakers []map[string]interface{} `json:"highest_wicket_takers"`
}

type PlayerForUser struct {
	ID                uint    `json:"id"`
	Name              string  `json:"name"`
	University        string  `json:"university"`
	Category          string  `json:"category"`
	TotalRuns         int     `json:"total_runs"`
	BallsFaced        int     `json:"balls_faced"`
	InningsPlayed     int     `json:"innings_played"`
	Wickets           int     `json:"wickets"`
	OversBowled       float64 `json:"overs_bowled"`
	RunsConceded      int     `json:"runs_conceded"`
	Value             int     `json:"value"`
	BattingStrikeRate float64 `json:"batting_strike_rate"`
	BattingAverage    float64 `json:"batting_average"`
	BowingStrikeRate  float64 `json:"bowling_strike_rate"`
	EconomyRate       float64 `json:"economy_rate"`
}

func CalculatePlayerStats(player *Player) {
	player.BattingStrikeRate = safeDivide(float64(player.TotalRuns)*100, float64(player.BallsFaced))
	player.BattingAverage = safeDivide(float64(player.TotalRuns), float64(player.InningsPlayed))
	player.BowingStrikeRate = safeDivide(float64(player.OversBowled)*100, float64(player.Wickets))
	player.EconomyRate = safeDivide(float64(player.RunsConceded)*100, float64(player.OversBowled*6))

	bowlingStrikeRate := player.BowingStrikeRate
	if math.IsNaN(bowlingStrikeRate) {
		bowlingStrikeRate = 0
	}

	if player.BowingStrikeRate == 0 && player.EconomyRate == 0 {
		player.Points = int((player.BattingStrikeRate/5 + player.BattingAverage*0.8))
	} else if player.BowingStrikeRate == 0 {
		player.Points = int((player.BattingStrikeRate/5 + player.BattingAverage*0.8 + (140 / player.EconomyRate)))
	} else if player.EconomyRate == 0 {
		player.Points = int((player.BattingStrikeRate/5 + player.BattingAverage*0.8 + (500 / bowlingStrikeRate)))
	} else {
		player.Points = int((player.BattingStrikeRate/5 + player.BattingAverage*0.8 + (500 / bowlingStrikeRate) + (140 / player.EconomyRate)))
	}

	player.Value = int((9*float64(player.Points) + 100) * 1000)
	player.Value = (player.Value + 49999) / 50000 * 50000 // Round to the nearest multiple of 50,000
	player.BattingStrikeRate = math.Round(player.BattingStrikeRate*100) / 100
	player.BattingAverage = math.Round(player.BattingAverage*100) / 100
	player.BowingStrikeRate = math.Round(player.BowingStrikeRate*100) / 100
	player.EconomyRate = math.Round(player.EconomyRate*100) / 100
}

func safeDivide(numerator, denominator float64) float64 {
	if denominator == 0 {
		return math.NaN()
	}
	return numerator / denominator
}

// func CalculatePlayerStats(player *Player) {
// 	player.BattingStrikeRate = math.Round((float64(player.TotalRuns)/float64(player.BallsFaced)*100)*100) / 100
// 	player.BattingAverage = math.Round((float64(player.TotalRuns)/float64(player.InningsPlayed))*100) / 100
// 	player.BowingStrikeRate = math.Round((float64(player.OversBowled)/float64(player.Wickets))*100) / 100
// 	player.EconomyRate = math.Round((float64(player.RunsConceded)/float64(player.OversBowled*6))*100) / 100

// 	player.Points = int((player.BattingStrikeRate/5 + player.BattingAverage*0.8 + (500 / player.BowingStrikeRate) + (140 / player.EconomyRate)))
// 	player.Value = int((9*float64(player.Points) + 100) * 1000)
// 	player.Value = (player.Value + 49999) / 50000 * 50000 // Round to the nearest multiple of 50,000
// }

// AddPlayer creates a new player record in the database
func AddPlayer(player *Player) error {
	CalculatePlayerStats(player)
	result := db.ORM.Create(&player)
	return result.Error
}

// GetPlayerByID retrieves a player record from the database by ID
func GetPlayerByID(id string) (*Player, error) {
	var player *Player
	result := db.ORM.First(&player, id)

	if result.Error != nil {
		return nil, result.Error
	}
	return player, nil
}

func GetAllPlayers() ([]*Player, error) {
	var players []*Player

	result := db.ORM.Find(&players)
	if result.Error != nil {
		return nil, result.Error
	}
	return players, nil
}

func GetPlayersByFilters(filters map[string]interface{}) ([]*Player, error) {
	var players []*Player

	println(filters)

	result := db.ORM.Model(&Player{}).Where(filters).Find(&players)
	if result.Error != nil {
		return nil, result.Error
	}
	return players, nil
}

// UpdatePlayerByID updates an existing player record in the database
func UpdatePlayerByID(player *Player) error {
	CalculatePlayerStats(player)
	result := db.ORM.Save(&player)
	return result.Error
}

// DeletePlayerByID deletes a player record from the database by ID
func DeletePlayerByID(id string) error {
	var player *Player
	result := db.ORM.Delete(&player, id)
	return result.Error
}

func GetTournamentSummary() (*TournamentSummary, error) {
	var players []*Player
	result := db.ORM.Find(&players)
	if result.Error != nil {
		return nil, result.Error
	}

	summary := &TournamentSummary{}
	highestRunScorer := 0
	highestWicketTaker := 0

	for _, player := range players {
		summary.OverallRuns += player.TotalRuns
		summary.OverallWickets += player.Wickets

		if player.TotalRuns > highestRunScorer {
			highestRunScorer = player.TotalRuns
			summary.HighestRunScorers = []map[string]interface{}{
				{
					"id":   player.ID,
					"name": player.Name,
					"runs": player.TotalRuns,
				},
			}
		} else if player.TotalRuns == highestRunScorer {
			summary.HighestRunScorers = append(summary.HighestRunScorers, map[string]interface{}{
				"id":   player.ID,
				"name": player.Name,
				"runs": player.TotalRuns,
			})
		}

		if player.Wickets > highestWicketTaker {
			highestWicketTaker = player.Wickets
			summary.HighestWicketTakers = []map[string]interface{}{
				{
					"id":      player.ID,
					"name":    player.Name,
					"wickets": player.Wickets,
				},
			}
		} else if player.Wickets == highestWicketTaker {
			summary.HighestWicketTakers = append(summary.HighestWicketTakers, map[string]interface{}{
				"id":      player.ID,
				"name":    player.Name,
				"wickets": player.Wickets,
			})
		}
	}

	return summary, nil
}
