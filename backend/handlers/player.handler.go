// handlers/player.go
package handlers

import (
	"fmt"
	"go-orm-template/models"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

// Global variable to hold the WebSocket connection
var wsConnection *websocket.Conn

func PlayerWebSocket(c *gin.Context) {
	// Upgrade the connection to a websocket connection
	ws, err := models.Upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		fmt.Println(err)
		return
	}
	defer ws.Close()

	// Store the WebSocket connection
	wsConnection = ws

	for {
		// Read message from browser
		msgType, msg, err := ws.ReadMessage()
		if err != nil {
			fmt.Println(err)
			break
		}

		// Print the message to the console
		fmt.Printf("Received: %s\n", msg)

		// Write message back to the browser
		err = ws.WriteMessage(msgType, msg)
		if err != nil {
			fmt.Println(err)
			break
		}
	}
}

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

	NotifySubscribers("player", "add", &player.ID)

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

func GetPlayerByIDForUser(c *gin.Context) {
	id := c.Param("id")
	player, err := models.GetPlayerByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	playerForUser := models.PlayerForUser{
		ID:                player.ID,
		Name:              player.Name,
		University:        player.University,
		Category:          player.Category,
		TotalRuns:         player.TotalRuns,
		BallsFaced:        player.BallsFaced,
		InningsPlayed:     player.InningsPlayed,
		Wickets:           player.Wickets,
		OversBowled:       player.OversBowled,
		RunsConceded:      player.RunsConceded,
		Value:             player.Value,
		BattingStrikeRate: player.BattingStrikeRate,
		BattingAverage:    player.BattingAverage,
		BowlingStrikeRate: player.BowlingStrikeRate,
		EconomyRate:       player.EconomyRate,
	}

	c.JSON(http.StatusOK, playerForUser)
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

	role, exists := c.Get("role")

	fmt.Printf("Role: %v\n", role)

	if exists && role == "user" {
		var playersForUser []models.PlayerForUser
		for _, player := range players {
			playersForUser = append(playersForUser, models.PlayerForUser{
				ID:                player.ID,
				Name:              player.Name,
				University:        player.University,
				Category:          player.Category,
				TotalRuns:         player.TotalRuns,
				BallsFaced:        player.BallsFaced,
				InningsPlayed:     player.InningsPlayed,
				Wickets:           player.Wickets,
				OversBowled:       player.OversBowled,
				RunsConceded:      player.RunsConceded,
				Value:             player.Value,
				BattingStrikeRate: player.BattingStrikeRate,
				BattingAverage:    player.BattingAverage,
				BowlingStrikeRate: player.BowlingStrikeRate,
				EconomyRate:       player.EconomyRate,
			})
		}
		c.JSON(http.StatusOK, playersForUser)
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

	NotifySubscribers("player", "update", &player.ID)

	c.JSON(http.StatusOK, gin.H{"message": "Successfully updated player"})
}

func DeletePlayer(c *gin.Context) {
	id := c.Param("id")
	err := models.DeletePlayerByID(id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	NotifySubscribers("player", "delete", nil)

	c.JSON(http.StatusOK, gin.H{"message": "Successfully deleted player"})
}

func GetTournamentSummary(c *gin.Context) {
	summary, err := models.GetTournamentSummary()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, summary)
}
