// main.go
package main

import (
	"fmt"
	"log"

	"go-orm-template/config"
	"go-orm-template/db"
	"go-orm-template/models"
	"go-orm-template/router"
)

func main() {
	config.LoadConfig()

	db.InitDB(config.DBUser, config.DBPassword, config.DBName, config.DBHost, config.DBPort)

	if db.ORM == nil {
		log.Fatal("Database connection not established")
	}

	db.ORM.AutoMigrate(&models.User{})

	r := router.NewRouter()
	log.Fatal(r.Run(fmt.Sprintf(":%s", config.Port)))
}
