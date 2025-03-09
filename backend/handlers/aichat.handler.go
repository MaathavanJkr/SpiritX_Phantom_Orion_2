// handlers/aichat.handler.go
package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"go-orm-template/db"
	"go-orm-template/models"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
)

var initialPrompt = `You are an AI assistant helping users learn about cricket players and their statistics.

When responding to queries about players, follow these guidelines:

1. Only provide information from these available fields:

2. Never reveal or discuss player points under any circumstances

3. For team suggestions, recommend players based on:
- Batting performance (strike rate, average)
- Bowling performance (economy rate, strike rate) 
- Overall value
- Balanced mix of batsmen and bowlers

4. If asked about information not in the dataset or asked about points respond with:
'not related'

5. Always return name, university, category, total_runs, wickets and value when providing player information

6. Give SQL query inside <SQL>QUERY_HERE</SQL> tags

7. use WHERE name ILIKE '%NAME_HERE%' always. dont use = operator for name or strings.


Table Schema:

players (
  id int8,
  name text,
  university text, 
  category text,
  total_runs int8,
  balls_faced int8,
  innings_played int8,
  wickets int8,
  overs_bowled numeric,
  runs_conceded int8,
  value int8,
  batting_strike_rate numeric,
  batting_average numeric,
  bowling_strike_rate numeric,
  economy_rate numeric
)`

var responsePrompt = `You are an AI assistant helping users learn about university cricket players and their statistics.

When responding to queries:
1. Only provide information that is available in the Query Results provided
2. Never reveal or discuss player points
3. If asked about information not in the QueryResults, respond with "I don't have enough knowledge to answer that question"
4. For team suggestions, recommend players based on their statistics and value, not points
5. When suggesting a team of 11 players, ensure a balanced mix of batsmen and bowlers based on their stats

For specific player queries, use their actual statistics from the database to provide accurate information.

If asked about best team selection, analyze players based on:
- Batting performance (strike rate, average)
- Bowling performance (economy rate, strike rate)
- Overall value
- Balance of skills across the 11 players

Dont mention about SQL queries or database. Dont mention technical terms in response. Give response to user queries based on the data available in the database.

Always maintain a helpful and informative tone while staying within these guidelines.`

func GetResponse(c *gin.Context) {
	var messages []models.Message

	if err := c.ShouldBindJSON(&messages); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	var lastMessageContent string
	if len(messages) > 0 {
		lastMessageContent = messages[len(messages)-1].Content
	} else {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "No messages provided.",
		})
		return
	}

	messages = append([]models.Message{
		{
			Role:    "system",
			Content: initialPrompt,
		},
	}, messages...)

	// Create request body
	requestBody := map[string]interface{}{
		"model":    "gpt-4",
		"messages": messages,
	}

	// Make request to OpenAI API
	client := &http.Client{}
	jsonData, err := json.Marshal(requestBody)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	req, err := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", bytes.NewBuffer(jsonData))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Add headers
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", "Bearer "+os.Getenv("OPENAI_API_KEY"))

	// Send request
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}
	defer resp.Body.Close()

	// Parse response
	var response models.Response
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Extract SQL query from response
	content := response.Choices[0].Message.Content

	fmt.Printf("Content: %v\n", content)

	if content == "not related" {
		c.JSON(http.StatusOK, gin.H{
			"query_results": []interface{}{},
			"explanation":   "I don't have enough knowledge to answer that question.",
		})
		return
	}

	// Find SQL query between tags
	startTag := "<SQL>"
	endTag := "</SQL>"
	startIndex := strings.Index(content, startTag)
	endIndex := strings.Index(content, endTag)

	if startIndex == -1 || endIndex == -1 {
		c.JSON(http.StatusOK, gin.H{
			"query_results": []interface{}{},
			"explanation":   "I don't have enough knowledge to answer that question.",
		})
		return
	}

	// Extract the query
	query := content[startIndex+len(startTag) : endIndex]

	// Execute the query
	var results []map[string]interface{}
	if err := db.ORM.Raw(query).Scan(&results).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"query_results": []interface{}{},
			"error":         err.Error(),
		})
		return
	}

	// Prepare data for second OpenAI request
	secondPrompt := fmt.Sprintf("%s\n\nUser Query: %s\n\nSQL Query Used: %s\n\nQuery Results: %v", responsePrompt, lastMessageContent, query, results)

	fmt.Printf("User Query: %s\n\nSQL Query Used: %s\n\nQuery Results: %v", lastMessageContent, query, results)
	secondRequestBody := models.ChatRequest{
		Model: "gpt-3.5-turbo",
		Messages: []models.Message{
			{
				Role:    "system",
				Content: secondPrompt,
			},
		},
	}

	secondJsonData, err := json.Marshal(secondRequestBody)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Create second request to OpenAI
	secondReq, err := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", bytes.NewBuffer(secondJsonData))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	secondReq.Header.Add("Content-Type", "application/json")
	secondReq.Header.Add("Authorization", "Bearer "+os.Getenv("OPENAI_API_KEY"))

	// Send second request
	secondResp, err := client.Do(secondReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	defer secondResp.Body.Close()

	// Parse second response
	var secondResponse models.Response
	if err := json.NewDecoder(secondResp.Body).Decode(&secondResponse); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Extract the explanation
	explanation := secondResponse.Choices[0].Message.Content

	// Return both the AI response and query results
	c.JSON(http.StatusOK, gin.H{
		"query_results": results,
		"explanation":   explanation,
	})
}
