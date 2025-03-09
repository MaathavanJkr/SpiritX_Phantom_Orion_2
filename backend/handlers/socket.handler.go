package handlers

import (
	"fmt"
	"go-orm-template/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func NotifySubscribers(entity string, action string, id *uint) {
	models.UpdateAllTeamsPointsAndValue()
	// Notify via WebSocket
	if wsConnection != nil {
		uniqueID := uuid.New().String()
		err := wsConnection.WriteJSON(gin.H{"entity": "entity", "action": action, "id": id, "uid": uniqueID})
		if err != nil {
			fmt.Println("Error sending WebSocket message:", err)
		}
	}
}
