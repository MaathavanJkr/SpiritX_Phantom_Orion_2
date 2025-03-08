// models/user.go
package models

import (
	"fmt"
	"go-orm-template/db"
	"strings"
)

type User struct {
	GormModel
	Name     string `json:"name"`
	Role     string `json:"role"`
	Username string `json:"username" gorm:"unique"`
	Password string `json:"-"`
	Approved bool   `json:"approved"`
}
type UserWithPassword struct {
	User
	Password string `json:"password"`
}

type UserRegistration struct {
	Name     string `json:"name"`
	Username string `json:"username"`
	Password string `json:"password"`
}

// ValidateUsername checks if a username meets the minimum requirements
func ValidateUsername(username string) error {
	// Check minimum length
	if len(username) < 8 {
		return fmt.Errorf("username must be at least 8 characters long")
	}

	// Check for invalid characters
	if strings.ContainsAny(username, "!@#$%^&*()_+-=[]{};':\",./<>?`~ ") {
		return fmt.Errorf("username contains invalid characters")
	}

	// Check if username already exists
	_, err := GetUserByUsername(username)
	if err == nil {
		return fmt.Errorf("username already exists")
	}

	return nil
}

// ValidatePassword checks if a password meets the minimum requirements
func ValidatePassword(password string) error {
	// Check minimum length
	if len(password) < 8 {
		return fmt.Errorf("password must be at least 8 characters long")
	}

	// Check for required character types
	hasLower := strings.ContainsAny(password, "abcdefghijklmnopqrstuvwxyz")
	hasUpper := strings.ContainsAny(password, "ABCDEFGHIJKLMNOPQRSTUVWXYZ")
	hasSpecial := strings.ContainsAny(password, "!@#$%^&*()_+-=[]{};':\",./<>?`~")

	if !hasLower || !hasUpper || !hasSpecial {
		return fmt.Errorf("password must contain at least one lowercase letter, one uppercase letter, and one special character")
	}

	return nil
}

// AddUser creates a new user record in the database
func AddUser(user *User) error {
	result := db.ORM.Create(&user)
	return result.Error
}

// GetUserByID retrieves a user record from the database by ID
func GetUserByID(id string) (*User, error) {
	var user *User
	result := db.ORM.First(&user, id)

	if result.Error != nil {
		return nil, result.Error
	}
	return user, nil
}

// GetUserByUsername retrieves a user record from the database by ID
func GetUserByUsername(username string) (*User, error) {
	user := &User{Username: username}
	result := db.ORM.Where(user).First(&user)

	if result.Error != nil {
		return nil, result.Error
	}
	return user, nil
}

func GetAllUsers() ([]*User, error) {
	var users []*User

	result := db.ORM.Find(&users)
	if result.Error != nil {
		return nil, result.Error
	}
	return users, nil
}

// UpdateUserByID updates an existing user record in the database
func UpdateUserByID(user *User) error {
	result := db.ORM.Save(&user)
	return result.Error
}

// DeleteUserByID deletes a user record from the database by ID
func DeleteUserByID(id string) error {
	var user *User
	result := db.ORM.Delete(&user, id)
	return result.Error
}
