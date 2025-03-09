// handlers/team.go
package handlers

import (
	"fmt"
	"go-orm-template/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AddTeam(c *gin.Context) {
	var team models.Team
	var err error
	if err := c.ShouldBindJSON(&team); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = models.AddTeam(&team)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Successfully added team"})
}

func GetTeamByID(c *gin.Context) {
	id := c.Param("id")
	team, err := models.GetTeamByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, team)
}

func GetAllTeams(c *gin.Context) {
	teams, err := models.GetAllTeams()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, teams)
}

func GetAllTeamsByFilter(c *gin.Context) {
	filters := make(map[string]interface{})
	if userId := c.Query("user_id"); userId != "" {
		filters["user_id"] = userId
	}
	if name := c.Query("name"); name != "" {
		filters["name"] = name
	}

	fmt.Printf("Filters: %v\n", filters)

	teams, err := models.GetTeamsByFilters(filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, teams)
}

func UpdateTeam(c *gin.Context) {
	id := c.Param("id")
	team, err := models.GetTeamByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := c.ShouldBindJSON(&team); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = models.UpdateTeamByID(team)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully updated team"})
}

func DeleteTeam(c *gin.Context) {
	id := c.Param("id")
	err := models.DeleteTeamByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully deleted team"})
}

func UpdateMyTeam(c *gin.Context) {
	id, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found"})
		return
	}

	team := &models.Team{}

	team, err := models.GetTeamByUserID(fmt.Sprintf("%v", id))

	if err != nil {
		team = &models.Team{
			UserID: id.(uint),
		}
	}

	if err := c.ShouldBindJSON(&team); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = models.UpdateTeamByID(team)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully updated team"})
}

//Add players to the team by user

func AssingPlayersToTeamByUserID(c *gin.Context) {
	var payload struct {
		PlayerIDs []uint `json:"player_ids"`
	}

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found"})
		return
	}

	teamPlayers := models.TeamPlayers{
		UserID:    userID.(uint),
		PlayerIDs: payload.PlayerIDs,
	}

	err := models.AssignPlayersToTeamByUserID(teamPlayers)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Successfully added players to team"})
}

func GetMyTeam(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "User ID not found"})
		return
	}

	teamPlayersView, err := models.GetMyTeamModel(userID.(uint))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, teamPlayersView)
}

func GetTeamLeaderBoard(c *gin.Context) {
	leaderBoard, err := models.GetTeamLeaderBoard()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, leaderBoard)
}
