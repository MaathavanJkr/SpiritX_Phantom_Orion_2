// handlers/player.go
package handlers

import (
	"fmt"
	"go-orm-template/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func AddPlayer(c *gin.Context) {
	var player models.Player
	var err error
	if err := c.ShouldBindJSON(&player); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = models.AddPlayer(&player)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Successfully added player"})
}

func GetPlayerByID(c *gin.Context) {
	id := c.Param("id")
	player, err := models.GetPlayerByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, player)
}

func GetAllPlayers(c *gin.Context) {
	players, err := models.GetAllPlayers()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, players)
}

func GetAllPlayersByFilter(c *gin.Context) {
	filters := make(map[string]interface{})
	if university := c.Query("university"); university != "" {
		filters["university"] = university
	}
	if category := c.Query("category"); category != "" {
		filters["category"] = category
	}
	if totalRuns := c.Query("total_runs"); totalRuns != "" {
		filters["total_runs >"] = totalRuns // Assuming you want to filter for greater than
	}
	if totalRuns := c.Query("total_runs_lt"); totalRuns != "" {
		filters["total_runs <"] = totalRuns // Assuming you want to filter for less than
	}
	if wickets := c.Query("wickets"); wickets != "" {
		filters["wickets >"] = wickets // Assuming you want to filter for greater than
	}
	if wickets := c.Query("wickets_lt"); wickets != "" {
		filters["wickets <"] = wickets // Assuming you want to filter for less than
	}

	fmt.Printf("Filters: %v\n", filters)

	players, err := models.GetPlayersByFilters(filters)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, players)
}

func UpdatePlayer(c *gin.Context) {
	id := c.Param("id")
	player, err := models.GetPlayerByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	if err := c.ShouldBindJSON(&player); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = models.UpdatePlayerByID(player)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully updated player"})
}

func DeletePlayer(c *gin.Context) {
	id := c.Param("id")
	err := models.DeletePlayerByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Successfully deleted player"})
}
