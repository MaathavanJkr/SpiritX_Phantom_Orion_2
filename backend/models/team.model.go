// models/team.go
package models

import (
	"go-orm-template/db"
)

type Team struct {
	GormModel
	Name    string    `json:"name"`
	UserID  uint      `json:"user_id" gorm:"not null;unique"` // Changed from Owner to UserId and made unique
	User    *User     `json:"user" gorm:"foreignKey:UserID"`
	Players []*Player `json:"players" gorm:"many2many:team_players;"`
}

// AddTeam creates a new team record in the database
func AddTeam(team *Team) error {
	result := db.ORM.Create(&team)
	return result.Error
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
