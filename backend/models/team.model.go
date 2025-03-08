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
	Points  int       `json:"points"`
}

// convertPlayers converts []*Player to []Player
func convertPlayers(players []*Player) []Player {
	var result []Player
	for _, player := range players {
		result = append(result, *player)
	}
	return result
}

type TeamPlayersView struct {
	TeamName string   `json:"team_name"`
	Players  []Player `json:"players"`
	IsFound  bool     `json:"is_found"`
	Points   int      `json:"points"`
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
func AssignPlayersToTeamByUserID(teamPlayers TeamPlayers) error {
	var team Team
	result := db.ORM.Preload("Players").Preload("User").Where("user_id = ?", teamPlayers.UserID).First(&team)
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

	// Calculate the total value of all players in the team
	totalValue := 0
	totalPoints := 0
	for _, player := range players {
		totalValue += player.Value // Assuming Player struct has a Value field
		totalPoints += player.Points
	}

	// Check if the total value exceeds the user's budget
	if totalValue > team.User.Budget { // Assuming User struct has a Budget field
		return fmt.Errorf("the total value of the players exceeds the user's budget")
	}

	team.Points = totalPoints

	UpdateTeamByID(&team)

	// Append players to the team's Players association
	err := db.ORM.Model(&team).Association("Players").Replace(players)
	return err
}

// GetTeamPlayersViewByUserID retrieves a team and its players by user ID and returns it as TeamPlayersView
func GetTeamPlayersViewForUser(userID uint) (*TeamPlayersView, error) {
	var team Team
	result := db.ORM.Preload("Players").Where("user_id = ?", userID).First(&team)
	if result.Error != nil {
		return &TeamPlayersView{
			IsFound: false,
		}, nil
	}

	teamPlayersView := &TeamPlayersView{
		TeamName: team.Name,
		Players:  convertPlayers(team.Players),
		Points:   team.Points,
		IsFound:  true,
	}

	return teamPlayersView, nil
}

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

func GetTeamLeaderBoard() ([]*Team, error) {
	var teams []*Team

	result := db.ORM.Model(&Team{}).Preload("Players").Preload("User").Find(&teams).Order("Points desc")
	if result.Error != nil {
		return nil, result.Error
	}
	return teams, nil
}
