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

	if len(os.Args) > 1 {
		switch os.Args[1] {
		case "migrate":
			fmt.Println("Migrating User...")
			db.ORM.AutoMigrate(&models.User{})
			fmt.Println("Migrating Team...")
			db.ORM.AutoMigrate(&models.Team{})
			fmt.Println("Migrating Player...")
			db.ORM.AutoMigrate(&models.Player{})
			fmt.Println("Migrating Finished.")
			return
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
