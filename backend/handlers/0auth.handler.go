// handlers/user.go
package handlers

import (
	"fmt"
	"go-orm-template/auth"
	"go-orm-template/models"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func UserLogin(c *gin.Context) {
	var user *models.UserWithPassword
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request format",
			"details": err.Error(),
		})
		return
	}

	userInDB, err := models.GetUserByUsername(user.Username)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Authentication failed",
			"details": "Incorrect username",
		})
		return
	}

	if !auth.VerifyPassword(user.Password, userInDB.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error":   "Authentication failed",
			"details": "Wrong password",
		})
		return
	}

	token, err := auth.GenerateJWT(user.Username, "user")
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Internal server error",
			"details": "Could not generate token",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Login successful",
		"token":   token,
		"user":    userInDB,
	})
}

func UserRegister(c *gin.Context) {
	var userReg models.UserRegistration
	if err := c.ShouldBindJSON(&userReg); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid request format",
			"details": err.Error(),
		})
		return
	}

	// Validate username characters
	if err := models.ValidateUsername(userReg.Username); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid username",
			"details": err.Error(),
		})
		return
	}

	// Validate password characters
	if err := models.ValidatePassword(userReg.Password); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error":   "Invalid password",
			"details": err.Error(),
		})
		return
	}

	hashedPassword, err := auth.HashPassword(userReg.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Internal server error",
			"details": err.Error(),
		})
		return
	}

	// Create User from UserRegistration
	user := models.User{
		Name:     userReg.Name,
		Username: userReg.Username,
		Password: hashedPassword,
		Role:     "user",
		Approved: true,
	}

	fmt.Printf("Registering user: %+v\n", user)

	// Create the user in database
	if err := models.AddUser(&user); err != nil {
		errorMsg := "Internal server error"
		if strings.Contains(err.Error(), "duplicate") {
			errorMsg = "Registration failed"
			c.JSON(http.StatusConflict, gin.H{
				"error":   errorMsg,
				"details": "Username already exists",
			})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   errorMsg,
			"details": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User registered successfully",
		"user":    user,
	})
}
