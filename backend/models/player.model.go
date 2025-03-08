// models/user.go
package models

import (
	"go-orm-template/db"
)

type Player struct {
	GormModel
	Name          string  `json:"name"`
	University    string  `json:"university"`
	Category      string  `json:"category"`
	TotalRuns     int     `json:"total_runs"`
	BallsFaced    int     `json:"balls_faced"`
	InningsPlayed int     `json:"innings_played"`
	Wickets       int     `json:"wickets"`
	OversBowled   float64 `json:"overs_bowled"`
	RunsConceded  int     `json:"runs_conceded"`
	Teams         []*Team `json:"teams" gorm:"many2many:player_teams;"`
}

type TournamentSummary struct {
	OverallRuns         int                      `json:"overall_runs"`
	OverallWickets      int                      `json:"overall_wickets"`
	HighestRunScorers   []map[string]interface{} `json:"highest_run_scorers"`
	HighestWicketTakers []map[string]interface{} `json:"highest_wicket_takers"`
}

type PlayerForUser struct {
	Name          string  `json:"name"`
	University    string  `json:"university"`
	Category      string  `json:"category"`
	TotalRuns     int     `json:"total_runs"`
	BallsFaced    int     `json:"balls_faced"`
	InningsPlayed int     `json:"innings_played"`
	Wickets       int     `json:"wickets"`
	OversBowled   float64 `json:"overs_bowled"`
	RunsConceded  int     `json:"runs_conceded"`
}

// AddPlayer creates a new player record in the database
func AddPlayer(player *Player) error {
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
