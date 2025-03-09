// handlers/aichat.handler.go
package handlers

import (
	"bytes"
	"encoding/json"
	"go-orm-template/models"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func GetResponse(c *gin.Context) {
	var messages []models.Message

	if err := c.ShouldBindJSON(&messages); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Create request body
	requestBody := map[string]interface{}{
		"model":    "gpt-4",
		"messages": messages,
	}

	// Make request to OpenAI API
	client := &http.Client{}
	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	req, err := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Add headers
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", "Bearer "+os.Getenv("OPENAI_API_KEY"))

	// Send request
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer resp.Body.Close()

	// Parse response
	var response models.Response
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, response)
}
