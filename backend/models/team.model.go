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
	Value   int       `json:"value"`
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
	Value    int      `json:"value"`
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
	result := db.ORM.Preload("User").Where("user_id = ?", teamPlayers.UserID).First(&team)
	if result.Error != nil {
		return result.Error
	}

	if len(teamPlayers.PlayerIDs) == 0 {
		err := db.ORM.Model(&team).Association("Players").Clear()
		go updateTeamPointsAndValue(&team)
		return err
	}

	var players []*Player
	result = db.ORM.Find(&players, teamPlayers.PlayerIDs)
	if result.Error != nil {
		return result.Error
	}

	// Check if adding the new players would exceed the maximum limit of 11 players
	if len(players) > 11 {
		return fmt.Errorf("maximum limit of 11 players per team exceeded by %d", len(players)-11)
	}

	// Calculate the total value of all players in the team
	totalValue := 0
	for _, player := range players {
		totalValue += *player.Value
	}

	// Check if the total value exceeds the user's budget
	if totalValue > team.User.Budget { // Assuming User struct has a Budget field
		return fmt.Errorf("the total value of the players exceeds the user's budget")
	}

	go updateTeamPointsAndValue(&team)

	// Append players to the team's Players association
	err := db.ORM.Model(&team).Association("Players").Replace(players)
	return err
}

func updateTeamPointsAndValue(team *Team) {
	totalValue := 0
	totalPoints := 0
	for _, player := range team.Players {
		totalValue += *player.Value
		totalPoints += *player.Points
	}

	team.Points = totalPoints
	team.Value = totalValue

	UpdateTeamByID(team)
}

func UpdateAllTeamsPointsAndValue() {
	teams, err := GetAllTeams()
	if err != nil {
		fmt.Printf("Error updating all teams points and value: %v\n", err)
		return
	}
	for _, team := range teams {
		updateTeamPointsAndValue(team)
	}
	fmt.Printf("Updated all teams points and value\n")
}

// GetTeamPlayersViewByUserID retrieves a team and its players by user ID and returns it as TeamPlayersView
func GetMyTeamModel(userID uint) (*TeamPlayersView, error) {
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
		Value:    team.Value,
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

func GetTeamByUserID(userID string) (*Team, error) {
	var team *Team
	result := db.ORM.Where("user_id = ?", userID).First(&team)

	if result.Error != nil {
		return nil, result.Error
	}
	return team, nil
}

func GetTeamsByPlayerID(playerID uint) ([]*Team, error) {
	var teams []*Team
	result := db.ORM.Model(&Team{}).
		Joins("JOIN player_teams ON player_teams.team_id = teams.id").
		Where("player_teams.player_id = ?", playerID).
		Find(&teams)

	if result.Error != nil {
		return nil, result.Error
	}
	for _, team := range teams {
		fmt.Printf("Team Name: %s, Points: %d, Value: %d\n", team.Name, team.Points, team.Value)
	}
	return teams, nil
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
