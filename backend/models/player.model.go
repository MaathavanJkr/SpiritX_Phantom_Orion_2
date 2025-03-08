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
