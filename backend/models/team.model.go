// models/team.go
package models

import (
	"fmt"
	"go-orm-template/db"
)

type Team struct {
	GormModel
	Name    string    `json:"name"`
	UserID  uint      `json:"user_id" gorm:"not null;unique"` // Changed from Owner to UserId and made unique
	User    *User     `json:"user" gorm:"foreignKey:UserID"`
	Players []*Player `json:"players" gorm:"many2many:team_players;"`
}

type TeamPlayers struct {
	UserID    uint   `json:"user_id"`
	PlayerIDs []uint `json:"player_ids"`
}

// AddTeam creates a new team record in the database
func AddTeam(team *Team) error {
	result := db.ORM.Create(&team)
	return result.Error
}

// AddPlayersToTeamByUserID adds players to a team by user ID and player IDs
func AddPlayersToTeamByUserID(teamPlayers TeamPlayers) error {
	var team Team
	result := db.ORM.Preload("Players").Where("user_id = ?", teamPlayers.UserID).First(&team)
	if result.Error != nil {
		return result.Error
	}

	var players []*Player
	result = db.ORM.Find(&players, teamPlayers.PlayerIDs)
	if result.Error != nil {
		return result.Error
	}

	// Check if adding the new players would exceed the maximum limit of 11 players
	if len(team.Players)+len(players) > 11 {
		return fmt.Errorf("adding these players would exceed the maximum limit of 11 players per team")
	}

	// Append players to the team's Players association
	err := db.ORM.Model(&team).Association("Players").Append(players)
	return err
}

// GetTeamByID retrieves a team record from the database by ID
func GetTeamByID(id string) (*Team, error) {
	var team *Team
	result := db.ORM.First(&team, id)

	if result.Error != nil {
		return nil, result.Error
	}
	return team, nil
}

func GetAllTeams() ([]*Team, error) {
	var teams []*Team

	result := db.ORM.Model(&Team{}).Preload("Players").Preload("User").Find(&teams)
	if result.Error != nil {
		return nil, result.Error
	}
	return teams, nil
}

func GetTeamsByFilters(filters map[string]interface{}) ([]*Team, error) {
	var teams []*Team

	println(filters)

	result := db.ORM.Model(&Team{}).Where(filters).Find(&teams)
	if result.Error != nil {
		return nil, result.Error
	}
	return teams, nil
}

// UpdateTeamByID updates an existing team record in the database
func UpdateTeamByID(team *Team) error {
	result := db.ORM.Save(&team)
	return result.Error
}

// DeleteTeamByID deletes a team record from the database by ID
func DeleteTeamByID(id string) error {
	var team *Team
	result := db.ORM.Delete(&team, id)
	return result.Error
}
