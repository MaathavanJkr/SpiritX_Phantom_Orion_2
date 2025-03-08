package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

// Initialize the configuration
var Port, DBUser, DBPassword, DBName, DBHost, DBPort string

func LoadConfig() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	Port = os.Getenv("PORT")

	DBUser = os.Getenv("DB_USER")
	DBPassword = os.Getenv("DB_PASSWORD")
	DBName = os.Getenv("DB_NAME")
	DBHost = os.Getenv("DB_HOST")
	DBPort = os.Getenv("DB_PORT")
}
