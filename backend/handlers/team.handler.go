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
