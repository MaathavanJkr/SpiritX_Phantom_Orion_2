// main.go
package main

import (
	"fmt"
	"log"
	"os"

	"go-orm-template/config"
	"go-orm-template/db"
	"go-orm-template/models"
	"go-orm-template/router"
	"go-orm-template/scripts"
)

func main() {
	config.LoadConfig()

	db.InitDB(config.DBUser, config.DBPassword, config.DBName, config.DBHost, config.DBPort)

	if db.ORM == nil {
		log.Fatal("Database connection not established")
	}

	if os.Getenv("MIGRATE") == "true" {
		db.ORM.AutoMigrate(&models.User{})
		db.ORM.AutoMigrate(&models.Team{})
		db.ORM.AutoMigrate(&models.Player{})
	}

	if len(os.Args) > 1 {
		switch os.Args[1] {
		case "players":
			scripts.ImportPlayersFromCSV()
			return
		case "users":
			scripts.ImportDefaultUsers()
			return
		}
	}

	r := router.NewRouter()
	log.Fatal(r.Run(fmt.Sprintf(":%s", config.Port)))
}
